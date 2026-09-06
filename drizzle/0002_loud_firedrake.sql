CREATE TABLE `audit_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`actor_email` text NOT NULL,
	`action` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`details` text DEFAULT '{}' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_audit_entity` ON `audit_logs` (`entity_type`,`entity_id`);--> statement-breakpoint
CREATE INDEX `idx_audit_created` ON `audit_logs` (`created_at`);--> statement-breakpoint
CREATE TABLE `booking_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`reference` text NOT NULL,
	`status_token` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`booker_type` text NOT NULL,
	`organization_name` text DEFAULT '' NOT NULL,
	`contact_name` text NOT NULL,
	`contact_email` text NOT NULL,
	`contact_phone` text DEFAULT '' NOT NULL,
	`billing_name` text NOT NULL,
	`billing_street` text NOT NULL,
	`billing_postal_code` text NOT NULL,
	`billing_city` text NOT NULL,
	`billing_country` text DEFAULT 'Finland' NOT NULL,
	`starts_at` text NOT NULL,
	`ends_at` text NOT NULL,
	`resources` text DEFAULT '[]' NOT NULL,
	`purpose_sv` text DEFAULT '' NOT NULL,
	`purpose_en` text DEFAULT '' NOT NULL,
	`estimated_price_cents` integer,
	`final_price_cents` integer,
	`contract_language` text DEFAULT 'sv' NOT NULL,
	`door_code` text DEFAULT '' NOT NULL,
	`internal_notes` text DEFAULT '' NOT NULL,
	`privacy_accepted_at` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_bookings_reference` ON `booking_requests` (`reference`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_bookings_status_token` ON `booking_requests` (`status_token`);--> statement-breakpoint
CREATE INDEX `idx_bookings_status_start` ON `booking_requests` (`status`,`starts_at`);--> statement-breakpoint
CREATE TABLE `collaborations` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`type` text DEFAULT 'partner' NOT NULL,
	`short_description_sv` text DEFAULT '' NOT NULL,
	`short_description_en` text DEFAULT '' NOT NULL,
	`description_sv` text DEFAULT '' NOT NULL,
	`description_en` text DEFAULT '' NOT NULL,
	`website_url` text DEFAULT '' NOT NULL,
	`logo_url` text DEFAULT '' NOT NULL,
	`internal_notes` text DEFAULT '' NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`visible` integer DEFAULT true NOT NULL,
	`featured` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_collaborations_slug` ON `collaborations` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_collaborations_public` ON `collaborations` (`active`,`visible`);--> statement-breakpoint
CREATE TABLE `event_collaborations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_id` text NOT NULL,
	`collaboration_id` text NOT NULL,
	`role` text DEFAULT 'partner' NOT NULL,
	`visible_publicly` integer DEFAULT true NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_event_collaboration` ON `event_collaborations` (`event_id`,`collaboration_id`);--> statement-breakpoint
CREATE INDEX `idx_event_collabs_event` ON `event_collaborations` (`event_id`);--> statement-breakpoint
CREATE TABLE `live_cor_items` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`title_sv` text NOT NULL,
	`title_en` text DEFAULT '' NOT NULL,
	`description_sv` text DEFAULT '' NOT NULL,
	`description_en` text DEFAULT '' NOT NULL,
	`collaboration_id` text,
	`starts_at` text,
	`ends_at` text,
	`space` text DEFAULT '' NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`visible_publicly` integer DEFAULT false NOT NULL,
	`created_by` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_live_cor_public_time` ON `live_cor_items` (`active`,`visible_publicly`,`starts_at`);