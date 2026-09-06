CREATE TABLE `admins` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`display_name` text DEFAULT '' NOT NULL,
	`role` text DEFAULT 'editor' NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_admins_email` ON `admins` (`email`);--> statement-breakpoint
CREATE TABLE `content_items` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`slug` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`title_sv` text NOT NULL,
	`title_en` text DEFAULT '' NOT NULL,
	`summary_sv` text DEFAULT '' NOT NULL,
	`summary_en` text DEFAULT '' NOT NULL,
	`body_sv` text DEFAULT '' NOT NULL,
	`body_en` text DEFAULT '' NOT NULL,
	`extra_translations` text DEFAULT '{}' NOT NULL,
	`starts_at` text,
	`ends_at` text,
	`location` text DEFAULT '' NOT NULL,
	`cta_url` text DEFAULT '' NOT NULL,
	`image_url` text DEFAULT '' NOT NULL,
	`featured` integer DEFAULT false NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_by` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_content_type_slug` ON `content_items` (`type`,`slug`);--> statement-breakpoint
CREATE INDEX `idx_content_type_status_updated` ON `content_items` (`type`,`status`,`updated_at`);