import { getDb } from "@/db";
import { bookingSettings } from "@/db/schema";
import { DEFAULT_BOOKING_POLICY, type BookingPolicy } from "@/lib/booking";

export async function getBookingPolicy(): Promise<BookingPolicy> {
  const rows = await getDb().select().from(bookingSettings).limit(1);
  if (!rows.length) return DEFAULT_BOOKING_POLICY;
  const { id: _id, updatedBy: _updatedBy, updatedAt: _updatedAt, ...policy } = rows[0];
  void _id; void _updatedBy; void _updatedAt;
  return policy;
}
