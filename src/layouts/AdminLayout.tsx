import { Outlet, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminDashboardSidebar } from "@/components/sidebars/AdminDashboardSidebar";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { hasTOTPFactor, getAAL } from "@/lib/mfa";
import { adminTheme, loadAdminFonts } from "@/styles/adminTheme";
import Footer from "@/components/Footer";

type AdminState =
  | "loading"
  | "not-authenticated"
  | "not-staff"
  | "needs-mfa-setup"
  | "needs-mfa-verify"
  | "authorized";

// Check if MFA requirement is bypassed via env var
// Set VITE_ADMIN_REQUIRE_MFA=false to bypass MFA (for emergency access)
const isMfaBypassed = import.meta.env.VITE_ADMIN_REQUIRE_MFA === "false";

// Emergency URL query param bypass: ?mfa=off
const isEmergencyBypass = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("mfa") === "off";

// Emergency bypass layout - renders admin immediately without any MFA checks
const EmergencyBypassLayout = ({ children }: { children?: React.ReactNode }) => {
  useEffect(() => {
    return loadAdminFonts();
  }, []);

  return (
    <div className={adminTheme.page} style={adminTheme.bodyStyle}>
      <SidebarProvider>
        <AdminDashboardSidebar />
        <main className="w-full flex flex-col min-h-screen">
          {/* Emergency bypass warning banner */}
          <div className="bg-red-600 text-white px-4 py-3 text-center font-bold">
            Emergency MFA bypass active (?mfa=off). Remove after reset.
          </div>
          {/* Friendly greeting - purely presentational */}
          <div className="px-6 sm:px-8 pt-4 pb-0">
            <p className={adminTheme.greeting}>Hi Fortuna! 💕✨🚗</p>
          </div>
          <div className={adminTheme.content + " flex-1 pt-2"}>{children || <Outlet />}</div>
          <Footer />
        </main>
      </SidebarProvider>
    </div>
  );
};

const AdminLayoutInner = ({ children }: { children?: React.ReactNode }) => {
  const [adminState, setAdminState] = useState<AdminState>("loading");
  const [authReady, setAuthReady] = useState(false);

  // Load fonts
  useEffect(() => {
    return loadAdminFonts();
  }, []);

  // Wait for auth to be ready via onAuthStateChange
  useEffect(() => {
    // onAuthStateChange fires immediately with current state when subscribed
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      setAuthReady(true);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Only check admin access after auth is ready
  useEffect(() => {
    if (!authReady) return;

    const checkAdminAccess = async () => {
      try {
        // Auth is ready, now safe to get session
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;
        
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

        // Staff user - check MFA status (unless bypassed)
        if (!isMfaBypassed) {
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
        }

        // All checks passed (or MFA bypassed)
        setAdminState("authorized");
      } catch (error) {
        console.error("Error checking admin access:", error);
        setAdminState("not-authenticated");
      }
    };

    checkAdminAccess();
  }, [authReady]);

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
          {/* MFA bypass warning banner */}
          {isMfaBypassed && (
            <div className="bg-amber-500 text-amber-950 px-4 py-2 text-center font-medium">
              MFA is temporarily disabled. Re-enable by setting VITE_ADMIN_REQUIRE_MFA=true.
            </div>
          )}
          {/* Friendly greeting - purely presentational */}
          <div className="px-6 sm:px-8 pt-4 pb-0">
            <p className={adminTheme.greeting}>Hi Fortuna! 💕✨🚗</p>
          </div>
          <div className={adminTheme.content + " flex-1 pt-2"}>{children || <Outlet />}</div>
          <Footer />
        </main>
      </SidebarProvider>
    </div>
  );
};

// Main export - checks for emergency bypass FIRST, before any MFA logic
const AdminLayout = ({ children }: { children?: React.ReactNode }) => {
  // EMERGENCY BYPASS: Skip ALL MFA logic if ?mfa=off is in URL
  if (isEmergencyBypass) {
    return <EmergencyBypassLayout>{children}</EmergencyBypassLayout>;
  }
  return <AdminLayoutInner>{children}</AdminLayoutInner>;
};

export default AdminLayout;
