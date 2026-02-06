import SupervisorSidebar from "@/app/components/SupervisorSidebar";
import AppHeader from "@/app/components/AppHeader";

export default function ShopsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div id="page-wrapper">
      <AppHeader />
      <SupervisorSidebar />
      <main>{children}</main>
    </div>
  );
}
