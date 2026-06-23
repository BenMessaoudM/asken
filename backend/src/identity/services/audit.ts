import { AuditEventModel } from '../models/AuditEvent';
import { RequestContext } from '../types';

export async function recordAudit(input: {
  actorId?: string;
  action: string;
  targetType?: string;
  targetId?: string;
  context: RequestContext;
  metadata?: Record<string, unknown>;
}) {
  await AuditEventModel.create({
    occurredAt: new Date(),
    actorId: input.actorId,
    action: input.action,
    targetType: input.targetType,
    targetId: input.targetId,
    ip: input.context.ip,
    userAgent: input.context.userAgent,
    metadata: input.metadata,
  });
}
