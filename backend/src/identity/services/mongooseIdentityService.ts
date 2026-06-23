import { Types } from 'mongoose';
import { AppError } from '../../http/errors';
import { Env } from '../../env';
import { PermissionModel } from '../models/Permission';
import { RefreshSessionModel } from '../models/RefreshSession';
import { RoleModel } from '../models/Role';
import { UserModel } from '../models/User';
import { hashPassword, verifyPassword } from '../security/password';
import { hashToken, issueTokens, verifyRefreshToken } from '../security/tokens';
import {
  AuthPrincipal,
  AuthSession,
  IdentityService,
  ManagedPermission,
  ManagedRole,
  ManagedUser,
  RequestContext,
} from '../types';
import { recordAudit } from './audit';

type PopulatedPermission = { _id: Types.ObjectId; key: string; description: string };
type PopulatedRole = {
  _id: Types.ObjectId;
  key: string;
  name: string;
  description: string;
  isSystem: boolean;
  permissionIds: PopulatedPermission[];
};
type PopulatedUser = {
  _id: Types.ObjectId;
  email: string;
  name: string;
  status: 'active' | 'disabled';
  passwordHash?: string;
  roleIds: PopulatedRole[];
  createdAt: Date;
  updatedAt: Date;
};

export class MongooseIdentityService implements IdentityService {
  constructor(private readonly env: Env) {}

  async login(email: string, password: string, context: RequestContext): Promise<AuthSession> {
    const user = (await UserModel.findOne({ email: email.trim().toLowerCase() })
      .select('+passwordHash')
      .populate({ path: 'roleIds', populate: { path: 'permissionIds' } })
      .lean()) as PopulatedUser | null;

    if (!user || user.status !== 'active' || !user.passwordHash || !(await verifyPassword(password, user.passwordHash))) {
      await recordAudit({ action: 'auth.login_failed', context, metadata: { email: email.trim().toLowerCase() } });
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Email or password is incorrect');
    }

    const principal = this.toPrincipal(user);
    const sessionId = new Types.ObjectId().toString();
    const tokens = issueTokens(principal.userId, sessionId, this.env);
    await RefreshSessionModel.create({
      _id: sessionId,
      userId: user._id,
      tokenHash: hashToken(tokens.refreshToken),
      expiresAt: tokens.refreshExpiresAt,
      createdByIp: context.ip,
      userAgent: context.userAgent,
    });
    await recordAudit({ actorId: principal.userId, action: 'auth.login_succeeded', targetType: 'user', targetId: principal.userId, context });
    return { principal, ...tokens };
  }

  async refresh(refreshToken: string, context: RequestContext): Promise<AuthSession> {
    let claims;
    try {
      claims = verifyRefreshToken(refreshToken, this.env);
    } catch {
      throw new AppError(401, 'INVALID_REFRESH_TOKEN', 'Refresh token is invalid or expired');
    }

    const session = await RefreshSessionModel.findOne({
      _id: claims.sid,
      userId: claims.sub,
      revokedAt: { $exists: false },
      expiresAt: { $gt: new Date() },
    });
    if (!session || session.tokenHash !== hashToken(refreshToken)) {
      throw new AppError(401, 'INVALID_REFRESH_TOKEN', 'Refresh token is invalid or expired');
    }

    const principal = await this.getPrincipal(claims.sub);
    if (!principal) throw new AppError(401, 'SESSION_REVOKED', 'Session is no longer valid');

    const tokens = issueTokens(principal.userId, claims.sid, this.env);
    session.tokenHash = hashToken(tokens.refreshToken);
    session.expiresAt = tokens.refreshExpiresAt;
    session.lastUsedAt = new Date();
    session.createdByIp = context.ip;
    session.userAgent = context.userAgent;
    await session.save();
    await recordAudit({ actorId: principal.userId, action: 'auth.token_refreshed', targetType: 'session', targetId: claims.sid, context });
    return { principal, ...tokens };
  }

  async logout(refreshToken: string | undefined, principal: AuthPrincipal | undefined, context: RequestContext): Promise<void> {
    if (refreshToken) {
      try {
        const claims = verifyRefreshToken(refreshToken, this.env);
        await RefreshSessionModel.updateOne({ _id: claims.sid }, { $set: { revokedAt: new Date() } });
      } catch {
        // Cookies are still cleared to make logout idempotent.
      }
    }
    await recordAudit({ actorId: principal?.userId, action: 'auth.logout', targetType: 'user', targetId: principal?.userId, context });
  }

