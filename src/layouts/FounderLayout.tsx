import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { FounderDashboardSidebar } from "@/components/sidebars";
import { useEffect } from "react";
import Footer from "@/components/Footer";

const FounderLayout = () => {
  // Load Caprasimo + DM Sans fonts for founder dashboard theme
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
    <div className="founder-theme min-h-screen bg-[#F5F5DC]">
      <SidebarProvider>
        <FounderDashboardSidebar />
        <main className="w-full flex flex-col min-h-screen">
          <div className="flex-1">
            <Outlet />
          </div>
          <Footer />
        </main>
      </SidebarProvider>
    </div>
  );
};

export default FounderLayout;
