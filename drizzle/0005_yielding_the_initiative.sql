CREATE TABLE `content_revisions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`content_id` text NOT NULL,
	`version` integer NOT NULL,
	`snapshot` text NOT NULL,
	`actor_email` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_content_revision_version` ON `content_revisions` (`content_id`,`version`);--> statement-breakpoint
CREATE INDEX `idx_content_revision_content` ON `content_revisions` (`content_id`,`created_at`);--> statement-breakpoint
ALTER TABLE `content_items` ADD `review_status` text DEFAULT 'editing' NOT NULL;