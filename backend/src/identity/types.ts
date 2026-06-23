export interface AuthPrincipal {
  userId: string;
  email: string;
  name: string;
  roles: string[];
  permissions: string[];
}

export interface RequestContext {
  ip?: string;
  userAgent?: string;
}

export interface AuthSession {
  principal: AuthPrincipal;
  accessToken: string;
  refreshToken: string;
  accessExpiresAt: Date;
  refreshExpiresAt: Date;
}

export interface ManagedUser {
  id: string;
  email: string;
  name: string;
  status: 'active' | 'disabled';
  roles: Array<{ id: string; key: string; name: string }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ManagedRole {
  id: string;
  key: string;
  name: string;
  description: string;
  isSystem: boolean;
  permissions: Array<{ id: string; key: string; description: string }>;
}

export interface ManagedPermission {
  id: string;
  key: string;
  description: string;
}

export interface IdentityService {
  login(email: string, password: string, context: RequestContext): Promise<AuthSession>;
  refresh(refreshToken: string, context: RequestContext): Promise<AuthSession>;
  logout(refreshToken: string | undefined, principal: AuthPrincipal | undefined, context: RequestContext): Promise<void>;
  getPrincipal(userId: string): Promise<AuthPrincipal | null>;
  changePassword(userId: string, currentPassword: string, newPassword: string, context: RequestContext): Promise<void>;
  listUsers(): Promise<ManagedUser[]>;
  createUser(input: { email: string; name: string; password: string; roleIds: string[] }, actor: AuthPrincipal, context: RequestContext): Promise<ManagedUser>;
  updateUser(input: { userId: string; roleIds?: string[]; status?: 'active' | 'disabled' }, actor: AuthPrincipal, context: RequestContext): Promise<ManagedUser>;
  listRoles(): Promise<ManagedRole[]>;
  createRole(input: { key: string; name: string; description?: string; permissionIds: string[] }, actor: AuthPrincipal, context: RequestContext): Promise<ManagedRole>;
  updateRolePermissions(roleId: string, permissionIds: string[], actor: AuthPrincipal, context: RequestContext): Promise<ManagedRole>;
  listPermissions(): Promise<ManagedPermission[]>;
}
