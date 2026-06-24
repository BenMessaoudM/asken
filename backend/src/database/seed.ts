import mongoose from 'mongoose';
import { loadEnv } from '../env';
import { PermissionModel } from '../identity/models/Permission';
import { RoleModel } from '../identity/models/Role';
import { UserModel } from '../identity/models/User';
import { hashPassword } from '../identity/security/password';

const permissions = [
  ['dashboard.read', 'View the administration overview'],
  ['users.read', 'View users'],
  ['users.write', 'Create and update users'],
  ['roles.read', 'View roles and permissions'],
  ['roles.write', 'Create roles and change permission mappings'],
  ['content.read', 'View content management'],
  ['content.write', 'Create, edit, publish, and delete CMS content'],
  ['news.read', 'View news management'],
  ['news.write', 'Create, edit, schedule, publish, feature, and delete news'],
  ['events.read', 'View event management'],
  ['events.write', 'Create, edit, publish, feature, and delete events'],
  ['cor_activities.read', 'View Cor activity management'],
  ['collaborations.read', 'View collaboration management'],
  ['booking.read', 'View booking management'],
  ['governance.read', 'View governance management'],
  ['settings.read', 'View administration settings'],
  ['audit.read', 'View security audit records'],
] as const;

export async function seedDevelopmentData() {
  const env = loadEnv();
  if (!env.SUPER_ADMIN_EMAIL || !env.SUPER_ADMIN_PASSWORD) {
    throw new Error('SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD are required for identity seeding');
  }
  await mongoose.connect(env.MONGO_URI);

  const permissionDocuments = [];
  for (const [key, description] of permissions) {
    permissionDocuments.push(
      await PermissionModel.findOneAndUpdate(
        { key },
        { $set: { description }, $setOnInsert: { schemaVersion: 1 } },
        { upsert: true, new: true },
      ),
    );
  }

  const superAdminRole = await RoleModel.findOneAndUpdate(
    { key: 'super_admin' },
    {
      $set: {
        name: 'Super Admin',
        description: 'Unrestricted Arcada Student Union – ASK platform administration',
        permissionIds: permissionDocuments.map((permission) => permission._id),
        isSystem: true,
      },
      $setOnInsert: { schemaVersion: 1 },
    },
    { upsert: true, new: true },
  );

  const email = env.SUPER_ADMIN_EMAIL.toLowerCase();
  const existing = await UserModel.findOne({ email }).select('+passwordHash');
  if (!existing) {
    await UserModel.create({
      email,
      name: env.SUPER_ADMIN_NAME,
      passwordHash: await hashPassword(env.SUPER_ADMIN_PASSWORD, env.BCRYPT_ROUNDS),
      status: 'active',
      roleIds: [superAdminRole._id],
      passwordChangedAt: new Date(),
      schemaVersion: 1,
    });
    console.log(`Created initial Super Admin ${email}`);
  } else if (!existing.roleIds.some((roleId) => roleId.toString() === superAdminRole._id.toString())) {
    await UserModel.updateOne({ _id: existing._id }, { $addToSet: { roleIds: superAdminRole._id } });
    console.log(`Granted Super Admin role to ${email}`);
  } else {
    console.log(`Super Admin ${email} already exists`);
  }

  await mongoose.disconnect();
}

if (require.main === module) {
  seedDevelopmentData().catch((error: unknown) => {
    console.error('Seed failed', error);
    process.exit(1);
  });
}
