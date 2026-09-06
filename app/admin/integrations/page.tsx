import {chatGPTSignInPath,getChatGPTUser} from "@/app/chatgpt-auth";
import {requireAdminRole} from "@/lib/admin";
import IntegrationDashboard from "./integration-dashboard";
export const dynamic="force-dynamic";
export default async function Page(){const user=await getChatGPTUser();if(!user)return <main className="signin-page"><div><h1>ASK Backoffice</h1><a href={chatGPTSignInPath("/admin/integrations")} target="_top">Sign in</a></div></main>;const auth=await requireAdminRole(["super_admin","admin"]);if(!auth)return <main className="signin-page"><div><h1>Forbidden</h1><a href="/admin">Back</a></div></main>;return <IntegrationDashboard/>}
