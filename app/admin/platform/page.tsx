import {chatGPTSignInPath,getChatGPTUser} from "@/app/chatgpt-auth";
import {requireAdminRole} from "@/lib/admin";
import PlatformDashboard from "./platform-dashboard";
export const dynamic="force-dynamic";
export default async function Page(){const user=await getChatGPTUser();if(!user)return <main className="signin-page"><div><img className="signin-logo" src="/ask-symbol-purple.png" alt="ASK"/><h1>ASK Backoffice</h1><p>Logga in / Sign in</p><a href={chatGPTSignInPath("/admin/platform")} target="_top">ChatGPT</a></div></main>;const auth=await requireAdminRole(["super_admin","admin"]);if(!auth)return <main className="signin-page"><div><img className="signin-logo" src="/ask-symbol-purple.png" alt="ASK"/><h1>Ingen behörighet</h1><p>This account is not authorised for platform administration.</p><a href="/admin">Till innehåll / Back to content</a></div></main>;return <PlatformDashboard user={auth.user}/>}
