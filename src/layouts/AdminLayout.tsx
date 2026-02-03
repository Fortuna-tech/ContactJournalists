import { Outlet, Navigate, Link } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminDashboardSidebar } from "@/components/sidebars/AdminDashboardSidebar";
import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  hasTOTPFactor,
  getAAL,
  getVerifiedTOTPFactor,
  createChallenge,
  verifyTOTP,
} from "@/lib/mfa";
import { adminTheme, loadAdminFonts } from "@/styles/adminTheme";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ShieldCheck, Loader2, LogOut, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
const isEmergencyBypass =
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).get("mfa") === "off";

// ============================================================================
// Signed Out Message (inline on /admin, no redirect)
// ============================================================================
const SignedOutMessage = () => {
  return (
    <div
      className={adminTheme.page + " flex items-center justify-center p-4"}
      style={adminTheme.bodyStyle}
    >
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 w-full max-w-md p-8 text-center space-y-6">
        <div className="mx-auto h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center">
          <LogIn className="h-7 w-7 text-slate-600" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-slate-900">
            You're signed out
          </h1>
          <p className="text-slate-600">Please sign in to continue to admin.</p>
        </div>
        <Button asChild className="w-full">
          <Link to="/auth?next=/admin">Sign in</Link>
        </Button>
      </div>
    </div>
  );
};

// ============================================================================
// Not Authorised Message (inline on /admin, no redirect)
// ============================================================================
const NotAuthorisedMessage = () => {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div
      className={adminTheme.page + " flex items-center justify-center p-4"}
      style={adminTheme.bodyStyle}
    >
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 w-full max-w-md p-8 text-center space-y-6">
        <div className="mx-auto h-14 w-14 rounded-full bg-red-100 flex items-center justify-center">
          <ShieldCheck className="h-7 w-7 text-red-600" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-slate-900">
            Not authorised
          </h1>
          <p className="text-slate-600">
            You don't have admin privileges. Contact support if you believe this
            is an error.
          </p>
        </div>
        <Button variant="outline" className="w-full" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  );
};

