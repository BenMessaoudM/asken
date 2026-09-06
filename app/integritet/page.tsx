import type {Metadata} from "next";
import PrivacyNotice from "@/components/privacy-notice";
export const metadata:Metadata={title:"Integritetsmeddelande för Cor-bokningar | ASK",description:"Hur Arcada studerandekår behandlar personuppgifter i samband med bokningar av Cor-huset."};
export default function Page(){return <PrivacyNotice lang="sv"/>}
