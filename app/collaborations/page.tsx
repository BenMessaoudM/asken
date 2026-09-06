import type {Metadata} from "next";
import PartnerDirectory from "@/components/partner-directory";
export const metadata:Metadata={title:"Associations and collaborations | ASK",description:"Student associations at Arcada and ASK’s active collaboration partners."};
export default function Page(){return <PartnerDirectory lang="en"/>}
