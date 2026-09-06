CREATE TABLE `booking_settings` (
	`id` text PRIMARY KEY DEFAULT 'default' NOT NULL,
	`external_first_hours` integer DEFAULT 4 NOT NULL,
	`external_first_hourly_cents` integer DEFAULT 5000 NOT NULL,
	`external_after_hourly_cents` integer DEFAULT 3000 NOT NULL,
	`external_kitchen_cents` integer DEFAULT 5000 NOT NULL,
	`sauna_per_date_cents` integer DEFAULT 3000 NOT NULL,
	`association_weekend_cents` integer DEFAULT 7500 NOT NULL,
	`association_package_3_cents` integer DEFAULT 21000 NOT NULL,
	`association_package_5_cents` integer DEFAULT 32500 NOT NULL,
	`association_package_10_cents` integer DEFAULT 60000 NOT NULL,
	`internal_free_bookings` integer DEFAULT 1 NOT NULL,
	`max_booking_hours` integer DEFAULT 18 NOT NULL,
	`max_advance_months` integer DEFAULT 18 NOT NULL,
	`max_dates_per_request` integer DEFAULT 10 NOT NULL,
	`hall_capacity` integer DEFAULT 80 NOT NULL,
	`kitchen_capacity` integer DEFAULT 8 NOT NULL,
	`sauna_capacity` integer DEFAULT 20 NOT NULL,
	`cleaning_fee_cents` integer DEFAULT 15000 NOT NULL,
	`updated_by` text DEFAULT '' NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `theme_schedules` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`theme` text DEFAULT 'default' NOT NULL,
	`starts_at` text NOT NULL,
	`ends_at` text NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`updated_by` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_theme_schedule_active` ON `theme_schedules` (`active`,`starts_at`,`ends_at`);