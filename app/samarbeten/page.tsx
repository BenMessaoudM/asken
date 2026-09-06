import type {Metadata} from "next";
import PartnerDirectory from "@/components/partner-directory";
export const metadata:Metadata={title:"Föreningar och samarbeten | ASK",description:"Studentföreningar vid Arcada och ASK:s aktiva samarbetspartner."};
export default function Page(){return <PartnerDirectory lang="sv"/>}
