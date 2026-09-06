import type { Metadata } from "next";
import "./globals.css";
import Askungen from "@/components/askungen";
import ThemeController from "@/components/theme-controller";
import CorContextGlobal from "@/components/cor-context-global";

export const metadata: Metadata = {
  title: "ASK — Arcada studerandekår",
  description: "Gemenskap, stöd och studentinflytande vid Arcada.",
  metadataBase: new URL("https://ask-student-union.musse97.chatgpt.site"),
  applicationName: "ASK – Arcada Student Union",
  openGraph: { type:"website",siteName:"ASK – Arcada Student Union",locale:"sv_FI",alternateLocale:["en_FI"],images:["/ask-community-hero.png"] },
  robots: { index:true,follow:true },
  icons: {
    icon: "/ask-symbol-purple.png",
    shortcut: "/ask-symbol-purple.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body className="antialiased">{children}<ThemeController/><CorContextGlobal/><Askungen/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@type":"Organization",name:"ASK – Arcada Student Union",alternateName:"Arcada studerandekår",url:"https://ask-student-union.musse97.chatgpt.site",email:"info@asken.fi",telephone:"+358404890367",address:{"@type":"PostalAddress",streetAddress:"Majstadsgatan 11",postalCode:"00560",addressLocality:"Helsinki",addressCountry:"FI"}})}}/></body>
    </html>
  );
}
