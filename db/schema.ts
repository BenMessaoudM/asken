import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, uniqueIndex, index } from "drizzle-orm/sqlite-core";

export const admins = sqliteTable("admins", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull(),
  displayName: text("display_name").notNull().default(""),
  role: text("role", { enum: ["super_admin", "admin", "editor", "association_rep"] }).notNull().default("editor"),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("idx_admins_email").on(table.email)]);

export const contentItems = sqliteTable("content_items", {
  id: text("id").primaryKey(),
  type: text("type", { enum: ["news", "event", "page", "person", "navigation", "cor", "setting"] }).notNull(),
  slug: text("slug").notNull(),
  status: text("status", { enum: ["draft", "published", "scheduled"] }).notNull().default("draft"),
  reviewStatus: text("review_status", { enum: ["editing", "ready", "approved"] }).notNull().default("editing"),
  publishAt: text("publish_at"),
  titleSv: text("title_sv").notNull(),
  titleEn: text("title_en").notNull().default(""),
  summarySv: text("summary_sv").notNull().default(""),
  summaryEn: text("summary_en").notNull().default(""),
  bodySv: text("body_sv").notNull().default(""),
  bodyEn: text("body_en").notNull().default(""),
  extraTranslations: text("extra_translations").notNull().default("{}"),
  startsAt: text("starts_at"),
  endsAt: text("ends_at"),
  location: text("location").notNull().default(""),
  ctaUrl: text("cta_url").notNull().default(""),
  imageUrl: text("image_url").notNull().default(""),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdBy: text("created_by").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex("idx_content_type_slug").on(table.type, table.slug),
  index("idx_content_type_status_updated").on(table.type, table.status, table.updatedAt),
]);

export const contentRevisions = sqliteTable("content_revisions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  contentId: text("content_id").notNull(),
  version: integer("version").notNull(),
  snapshot: text("snapshot").notNull(),
  actorEmail: text("actor_email").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("idx_content_revision_version").on(table.contentId, table.version), index("idx_content_revision_content").on(table.contentId, table.createdAt)]);

export const collaborations = sqliteTable("collaborations", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull(),
  name: text("name").notNull(),
  type: text("type", { enum: ["association", "sponsor", "company", "partner", "alumni"] }).notNull().default("partner"),
  shortDescriptionSv: text("short_description_sv").notNull().default(""),
  shortDescriptionEn: text("short_description_en").notNull().default(""),
  descriptionSv: text("description_sv").notNull().default(""),
  descriptionEn: text("description_en").notNull().default(""),
  websiteUrl: text("website_url").notNull().default(""),
  logoUrl: text("logo_url").notNull().default(""),
  brandColor: text("brand_color").notNull().default("#A32F8E"),
  contactName: text("contact_name").notNull().default(""),
  contactEmail: text("contact_email").notNull().default(""),
  agreementStartsAt: text("agreement_starts_at"),
  agreementEndsAt: text("agreement_ends_at"),
  approvalStatus: text("approval_status", { enum: ["draft", "approved", "expired"] }).notNull().default("draft"),
  internalNotes: text("internal_notes").notNull().default(""),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  visible: integer("visible", { mode: "boolean" }).notNull().default(true),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("idx_collaborations_slug").on(table.slug), index("idx_collaborations_public").on(table.active, table.visible)]);

export const eventCollaborations = sqliteTable("event_collaborations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  eventId: text("event_id").notNull(),
  collaborationId: text("collaboration_id").notNull(),
  role: text("role", { enum: ["sponsor", "partner", "organizer", "host"] }).notNull().default("partner"),
  visiblePublicly: integer("visible_publicly", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
}, (table) => [uniqueIndex("idx_event_collaboration").on(table.eventId, table.collaborationId), index("idx_event_collabs_event").on(table.eventId)]);

export const liveCorItems = sqliteTable("live_cor_items", {
  id: text("id").primaryKey(),
  type: text("type", { enum: ["status", "office_hours", "presence", "public_event"] }).notNull(),
  titleSv: text("title_sv").notNull(),
  titleEn: text("title_en").notNull().default(""),
  descriptionSv: text("description_sv").notNull().default(""),
  descriptionEn: text("description_en").notNull().default(""),
  collaborationId: text("collaboration_id"),
  startsAt: text("starts_at"),
  endsAt: text("ends_at"),
  space: text("space").notNull().default(""),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  visiblePublicly: integer("visible_publicly", { mode: "boolean" }).notNull().default(false),
  createdBy: text("created_by").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index("idx_live_cor_public_time").on(table.active, table.visiblePublicly, table.startsAt)]);

