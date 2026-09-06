CREATE TABLE `booking_activity` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`booking_id` text NOT NULL,
	`action` text NOT NULL,
	`actor` text NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`metadata` text DEFAULT '{}' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_booking_activity_booking` ON `booking_activity` (`booking_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `booking_blocks` (
	`id` text PRIMARY KEY NOT NULL,
	`starts_at` text NOT NULL,
	`ends_at` text NOT NULL,
	`resources` text DEFAULT '[]' NOT NULL,
	`reason_sv` text DEFAULT '' NOT NULL,
	`reason_en` text DEFAULT '' NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`created_by` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_booking_block_time` ON `booking_blocks` (`active`,`starts_at`,`ends_at`);--> statement-breakpoint
CREATE TABLE `booking_occurrences` (
	`id` text PRIMARY KEY NOT NULL,
	`booking_id` text NOT NULL,
	`starts_at` text NOT NULL,
	`ends_at` text NOT NULL,
	`resources` text DEFAULT '[]' NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_booking_occurrence_time` ON `booking_occurrences` (`status`,`starts_at`,`ends_at`);--> statement-breakpoint
CREATE INDEX `idx_booking_occurrence_booking` ON `booking_occurrences` (`booking_id`);--> statement-breakpoint
CREATE TABLE `data_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`reference` text NOT NULL,
	`type` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`details` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'received' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_data_requests_reference` ON `data_requests` (`reference`);--> statement-breakpoint
CREATE INDEX `idx_data_requests_status` ON `data_requests` (`status`,`created_at`);--> statement-breakpoint
CREATE TABLE `public_documents` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`category` text NOT NULL,
	`title_sv` text NOT NULL,
	`title_en` text DEFAULT '' NOT NULL,
	`description_sv` text DEFAULT '' NOT NULL,
	`description_en` text DEFAULT '' NOT NULL,
	`file_url` text NOT NULL,
	`meeting_date` text,
	`language` text DEFAULT 'sv' NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_by` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_public_documents_slug` ON `public_documents` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_public_documents_public` ON `public_documents` (`status`,`category`,`meeting_date`);--> statement-breakpoint
ALTER TABLE `booking_requests` ADD `member_number` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `booking_requests` ADD `member_verified` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `booking_requests` ADD `association_verified` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `booking_requests` ADD `package_size` integer;--> statement-breakpoint
ALTER TABLE `booking_requests` ADD `deposit_cents` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `booking_requests` ADD `amount_paid_cents` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `booking_requests` ADD `invoice_status` text DEFAULT 'draft' NOT NULL;--> statement-breakpoint
ALTER TABLE `booking_requests` ADD `contract_status` text DEFAULT 'draft' NOT NULL;--> statement-breakpoint
ALTER TABLE `booking_requests` ADD `cleaning_status` text DEFAULT 'not_checked' NOT NULL;--> statement-breakpoint
ALTER TABLE `booking_requests` ADD `cleaning_fee_cents` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `booking_requests` ADD `damage_charge_cents` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `booking_requests` ADD `cancellation_reason` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `booking_requests` ADD `cancelled_at` text;--> statement-breakpoint
ALTER TABLE `booking_requests` ADD `retention_until` text;--> statement-breakpoint
ALTER TABLE `booking_requests` ADD `deleted_at` text;--> statement-breakpoint
ALTER TABLE `booking_requests` ADD `deleted_by` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `collaborations` ADD `contact_name` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `collaborations` ADD `contact_email` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `collaborations` ADD `agreement_starts_at` text;--> statement-breakpoint
ALTER TABLE `collaborations` ADD `agreement_ends_at` text;--> statement-breakpoint
ALTER TABLE `collaborations` ADD `approval_status` text DEFAULT 'draft' NOT NULL;