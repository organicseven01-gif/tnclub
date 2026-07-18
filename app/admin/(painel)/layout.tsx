import type { Metadata } from "next";
import { AdminSidebar } from "@/layout/AdminSidebar";

export const metadata: Metadata = {
  title: "TN Club | Painel Administrativo",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-surface">
      <AdminSidebar />
      <main className="lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">{children}</div>
      </main>
    </div>
  );
}
