import type {Metadata} from "next";
import HomePage from "@/components/home-page";
export const metadata:Metadata={title:"ASK – Arcada Student Union",description:"Community, support and student advocacy at Arcada.",alternates:{canonical:"/en",languages:{sv:"/",en:"/en"}}};
export default function Page(){return <HomePage lang="en"/>}
