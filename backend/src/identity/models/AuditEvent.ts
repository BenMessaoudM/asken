import { model, Schema, Types } from 'mongoose';

const auditEventSchema = new Schema(
  {
    occurredAt: { type: Date, required: true, default: Date.now, index: true },
    actorId: { type: Types.ObjectId, ref: 'User' },
    action: { type: String, required: true, index: true },
    targetType: { type: String },
    targetId: { type: String },
    ip: { type: String },
    userAgent: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  { versionKey: false },
);

export const AuditEventModel = model('AuditEvent', auditEventSchema);
