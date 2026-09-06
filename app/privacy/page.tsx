import type {Metadata} from "next";
import PrivacyNotice from "@/components/privacy-notice";
export const metadata:Metadata={title:"Cor booking privacy notice | ASK",description:"How Arcada Student Union processes personal data in connection with Cor House bookings."};
export default function Page(){return <PrivacyNotice lang="en"/>}
