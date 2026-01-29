import { Outlet, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminDashboardSidebar } from "@/components/sidebars/AdminDashboardSidebar";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { hasTOTPFactor, getAAL } from "@/lib/mfa";
import { adminTheme, loadAdminFonts } from "@/styles/adminTheme";

type AdminState =
  | "loading"
  | "not-authenticated"
  | "not-staff"
  | "needs-mfa-setup"
  | "needs-mfa-verify"
  | "authorized";

const AdminLayout = ({ children }: { children?: React.ReactNode }) => {
  const [adminState, setAdminState] = useState<AdminState>("loading");

  // Load fonts
  useEffect(() => {
    return loadAdminFonts();
  }, []);

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        // Check if user is authenticated
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setAdminState("not-authenticated");
          return;
        }

        // Check if user is staff
        const { data: staffRecord } = await supabase
          .from("staff_privileges")
          .select("user_id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!staffRecord) {
          setAdminState("not-staff");
          return;
        }

        // Staff user - check MFA status
        const hasTotp = await hasTOTPFactor();
        if (!hasTotp) {
          setAdminState("needs-mfa-setup");
          return;
        }

        // Check AAL level
        const { currentLevel } = await getAAL();
        if (currentLevel !== "aal2") {
          setAdminState("needs-mfa-verify");
          return;
        }

        // All checks passed
        setAdminState("authorized");
      } catch (error) {
        console.error("Error checking admin access:", error);
        setAdminState("not-authenticated");
      }
    };

    checkAdminAccess();
  }, []);

  // Loading state
  if (adminState === "loading") {
    return (
      <div className={adminTheme.page + " flex items-center justify-center"} style={adminTheme.bodyStyle}>
        <div className={adminTheme.loadingSpinner}></div>
      </div>
    );
  }

  // Not authenticated
  if (adminState === "not-authenticated") {
    return <Navigate to="/auth" replace />;
  }

  // Not staff
  if (adminState === "not-staff") {
    return <Navigate to="/" replace />;
  }

  // Needs MFA setup
  if (adminState === "needs-mfa-setup") {
    return <Navigate to="/admin/mfa-setup" replace />;
  }

  // Needs MFA verification
  if (adminState === "needs-mfa-verify") {
    return <Navigate to="/admin/mfa-verify" replace />;
  }

  return (
    <div className={adminTheme.page} style={adminTheme.bodyStyle}>
      <SidebarProvider>
        <AdminDashboardSidebar />
        <main className="w-full flex flex-col min-h-screen">
          <div className={adminTheme.content}>{children || <Outlet />}</div>
        </main>
      </SidebarProvider>
    </div>
  );
};

export default AdminLayout;
