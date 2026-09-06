CREATE TABLE `form_submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`reference` text NOT NULL,
	`type` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`organization` text DEFAULT '' NOT NULL,
	`message` text NOT NULL,
	`consent_to_contact` integer DEFAULT false NOT NULL,
	`privacy_notice_version` text DEFAULT '2026-09-05' NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`retention_until` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_form_submissions_reference` ON `form_submissions` (`reference`);--> statement-breakpoint
CREATE INDEX `idx_form_submissions_status` ON `form_submissions` (`type`,`status`,`created_at`);