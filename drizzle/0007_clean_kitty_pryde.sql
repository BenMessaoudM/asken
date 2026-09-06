CREATE TABLE `integrations` (
	`id` text PRIMARY KEY NOT NULL,
	`provider` text NOT NULL,
	`category` text NOT NULL,
	`status` text DEFAULT 'planned' NOT NULL,
	`purpose` text DEFAULT '' NOT NULL,
	`personal_data` text DEFAULT '' NOT NULL,
	`data_region` text DEFAULT '' NOT NULL,
	`dpa_reviewed_at` text,
	`enabled` integer DEFAULT false NOT NULL,
	`updated_by` text DEFAULT '' NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_integrations_provider` ON `integrations` (`provider`);--> statement-breakpoint
CREATE TABLE `notification_outbox` (
	`id` text PRIMARY KEY NOT NULL,
	`channel` text DEFAULT 'email' NOT NULL,
	`template` text NOT NULL,
	`recipient` text NOT NULL,
	`locale` text DEFAULT 'sv' NOT NULL,
	`payload` text DEFAULT '{}' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`last_error` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`sent_at` text
);
--> statement-breakpoint
CREATE INDEX `idx_notification_outbox_status` ON `notification_outbox` (`status`,`created_at`);