  async getPrincipal(userId: string): Promise<AuthPrincipal | null> {
    if (!Types.ObjectId.isValid(userId)) return null;
    const user = (await UserModel.findOne({ _id: userId, status: 'active' })
      .populate({ path: 'roleIds', populate: { path: 'permissionIds' } })
      .lean()) as PopulatedUser | null;
    return user ? this.toPrincipal(user) : null;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string, context: RequestContext): Promise<void> {
    const user = await UserModel.findById(userId).select('+passwordHash');
    if (!user || !(await verifyPassword(currentPassword, user.passwordHash as string))) {
      await recordAudit({ actorId: userId, action: 'auth.password_change_failed', targetType: 'user', targetId: userId, context });
      throw new AppError(400, 'CURRENT_PASSWORD_INVALID', 'Current password is incorrect');
    }
    if (await verifyPassword(newPassword, user.passwordHash as string)) {
      throw new AppError(400, 'PASSWORD_REUSED', 'New password must be different');
    }
    user.passwordHash = await hashPassword(newPassword, this.env.BCRYPT_ROUNDS);
    user.passwordChangedAt = new Date();
    await user.save();
    await RefreshSessionModel.updateMany({ userId, revokedAt: { $exists: false } }, { $set: { revokedAt: new Date() } });
    await recordAudit({ actorId: userId, action: 'auth.password_changed', targetType: 'user', targetId: userId, context });
  }

  async listUsers(): Promise<ManagedUser[]> {
    const users = (await UserModel.find().populate('roleIds').sort({ createdAt: -1 }).lean()) as unknown as PopulatedUser[];
    return users.map((user) => this.toManagedUser(user));
  }

  async createUser(input: { email: string; name: string; password: string; roleIds: string[] }, actor: AuthPrincipal, context: RequestContext): Promise<ManagedUser> {
    const email = input.email.trim().toLowerCase();
    if (await UserModel.exists({ email })) throw new AppError(409, 'EMAIL_IN_USE', 'Email is already in use');
    await this.assertRoleIds(input.roleIds);
    const user = await UserModel.create({
      email,
      name: input.name.trim(),
      passwordHash: await hashPassword(input.password, this.env.BCRYPT_ROUNDS),
      roleIds: input.roleIds,
      status: 'active',
      passwordChangedAt: new Date(),
    });
    await recordAudit({ actorId: actor.userId, action: 'user.created', targetType: 'user', targetId: user.id, context, metadata: { email, roleIds: input.roleIds } });
    return this.getManagedUser(user.id);
  }

  async updateUser(input: { userId: string; roleIds?: string[]; status?: 'active' | 'disabled' }, actor: AuthPrincipal, context: RequestContext): Promise<ManagedUser> {
    if (input.userId === actor.userId && input.status === 'disabled') throw new AppError(400, 'SELF_DISABLE_FORBIDDEN', 'You cannot disable your own account');
    if (input.userId === actor.userId && input.roleIds) throw new AppError(400, 'SELF_ROLE_CHANGE_FORBIDDEN', 'You cannot change your own roles');
    if (input.roleIds) await this.assertRoleIds(input.roleIds);
    const superAdminRole = await RoleModel.findOne({ key: 'super_admin' }).lean();
    if (superAdminRole) {
      const target = await UserModel.findById(input.userId).lean();
      if (!target) throw new AppError(404, 'USER_NOT_FOUND', 'User was not found');
      const hasSuperAdminRole = target.roleIds.some((roleId) => roleId.toString() === superAdminRole._id.toString());
      const keepsSuperAdminRole = input.roleIds ? input.roleIds.includes(superAdminRole._id.toString()) : true;
      const removesFinalSuperAdmin = hasSuperAdminRole && ((input.status === 'disabled') || !keepsSuperAdminRole);
      if (removesFinalSuperAdmin && await UserModel.countDocuments({ status: 'active', roleIds: superAdminRole._id }) <= 1) {
        throw new AppError(400, 'LAST_SUPER_ADMIN_REQUIRED', 'At least one active Super Admin is required');
      }
    }
    const update: Record<string, unknown> = {};
    if (input.roleIds) update.roleIds = input.roleIds;
    if (input.status) update.status = input.status;
    const user = await UserModel.findByIdAndUpdate(input.userId, { $set: update }, { new: true });
    if (!user) throw new AppError(404, 'USER_NOT_FOUND', 'User was not found');
    if (input.status === 'disabled') await RefreshSessionModel.updateMany({ userId: input.userId }, { $set: { revokedAt: new Date() } });
    await recordAudit({ actorId: actor.userId, action: 'user.updated', targetType: 'user', targetId: input.userId, context, metadata: update });
    return this.getManagedUser(input.userId);
  }

