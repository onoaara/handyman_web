import AdminSidebar from "@/app/components/AdminSidebar";
import AppHeader from "@/app/components/AppHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div id="page-wrapper">
      <AppHeader />
      <AdminSidebar />
      <main>{children}</main>
    </div>
  );
}
