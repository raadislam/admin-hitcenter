// app/(dashboard)/layout.tsx
"use client"
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import { useRequireAuth } from "@/hooks/useRequireAuth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { checking } = useRequireAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Topbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 bg-muted/50 overflow-auto">
          {checking ? (
            // Only content area is loading
            <div className="flex items-center justify-center h-full">
              {/* Use your best spinner */}
              <svg
                className="animate-spin h-8 w-8 text-primary"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
