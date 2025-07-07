import AuthWrapper from "@/components/AuthWrapper";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Topbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 bg-muted/50 overflow-auto">
          <AuthWrapper>{children}</AuthWrapper>
        </main>
      </div>
    </div>
  );
}
