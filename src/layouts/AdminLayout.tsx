import { Outlet, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminDashboardSidebar } from "@/components/sidebars/AdminDashboardSidebar";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const AdminLayout = ({ children }: { children?: React.ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdminAccess = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setIsAdmin(false);
        return;
      }

      const { data: staffRecord } = await supabase
        .from("staff_privileges")
        .select("user_id")
        .eq("user_id", user.id)
        .single();

      setIsAdmin(!!staffRecord);
    };

    checkAdminAccess();
  }, []);

  // Loading state
  if (isAdmin === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Not authorized
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <SidebarProvider>
      <AdminDashboardSidebar />
      <main className="w-full flex flex-col min-h-screen">
        <div className="flex-1">{children || <Outlet />}</div>
      </main>
    </SidebarProvider>
  );
};

export default AdminLayout;
