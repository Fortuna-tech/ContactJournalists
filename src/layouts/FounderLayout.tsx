import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { FounderDashboardSidebar } from "@/components/sidebars";

const FounderLayout = () => {
  return (
    <SidebarProvider>
      <FounderDashboardSidebar />
      <main className="w-full">
        <Outlet />
      </main>
    </SidebarProvider>
  );
};

export default FounderLayout;