// ============================================================================
// Inline MFA Verification (shown on /admin, no redirect)
// ============================================================================
const InlineMfaVerify = ({ onSuccess }: { onSuccess: () => void }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const initVerification = async () => {
      try {
        // Get the verified TOTP factor
        const factor = await getVerifiedTOTPFactor();
        if (!factor) {
          // This shouldn't happen since we checked hasTOTPFactor before
          toast({
            title: "Error",
            description: "No TOTP factor found. Please set up MFA first.",
            variant: "destructive",
          });
          return;
        }

        setFactorId(factor.id);

        // Create a challenge
        const challenge = await createChallenge(factor.id);
        setChallengeId(challenge.id);
      } catch (error) {
        console.error("Failed to initialize MFA verification:", error);
        toast({
          title: "Error",
          description: "Failed to start verification. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    initVerification();
  }, [toast]);

  const handleVerify = async () => {
    if (!factorId || !challengeId || code.length !== 6) return;

    setVerifying(true);
    try {
      await verifyTOTP(factorId, challengeId, code);
      toast({
        title: "Verified",
        description: "Two-factor authentication successful.",
      });
      onSuccess();
    } catch (error) {
      console.error("Verification failed:", error);
      toast({
        title: "Invalid Code",
        description: "The code you entered is incorrect. Please try again.",
        variant: "destructive",
      });
      setCode("");

      // Create a new challenge for retry
      try {
        const challenge = await createChallenge(factorId);
        setChallengeId(challenge.id);
      } catch (e) {
        console.error("Failed to create new challenge:", e);
      }
    } finally {
      setVerifying(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  if (loading) {
    return (
      <div
        className={adminTheme.page + " flex items-center justify-center"}
        style={adminTheme.bodyStyle}
      >
        <div className="text-center space-y-4">
          <div className={adminTheme.loadingSpinner + " mx-auto"}></div>
          <p className="text-slate-500">Preparing verification...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={adminTheme.page + " flex items-center justify-center p-4"}
      style={adminTheme.bodyStyle}
    >
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 w-full max-w-md">
        <div className="p-6 text-center border-b border-slate-100">
          <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Two-Factor Authentication
          </h1>
          <p className="text-slate-600 mt-2">
            Enter the 6-digit code from your authenticator app to continue.
          </p>
        </div>
        <div className="p-6 space-y-6">
          {/* OTP Input */}
          <div className="space-y-4">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={code}
                onChange={setCode}
                onComplete={handleVerify}
                autoFocus
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <Button
              className="w-full"
              onClick={handleVerify}
              disabled={code.length !== 6 || verifying}
            >
              {verifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify"
              )}
            </Button>
          </div>

          {/* Sign out option */}
          <div className="pt-4 border-t border-slate-100">
            <Button
              variant="ghost"
              className="w-full text-muted-foreground"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign in with a different account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Emergency bypass layout
// ============================================================================
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
          <div className={adminTheme.content + " flex-1 pt-2"}>
            {children || <Outlet />}
          </div>
          <Footer />
        </main>
      </SidebarProvider>
    </div>
  );
};

// ============================================================================
// Main Admin Layout Inner
// ============================================================================
const AdminLayoutInner = ({ children }: { children?: React.ReactNode }) => {
  const [adminState, setAdminState] = useState<AdminState>("loading");
  const [checkTrigger, setCheckTrigger] = useState(0);

  // Ref to track the current run ID - prevents stale async runs from updating state
  const runIdRef = useRef(0);

  // Load fonts
  useEffect(() => {
    return loadAdminFonts();
  }, []);

  // Subscribe to auth state changes - triggers re-check on relevant events
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      // Re-check admin access on these events
      if (
        event === "SIGNED_IN" ||
        event === "TOKEN_REFRESHED" ||
        event === "USER_UPDATED" ||
        event === "MFA_CHALLENGE_VERIFIED" ||
        event === "SIGNED_OUT"
      ) {
        setCheckTrigger((prev) => prev + 1);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Check admin access - runs on mount and when checkTrigger changes
  useEffect(() => {
    // Increment runId for this run - any previous runs become stale
    const thisRunId = ++runIdRef.current;

    // Helper to check if this run is still current
    const isCurrentRun = () => runIdRef.current === thisRunId;

    // Helper to safely set state only if this run is still current
    const safeSetState = (state: AdminState) => {
      if (isCurrentRun()) {
        setAdminState(state);
      }
    };

    const checkAdminAccess = async () => {
      try {
        // Step 1: Try getSession() first (reads from memory/storage)
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!isCurrentRun()) return;

        let user = session?.user ?? null;

        // Step 2: Belt + braces - if session is null, call getUser() (network call)
        // This catches the case where user is signed in but session isn't hydrated yet
        if (!user) {
          const {
            data: { user: networkUser },
          } = await supabase.auth.getUser();

          if (!isCurrentRun()) return;

          user = networkUser;

          // If getUser() returns a user but session was null, we have auth but
          // session may not be fully hydrated. Run the full check sequence.
          // Do NOT show "signed out" - the user IS authenticated.
        }

        // Truly not authenticated - both session and getUser() returned null
        if (!user) {
          safeSetState("not-authenticated");
          return;
        }

        // User exists - check if staff
        const { data: staffRecord } = await supabase
          .from("staff_privileges")
          .select("user_id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!isCurrentRun()) return;

        if (!staffRecord) {
          safeSetState("not-staff");
          return;
        }

        // Staff user - check MFA status (unless bypassed)
        if (!isMfaBypassed) {
          const hasTotp = await hasTOTPFactor();
          if (!isCurrentRun()) return;

          if (!hasTotp) {
            safeSetState("needs-mfa-setup");
            return;
          }

          // Check AAL level using getAuthenticatorAssuranceLevel
          const { currentLevel } = await getAAL();
          if (!isCurrentRun()) return;

          if (currentLevel !== "aal2") {
            safeSetState("needs-mfa-verify");
            return;
          }
        }

        // All checks passed (or MFA bypassed)
        safeSetState("authorized");
      } catch (error) {
        console.error("Error checking admin access:", error);
        if (!isCurrentRun()) return;

        // On error, fallback to not-authenticated only if we truly have no user
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!isCurrentRun()) return;

          if (user) {
            // User exists but something else failed - show MFA verify as safe default
            // (safer than showing "signed out" when user IS signed in)
            safeSetState("needs-mfa-verify");
          } else {
            safeSetState("not-authenticated");
          }
        } catch {
          if (isCurrentRun()) {
            safeSetState("not-authenticated");
          }
        }
      }
    };

    checkAdminAccess();

    // Cleanup: mark this run as stale (runIdRef will have been incremented by next run)
    // No explicit cleanup needed since we use runIdRef comparison
  }, [checkTrigger]);

  // Callback for when MFA verification succeeds - triggers re-check
  // Uses belt + braces: immediate check + fallback timeout
  const handleMfaSuccess = useCallback(async () => {
    // First, wait a tick for Supabase to update session/AAL internally
    await supabase.auth.getSession();

    // Trigger immediate re-check
    setCheckTrigger((prev) => prev + 1);

    // Fallback: trigger another re-check after 250ms in case the first was too early
    setTimeout(() => {
      setCheckTrigger((prev) => prev + 1);
    }, 250);
  }, []);

  // Loading state (while auth hydrates or checks run)
  if (adminState === "loading") {
    return (
      <div
        className={adminTheme.page + " flex items-center justify-center"}
        style={adminTheme.bodyStyle}
      >
        <div className={adminTheme.loadingSpinner}></div>
      </div>
    );
  }

  // Not authenticated - show message inline (NO redirect)
  if (adminState === "not-authenticated") {
    return <SignedOutMessage />;
  }

  // Not staff - show not authorised inline (NO redirect)
  if (adminState === "not-staff") {
    return <NotAuthorisedMessage />;
  }

  // Needs MFA setup - still redirect to setup page (user needs to scan QR)
  if (adminState === "needs-mfa-setup") {
    return <Navigate to="/admin/mfa-setup" replace />;
  }

  // Needs MFA verification - show TOTP input inline (NO redirect)
  if (adminState === "needs-mfa-verify") {
    return <InlineMfaVerify onSuccess={handleMfaSuccess} />;
  }

  // Authorized - render admin dashboard
  return (
    <div className={adminTheme.page} style={adminTheme.bodyStyle}>
      <SidebarProvider>
        <AdminDashboardSidebar />
        <main className="w-full flex flex-col min-h-screen">
          {/* MFA bypass warning banner */}
          {isMfaBypassed && (
            <div className="bg-amber-500 text-amber-950 px-4 py-2 text-center font-medium">
              MFA is temporarily disabled. Re-enable by setting
              VITE_ADMIN_REQUIRE_MFA=true.
            </div>
          )}
          {/* Friendly greeting - purely presentational */}
          <div className="px-6 sm:px-8 pt-4 pb-0">
            <p className={adminTheme.greeting}>Hi Fortuna! 💕✨🚗</p>
          </div>
          <div className={adminTheme.content + " flex-1 pt-2"}>
            {children || <Outlet />}
          </div>
          <Footer />
        </main>
      </SidebarProvider>
    </div>
  );
};

// ============================================================================
// Main export - checks for emergency bypass FIRST
// ============================================================================
const AdminLayout = ({ children }: { children?: React.ReactNode }) => {
  // EMERGENCY BYPASS: Skip ALL MFA logic if ?mfa=off is in URL
  if (isEmergencyBypass) {
    return <EmergencyBypassLayout>{children}</EmergencyBypassLayout>;
  }
  return <AdminLayoutInner>{children}</AdminLayoutInner>;
};

export default AdminLayout;
