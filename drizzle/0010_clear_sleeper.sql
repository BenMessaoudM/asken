CREATE TABLE `cor_calendar_events` (
	`id` text PRIMARY KEY NOT NULL,
	`source_uid` text NOT NULL,
	`title_sv` text NOT NULL,
	`title_en` text NOT NULL,
	`association_slug` text,
	`brand_color` text DEFAULT '#A32F8E' NOT NULL,
	`starts_at` text NOT NULL,
	`ends_at` text NOT NULL,
	`resources` text DEFAULT '[]' NOT NULL,
	`category` text DEFAULT 'private' NOT NULL,
	`tentative` integer DEFAULT false NOT NULL,
	`all_day` integer DEFAULT false NOT NULL,
	`visible_publicly` integer DEFAULT true NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`source_updated_at` text,
	`imported_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`imported_by` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_cor_calendar_source_uid` ON `cor_calendar_events` (`source_uid`);--> statement-breakpoint
CREATE INDEX `idx_cor_calendar_active_time` ON `cor_calendar_events` (`active`,`starts_at`,`ends_at`);--> statement-breakpoint
CREATE TABLE `rate_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer DEFAULT 1 NOT NULL,
	`reset_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_rate_limits_reset` ON `rate_limits` (`reset_at`);--> statement-breakpoint
ALTER TABLE `collaborations` ADD `brand_color` text DEFAULT '#A32F8E' NOT NULL;