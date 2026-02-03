import AdminSidebar from "@/app/components/AdminSidebar";
import AppHeader from "@/app/components/AppHeader";

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div id="page-wrapper">
      <AppHeader />
      <AdminSidebar />
      <main id="main" className="bg-gray-50 h-full">
        {children}
      </main>
    </div>
  );
}
