import { model, Schema, Types } from 'mongoose';

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    status: { type: String, enum: ['active', 'disabled'], required: true, default: 'active' },
    roleIds: [{ type: Types.ObjectId, ref: 'Role', required: true }],
    passwordChangedAt: { type: Date, required: true, default: Date.now },
    schemaVersion: { type: Number, required: true, default: 1 },
  },
  { timestamps: true },
);

export const UserModel = model('User', userSchema);
