import type {Metadata} from "next";
import HomePage from "@/components/home-page";
export const metadata:Metadata={title:"ASK – Arcada studerandekår",description:"Gemenskap, stöd och studentinflytande vid Arcada.",alternates:{canonical:"/",languages:{sv:"/",en:"/en"}}};
export default function Page(){return <HomePage lang="sv"/>}