  async listRoles(): Promise<ManagedRole[]> {
    const roles = (await RoleModel.find().populate('permissionIds').sort({ name: 1 }).lean()) as unknown as PopulatedRole[];
    return roles.map((role) => this.toManagedRole(role));
  }

  async createRole(input: { key: string; name: string; description?: string; permissionIds: string[] }, actor: AuthPrincipal, context: RequestContext): Promise<ManagedRole> {
    await this.assertPermissionIds(input.permissionIds);
    if (await RoleModel.exists({ key: input.key.toLowerCase() })) throw new AppError(409, 'ROLE_KEY_IN_USE', 'Role key is already in use');
    const role = await RoleModel.create({ key: input.key, name: input.name, description: input.description || '', permissionIds: input.permissionIds, isSystem: false });
    await recordAudit({ actorId: actor.userId, action: 'role.created', targetType: 'role', targetId: role.id, context, metadata: { key: role.key } });
    return this.getManagedRole(role.id);
  }

  async updateRolePermissions(roleId: string, permissionIds: string[], actor: AuthPrincipal, context: RequestContext): Promise<ManagedRole> {
    await this.assertPermissionIds(permissionIds);
    const existingRole = await RoleModel.findById(roleId);
    if (!existingRole) throw new AppError(404, 'ROLE_NOT_FOUND', 'Role was not found');
    if (existingRole.isSystem) throw new AppError(400, 'SYSTEM_ROLE_IMMUTABLE', 'System role permissions are managed by the seed configuration');
    const role = await RoleModel.findByIdAndUpdate(roleId, { $set: { permissionIds } }, { new: true });
    if (!role) throw new AppError(404, 'ROLE_NOT_FOUND', 'Role was not found');
    await recordAudit({ actorId: actor.userId, action: 'role.permissions_updated', targetType: 'role', targetId: roleId, context, metadata: { permissionIds } });
    return this.getManagedRole(roleId);
  }

  async listPermissions(): Promise<ManagedPermission[]> {
    const permissions = await PermissionModel.find().sort({ key: 1 }).lean();
    return permissions.map((permission) => ({ id: permission._id.toString(), key: permission.key, description: permission.description }));
  }

  private toPrincipal(user: PopulatedUser): AuthPrincipal {
    const roles = user.roleIds || [];
    return {
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      roles: roles.map((role) => role.key),
      permissions: [...new Set(roles.flatMap((role) => (role.permissionIds || []).map((permission) => permission.key)))],
    };
  }

  private toManagedUser(user: PopulatedUser): ManagedUser {
    return { id: user._id.toString(), email: user.email, name: user.name, status: user.status, roles: (user.roleIds || []).map((role) => ({ id: role._id.toString(), key: role.key, name: role.name })), createdAt: user.createdAt, updatedAt: user.updatedAt };
  }

  private toManagedRole(role: PopulatedRole): ManagedRole {
    return { id: role._id.toString(), key: role.key, name: role.name, description: role.description, isSystem: role.isSystem, permissions: (role.permissionIds || []).map((permission) => ({ id: permission._id.toString(), key: permission.key, description: permission.description })) };
  }

  private async getManagedUser(userId: string): Promise<ManagedUser> {
    const user = (await UserModel.findById(userId).populate('roleIds').lean()) as PopulatedUser | null;
    if (!user) throw new AppError(404, 'USER_NOT_FOUND', 'User was not found');
    return this.toManagedUser(user);
  }

  private async getManagedRole(roleId: string): Promise<ManagedRole> {
    const role = (await RoleModel.findById(roleId).populate('permissionIds').lean()) as PopulatedRole | null;
    if (!role) throw new AppError(404, 'ROLE_NOT_FOUND', 'Role was not found');
    return this.toManagedRole(role);
  }

  private async assertRoleIds(roleIds: string[]) {
    if (roleIds.some((id) => !Types.ObjectId.isValid(id))) throw new AppError(400, 'INVALID_ROLE', 'One or more roles are invalid');
    if ((await RoleModel.countDocuments({ _id: { $in: roleIds } })) !== roleIds.length) throw new AppError(400, 'INVALID_ROLE', 'One or more roles are invalid');
  }

  private async assertPermissionIds(permissionIds: string[]) {
    if (permissionIds.some((id) => !Types.ObjectId.isValid(id))) throw new AppError(400, 'INVALID_PERMISSION', 'One or more permissions are invalid');
    if ((await PermissionModel.countDocuments({ _id: { $in: permissionIds } })) !== permissionIds.length) throw new AppError(400, 'INVALID_PERMISSION', 'One or more permissions are invalid');
  }
}