export const corCalendarEvents = sqliteTable("cor_calendar_events", {
  id: text("id").primaryKey(),
  sourceUid: text("source_uid").notNull(),
  titleSv: text("title_sv").notNull(),
  titleEn: text("title_en").notNull(),
  associationSlug: text("association_slug"),
  brandColor: text("brand_color").notNull().default("#A32F8E"),
  startsAt: text("starts_at").notNull(),
  endsAt: text("ends_at").notNull(),
  resources: text("resources").notNull().default("[]"),
  category: text("category", { enum: ["association", "ask", "private"] }).notNull().default("private"),
  tentative: integer("tentative", { mode: "boolean" }).notNull().default(false),
  allDay: integer("all_day", { mode: "boolean" }).notNull().default(false),
  visiblePublicly: integer("visible_publicly", { mode: "boolean" }).notNull().default(true),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  sourceUpdatedAt: text("source_updated_at"),
  importedAt: text("imported_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  importedBy: text("imported_by").notNull().default(""),
}, (table) => [
  uniqueIndex("idx_cor_calendar_source_uid").on(table.sourceUid),
  index("idx_cor_calendar_active_time").on(table.active, table.startsAt, table.endsAt),
]);

export const rateLimits = sqliteTable("rate_limits", {
  key: text("key").primaryKey(),
  count: integer("count").notNull().default(1),
  resetAt: integer("reset_at").notNull(),
}, (table) => [index("idx_rate_limits_reset").on(table.resetAt)]);

export const bookingRequests = sqliteTable("booking_requests", {
  id: text("id").primaryKey(),
  reference: text("reference").notNull(),
  statusToken: text("status_token").notNull(),
  status: text("status", { enum: ["pending", "quoted", "approved", "contract_sent", "signed", "cancelled"] }).notNull().default("pending"),
  bookerType: text("booker_type", { enum: ["internal_ask", "arcada_association", "external", "external_member", "alumni"] }).notNull(),
  organizationName: text("organization_name").notNull().default(""),
  contactName: text("contact_name").notNull(),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone").notNull().default(""),
  billingName: text("billing_name").notNull(),
  billingStreet: text("billing_street").notNull(),
  billingPostalCode: text("billing_postal_code").notNull(),
  billingCity: text("billing_city").notNull(),
  billingCountry: text("billing_country").notNull().default("Finland"),
  startsAt: text("starts_at").notNull(),
  endsAt: text("ends_at").notNull(),
  resources: text("resources").notNull().default("[]"),
  purposeSv: text("purpose_sv").notNull().default(""),
  purposeEn: text("purpose_en").notNull().default(""),
  estimatedPriceCents: integer("estimated_price_cents"),
  finalPriceCents: integer("final_price_cents"),
  contractLanguage: text("contract_language", { enum: ["sv", "en", "fi"] }).notNull().default("sv"),
  doorCode: text("door_code").notNull().default(""),
  memberNumber: text("member_number").notNull().default(""),
  memberVerified: integer("member_verified", { mode: "boolean" }).notNull().default(false),
  associationVerified: integer("association_verified", { mode: "boolean" }).notNull().default(false),
  packageSize: integer("package_size"),
  depositCents: integer("deposit_cents").notNull().default(0),
  amountPaidCents: integer("amount_paid_cents").notNull().default(0),
  invoiceStatus: text("invoice_status", { enum: ["not_required", "draft", "sent", "paid", "overdue", "credited"] }).notNull().default("draft"),
  contractStatus: text("contract_status", { enum: ["not_required", "draft", "sent", "signed", "declined"] }).notNull().default("draft"),
  cleaningStatus: text("cleaning_status", { enum: ["not_checked", "approved", "needs_cleaning", "disputed"] }).notNull().default("not_checked"),
  cleaningFeeCents: integer("cleaning_fee_cents").notNull().default(0),
  damageChargeCents: integer("damage_charge_cents").notNull().default(0),
  cancellationReason: text("cancellation_reason").notNull().default(""),
  cancelledAt: text("cancelled_at"),
  retentionUntil: text("retention_until"),
  deletedAt: text("deleted_at"),
  deletedBy: text("deleted_by").notNull().default(""),
  internalNotes: text("internal_notes").notNull().default(""),
  privacyAcceptedAt: text("privacy_accepted_at").notNull(),
  privacyNoticeVersion: text("privacy_notice_version").notNull().default("2026-09-05"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("idx_bookings_reference").on(table.reference), uniqueIndex("idx_bookings_status_token").on(table.statusToken), index("idx_bookings_status_start").on(table.status, table.startsAt)]);

export const bookingOccurrences = sqliteTable("booking_occurrences", {
  id: text("id").primaryKey(),
  bookingId: text("booking_id").notNull(),
  startsAt: text("starts_at").notNull(),
  endsAt: text("ends_at").notNull(),
  resources: text("resources").notNull().default("[]"),
  status: text("status", { enum: ["active", "cancelled"] }).notNull().default("active"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index("idx_booking_occurrence_time").on(table.status, table.startsAt, table.endsAt), index("idx_booking_occurrence_booking").on(table.bookingId)]);

export const bookingBlocks = sqliteTable("booking_blocks", {
  id: text("id").primaryKey(),
  startsAt: text("starts_at").notNull(),
  endsAt: text("ends_at").notNull(),
  resources: text("resources").notNull().default("[]"),
  reasonSv: text("reason_sv").notNull().default(""),
  reasonEn: text("reason_en").notNull().default(""),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  createdBy: text("created_by").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index("idx_booking_block_time").on(table.active, table.startsAt, table.endsAt)]);

export const bookingActivity = sqliteTable("booking_activity", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  bookingId: text("booking_id").notNull(),
  action: text("action").notNull(),
  actor: text("actor").notNull(),
  notes: text("notes").notNull().default(""),
  metadata: text("metadata").notNull().default("{}"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index("idx_booking_activity_booking").on(table.bookingId, table.createdAt)]);

export const bookingEvidence = sqliteTable("booking_evidence", {
  id: text("id").primaryKey(),
  bookingId: text("booking_id").notNull(),
  type: text("type", { enum: ["cleaning_before", "cleaning_after", "damage", "access", "other"] }).notNull().default("other"),
  fileUrl: text("file_url").notNull(),
  note: text("note").notNull().default(""),
  shareWithBooker: integer("share_with_booker", { mode: "boolean" }).notNull().default(false),
  createdBy: text("created_by").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index("idx_booking_evidence_booking").on(table.bookingId, table.createdAt)]);

export const dataRequests = sqliteTable("data_requests", {
  id: text("id").primaryKey(),
  reference: text("reference").notNull(),
  type: text("type", { enum: ["access", "correction", "deletion", "restriction", "objection", "portability", "photo_consent"] }).notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  details: text("details").notNull().default(""),
  status: text("status", { enum: ["received", "verifying", "processing", "completed", "rejected"] }).notNull().default("received"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("idx_data_requests_reference").on(table.reference), index("idx_data_requests_status").on(table.status, table.createdAt)]);

export const formSubmissions = sqliteTable("form_submissions", {
  id: text("id").primaryKey(),
  reference: text("reference").notNull(),
  type: text("type", { enum: ["contact", "support", "harassment", "tutoring", "recruitment", "partnership", "event"] }).notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  organization: text("organization").notNull().default(""),
  message: text("message").notNull(),
  consentToContact: integer("consent_to_contact", { mode: "boolean" }).notNull().default(false),
  privacyNoticeVersion: text("privacy_notice_version").notNull().default("2026-09-05"),
  status: text("status", { enum: ["new", "in_progress", "answered", "closed"] }).notNull().default("new"),
  retentionUntil: text("retention_until").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("idx_form_submissions_reference").on(table.reference), index("idx_form_submissions_status").on(table.type, table.status, table.createdAt)]);

export const notificationOutbox = sqliteTable("notification_outbox", {
  id: text("id").primaryKey(),
  channel: text("channel", { enum: ["email"] }).notNull().default("email"),
  template: text("template").notNull(),
  recipient: text("recipient").notNull(),
  locale: text("locale").notNull().default("sv"),
  payload: text("payload").notNull().default("{}"),
  status: text("status", { enum: ["pending", "sent", "failed", "cancelled"] }).notNull().default("pending"),
  attempts: integer("attempts").notNull().default(0),
  lastError: text("last_error").notNull().default(""),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  sentAt: text("sent_at"),
}, (table) => [index("idx_notification_outbox_status").on(table.status, table.createdAt)]);

export const integrations = sqliteTable("integrations", {
  id: text("id").primaryKey(),
  provider: text("provider").notNull(),
  category: text("category", { enum: ["email", "membership", "crm", "analytics", "calendar", "accounting", "payment", "other"] }).notNull(),
  status: text("status", { enum: ["planned", "configured", "active", "paused"] }).notNull().default("planned"),
  purpose: text("purpose").notNull().default(""),
  personalData: text("personal_data").notNull().default(""),
  dataRegion: text("data_region").notNull().default(""),
  dpaReviewedAt: text("dpa_reviewed_at"),
  enabled: integer("enabled", { mode: "boolean" }).notNull().default(false),
  updatedBy: text("updated_by").notNull().default(""),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("idx_integrations_provider").on(table.provider)]);

export const publicDocuments = sqliteTable("public_documents", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull(),
  category: text("category", { enum: ["council_agenda", "council_minutes", "bylaws", "regulation", "policy", "form", "annual_report", "other"] }).notNull(),
  titleSv: text("title_sv").notNull(),
  titleEn: text("title_en").notNull().default(""),
  descriptionSv: text("description_sv").notNull().default(""),
  descriptionEn: text("description_en").notNull().default(""),
  fileUrl: text("file_url").notNull(),
  meetingDate: text("meeting_date"),
  language: text("language").notNull().default("sv"),
  status: text("status", { enum: ["draft", "published"] }).notNull().default("draft"),
  createdBy: text("created_by").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("idx_public_documents_slug").on(table.slug), index("idx_public_documents_public").on(table.status, table.category, table.meetingDate)]);

export const auditLogs = sqliteTable("audit_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  actorEmail: text("actor_email").notNull(),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  details: text("details").notNull().default("{}"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index("idx_audit_entity").on(table.entityType, table.entityId), index("idx_audit_created").on(table.createdAt)]);

export const bookingSettings = sqliteTable("booking_settings", {
  id: text("id").primaryKey().default("default"),
  externalFirstHours: integer("external_first_hours").notNull().default(4),
  externalFirstHourlyCents: integer("external_first_hourly_cents").notNull().default(5000),
  externalAfterHourlyCents: integer("external_after_hourly_cents").notNull().default(3000),
  externalKitchenCents: integer("external_kitchen_cents").notNull().default(5000),
  saunaPerDateCents: integer("sauna_per_date_cents").notNull().default(3000),
  associationWeekendCents: integer("association_weekend_cents").notNull().default(7500),
  associationPackage3Cents: integer("association_package_3_cents").notNull().default(21000),
  associationPackage5Cents: integer("association_package_5_cents").notNull().default(32500),
  associationPackage10Cents: integer("association_package_10_cents").notNull().default(60000),
  internalFreeBookings: integer("internal_free_bookings").notNull().default(1),
  maxBookingHours: integer("max_booking_hours").notNull().default(18),
  maxAdvanceMonths: integer("max_advance_months").notNull().default(18),
  maxDatesPerRequest: integer("max_dates_per_request").notNull().default(10),
  hallCapacity: integer("hall_capacity").notNull().default(80),
  kitchenCapacity: integer("kitchen_capacity").notNull().default(8),
  saunaCapacity: integer("sauna_capacity").notNull().default(20),
  cleaningFeeCents: integer("cleaning_fee_cents").notNull().default(15000),
  updatedBy: text("updated_by").notNull().default(""),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const themeSchedules = sqliteTable("theme_schedules", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  theme: text("theme", { enum: ["default", "gulis", "christmas", "new_year", "vappu", "midsummer", "halloween", "pride", "independence", "swedish_day"] }).notNull().default("default"),
  startsAt: text("starts_at").notNull(),
  endsAt: text("ends_at").notNull(),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  updatedBy: text("updated_by").notNull().default(""),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index("idx_theme_schedule_active").on(table.active, table.startsAt, table.endsAt)]);
