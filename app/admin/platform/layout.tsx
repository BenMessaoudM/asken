import type { ReactNode } from "react";

export default function PlatformLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <nav className="admin-quick-tools" aria-label="Backoffice tools">
        <a href="/admin/settings">Rules &amp; themes</a>
        <a href="/admin/integrations">Integrations &amp; outbox</a>
        <a href="/api/admin/export?type=bookings">Bookings CSV</a>
        <a href="/api/admin/export?type=contacts">Inbox CSV</a>
      </nav>
    </>
  );
}
