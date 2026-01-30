import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { JournalistDashboardSidebar } from "@/components/sidebars";
import { useEffect } from "react";
import Footer from "@/components/Footer";

const JournalistLayout = ({ children }: { children?: React.ReactNode }) => {
  // Load Caprasimo + DM Sans fonts for journalist dashboard theme
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Caprasimo&family=DM+Sans:wght@400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="journalist-theme min-h-screen bg-[#F5F5DC]">
      <SidebarProvider>
        <JournalistDashboardSidebar />
        <main className="w-full flex flex-col min-h-screen">
          <div className="flex-1">{children || <Outlet />}</div>
          <Footer />
        </main>
      </SidebarProvider>
    </div>
  );
};

export default JournalistLayout;
