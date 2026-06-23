export type EntityId = string;
export type Locale = 'en' | 'sv';

export interface BaseEntity {
  id: EntityId;
  createdAt: Date;
  updatedAt: Date;
  schemaVersion: number;
}

export interface UserEntity extends BaseEntity {
  email: string;
  name: string;
  status: 'active' | 'disabled';
  roleIds: EntityId[];
  passwordChangedAt: Date;
}

export interface RoleEntity extends BaseEntity {
  key: string;
  name: string;
  description: string;
  permissionIds: EntityId[];
  isSystem: boolean;
}

export interface PermissionEntity extends BaseEntity {
  key: string;
  description: string;
}

export interface RefreshSessionEntity extends BaseEntity {
  userId: EntityId;
  tokenHash: string;
  expiresAt: Date;
  revokedAt?: Date;
  lastUsedAt?: Date;
}

export interface TranslationEntity extends BaseEntity {
  entityType: string;
  entityId: EntityId;
  locale: Locale;
  fields: Record<string, unknown>;
  status: 'draft' | 'review' | 'approved';
  sourceRevision?: number;
}

export interface MediaEntity extends BaseEntity {
  storageKey: string;
  mimeType: string;
  sizeBytes: number;
  alternativeText: Partial<Record<Locale, string>>;
}

export interface AuditEventEntity {
  id: EntityId;
  occurredAt: Date;
  actorId?: EntityId;
  action: string;
  targetType?: string;
  targetId?: EntityId;
  ip?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}

export interface NotificationEntity extends BaseEntity {
  recipientId: EntityId;
  channel: 'email' | 'in_app';
  templateKey: string;
  locale: Locale;
  status: 'pending' | 'sent' | 'failed';
  sentAt?: Date;
}
