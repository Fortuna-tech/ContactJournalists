import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { JournalistDashboardSidebar } from "@/components/sidebars";

const JournalistLayout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <JournalistDashboardSidebar />
      <main className="w-full flex flex-col min-h-screen">
        <div className="flex-1">{children || <Outlet />}</div>
        <footer className="p-6 mt-auto text-sm text-muted-foreground">
          <div className="container mx-auto flex flex-wrap gap-6 justify-center md:justify-between">
            <div className="flex gap-6">
              <a href="#" className="hover:underline">
                Terms
              </a>
              <a href="#" className="hover:underline">
                Privacy
              </a>
              <a href="#" className="hover:underline">
                Data Processing Notice
              </a>
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:underline">
                Right to Erasure
              </a>
              <a href="#" className="hover:underline">
                Contact Support
              </a>
            </div>
          </div>
        </footer>
      </main>
    </SidebarProvider>
  );
};

export default JournalistLayout;
