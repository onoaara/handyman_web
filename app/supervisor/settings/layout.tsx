import SupervisorSidebar from "@/app/components/SupervisorSidebar";
import AppHeader from "@/app/components/AppHeader";

export default function SettingsLayout({
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
