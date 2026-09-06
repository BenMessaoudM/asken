import type {Metadata} from "next";
import BookingStatus from "@/components/booking-status";
export const metadata:Metadata={robots:{index:false,follow:false,nocache:true},referrer:"no-referrer"};
export default function Page(){return <BookingStatus lang="en"/>}
