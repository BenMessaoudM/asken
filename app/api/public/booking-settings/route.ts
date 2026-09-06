import { getBookingPolicy } from "@/lib/booking-policy";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return Response.json({ policy: await getBookingPolicy() }, { headers: { "Cache-Control": "public, max-age=60" } });
  } catch {
    const { DEFAULT_BOOKING_POLICY } = await import("@/lib/booking");
    return Response.json({ policy: DEFAULT_BOOKING_POLICY }, { headers: { "Cache-Control": "public, max-age=30" } });
  }
}
