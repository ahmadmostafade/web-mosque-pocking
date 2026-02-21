import type { Metadata } from "next";
import AdminAuthGuard from "@/components/AdminAuthGuard";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthGuard>
      <div className="admin-layout">{children}</div>
    </AdminAuthGuard>
  );
}
