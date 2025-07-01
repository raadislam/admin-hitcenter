// src/app/(dashboard)/layout.tsx
"use client";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  useRequireAuth();
  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <Topbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
