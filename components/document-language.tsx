"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const englishRoots = new Set([
  "en", "about", "history", "board-and-staff", "contact", "membership", "student-card",
  "benefits", "support", "tutoring", "exchange-students", "harassment-support", "recruitment",
  "governance", "council", "student-representatives", "committees", "volunteers", "documents",
  "news", "events", "partnerships", "cor", "cor-spaces", "cor-rules", "collaborations", "search",
  "book-cor", "privacy", "data-protection", "cookies", "terms", "accessibility", "booking"
]);

export default function DocumentLanguage() {
  const pathname = usePathname();
  useEffect(() => {
    const root = pathname.split("/").filter(Boolean)[0] || "";
    document.documentElement.lang = englishRoots.has(root) ? "en" : "sv";
  }, [pathname]);
  return null;
}
