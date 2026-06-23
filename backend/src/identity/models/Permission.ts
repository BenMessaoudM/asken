import { model, Schema } from 'mongoose';

const permissionSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    schemaVersion: { type: Number, required: true, default: 1 },
  },
  { timestamps: true },
);

export const PermissionModel = model('Permission', permissionSchema);
