import { chatGPTSignInPath, getChatGPTUser } from "@/app/chatgpt-auth";
import AdminDashboard from "./admin-dashboard";
import {requireAdmin} from "@/lib/admin";
export const dynamic="force-dynamic";
export default async function AdminPage(){
  const user=await getChatGPTUser();
  if(!user)return <main className="signin-page"><div><img className="signin-logo" src="/ask-symbol-purple.png" alt="ASK"/><h1>ASK Backoffice</h1><p>Logga in för att hantera webbplatsen. Sign in to manage the website.</p><a href={chatGPTSignInPath("/admin")} target="_top">Logga in / Sign in with ChatGPT</a><small>Endast behöriga administratörer · Authorised administrators only.</small></div></main>;
  const auth=await requireAdmin();
  if(!auth||auth.admin.role==="association_rep")return <main className="signin-page"><div><img className="signin-logo" src="/ask-symbol-purple.png" alt="ASK"/><h1>Ingen behörighet</h1><p>This account is not authorised for ASK content administration.</p><a href="/">Till webbplatsen / Back to site</a></div></main>;
  return <AdminDashboard user={auth.user} role={auth.admin.role}/>;
}
