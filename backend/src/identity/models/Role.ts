import { model, Schema, Types } from 'mongoose';

const roleSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, default: '', trim: true },
    permissionIds: [{ type: Types.ObjectId, ref: 'Permission', required: true }],
    isSystem: { type: Boolean, required: true, default: false },
    schemaVersion: { type: Number, required: true, default: 1 },
  },
  { timestamps: true },
);

export const RoleModel = model('Role', roleSchema);
