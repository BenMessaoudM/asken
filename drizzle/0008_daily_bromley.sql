CREATE TABLE `booking_evidence` (
	`id` text PRIMARY KEY NOT NULL,
	`booking_id` text NOT NULL,
	`type` text DEFAULT 'other' NOT NULL,
	`file_url` text NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	`share_with_booker` integer DEFAULT false NOT NULL,
	`created_by` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_booking_evidence_booking` ON `booking_evidence` (`booking_id`,`created_at`);