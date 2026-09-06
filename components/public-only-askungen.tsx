"use client";

import { usePathname } from "next/navigation";
import Askungen from "@/components/askungen";

export default function PublicOnlyAskungen() {
  const pathname = usePathname();
  return pathname === "/admin" || pathname.startsWith("/admin/") ? null : <Askungen />;
}
