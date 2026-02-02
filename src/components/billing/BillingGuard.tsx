import { ReactNode, useEffect, useState, useRef } from "react";
import { Navigate, useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { useSubscriptionStatus } from "@/hooks/use-subscription";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import AuthDebugPanel from "@/components/ui/AuthDebugPanel";

const ACTIVE_STATUSES = ["active", "trialing", "past_due"];
const MAX_POLL_ATTEMPTS = 5; // 5 seconds grace period
const POLL_INTERVAL_MS = 1000;
const AUTH_CHECK_TIMEOUT_MS = 8000; // Hard timeout to prevent infinite loading

type SubscriptionDisplayStatus = "active" | "inactive" | "unknown" | "error";
type RedirectReason = "none" | "no_subscription" | "waiting" | "error_retry" | "no_session" | "timeout";

interface BillingGuardProps {
  children: ReactNode;
}

/**
 * BillingGuard is the single source of truth for subscription gating.
 * It includes a grace period for Stripe webhook delays after checkout.
 * 
 * Key behavior:
 * - NEVER redirects to /pricing on error or unknown state
 * - Shows retry UI on error instead of bouncing user
 * - Only redirects when subscription is definitively inactive
 * - Has hard timeout to prevent infinite loading
 */
const BillingGuard = ({ children }: BillingGuardProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { data, isLoading, isError, refetch } = useSubscriptionStatus();
  
  const [pollCount, setPollCount] = useState(0);
  const [isPolling, setIsPolling] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [lastRedirectReason, setLastRedirectReason] = useState<RedirectReason>("none");
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const authCheckComplete = useRef(false);

  const showDebug = searchParams.get("debug") === "1";

  const status = data?.status?.toLowerCase();
  const hasActivePlan = data && status && ACTIVE_STATUSES.includes(status);

  // Determine subscription display status for debug panel
  const getSubscriptionDisplayStatus = (): SubscriptionDisplayStatus => {
    if (isError) return "error";
    if (isLoading || isPolling) return "unknown";
    if (data === undefined) return "unknown";
    if (hasActivePlan) return "active";
    return "inactive";
  };

  // Check auth state on mount with hard timeout
  useEffect(() => {
    let mounted = true;

    // Hard timeout failsafe
    const timeoutId = setTimeout(() => {
      if (mounted && !authCheckComplete.current) {
        console.error("[BillingGuard] Auth check timeout after 8 seconds");
        authCheckComplete.current = true;
        setHasTimedOut(true);
        setAuthReady(true);
        setLastRedirectReason("timeout");
      }
    }, AUTH_CHECK_TIMEOUT_MS);

    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;

        // If no session, redirect to auth immediately
        if (!session) {
          authCheckComplete.current = true;
          setLastRedirectReason("no_session");
          navigate("/auth", { replace: true });
          return;
        }

        authCheckComplete.current = true;
        setSessionUserId(session.user.id);
        setAuthReady(true);
      } catch (error) {
        console.error("[BillingGuard] Auth check error:", error);
        if (mounted && !authCheckComplete.current) {
          authCheckComplete.current = true;
          setHasTimedOut(true);
          setAuthReady(true);
        }
      }
    };

    checkAuth();

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, [navigate]);

  // Start polling if subscription is not active and we haven't exhausted retries
  useEffect(() => {
    // Only start polling if:
    // 1. Not currently loading initial data
    // 2. No active plan detected
    // 3. Haven't exceeded max poll attempts
    // 4. Not already polling
    // 5. NOT in error state (don't poll on errors)
    // 6. Auth is ready
    if (authReady && !isLoading && !hasActivePlan && !isError && pollCount < MAX_POLL_ATTEMPTS && !isPolling && !hasTimedOut) {
      setIsPolling(true);
      setLastRedirectReason("waiting");
      
      pollIntervalRef.current = setInterval(async () => {
        setPollCount((prev) => {
          const newCount = prev + 1;
          
          if (newCount >= MAX_POLL_ATTEMPTS) {
            // Stop polling after max attempts
            if (pollIntervalRef.current) {
              clearInterval(pollIntervalRef.current);
              pollIntervalRef.current = null;
            }
            setIsPolling(false);
          }
          
          return newCount;
        });
        
        // Invalidate and refetch subscription status
        await queryClient.invalidateQueries({ queryKey: ["billingAccount"] });
        refetch();
      }, POLL_INTERVAL_MS);
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [authReady, isLoading, hasActivePlan, isError, pollCount, isPolling, hasTimedOut, queryClient, refetch]);

  // Stop polling immediately if we detect an active plan
  useEffect(() => {
    if (hasActivePlan && pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
      setIsPolling(false);
      setLastRedirectReason("none");
    }
  }, [hasActivePlan]);

  const handleRetry = async () => {
    setPollCount(0);
    setIsPolling(false);
    setHasTimedOut(false);
    await queryClient.invalidateQueries({ queryKey: ["billingAccount"] });
    refetch();
  };

  const handleBackToAuth = () => {
    navigate("/auth", { replace: true });
  };

  const debugPanel = showDebug && (
    <AuthDebugPanel
      route={location.pathname}
      authReady={authReady}
      sessionUserId={sessionUserId}
      subscriptionStatus={getSubscriptionDisplayStatus()}
      lastRedirectReason={lastRedirectReason}
    />
  );

  // Timeout state - show error with back to auth option
  if (hasTimedOut) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md px-4">
          <div className="text-yellow-500 text-5xl mb-4">⏳</div>
          <h2 className="text-xl font-semibold text-foreground">Taking too long...</h2>
          <p className="text-muted-foreground">
            We couldn't verify your access. Please try signing in again.
          </p>
          <div className="flex flex-col gap-2">
            <Button onClick={handleRetry}>
              Retry
            </Button>
            <Button variant="outline" onClick={handleBackToAuth}>
              Back to Sign In
            </Button>
          </div>
          {debugPanel}
        </div>
      </div>
    );
  }

  // Show loading during initial auth check
  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground text-sm">Checking session...</p>
          {debugPanel}
        </div>
      </div>
    );
  }

  // Show loading during initial subscription load or while polling
  if (isLoading || (isPolling && pollCount < MAX_POLL_ATTEMPTS)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground text-sm">
            {isPolling ? "Verifying subscription..." : "Loading..."}
          </p>
          {debugPanel}
        </div>
      </div>
    );
  }

  // ERROR STATE: Show retry UI instead of redirecting to pricing
  // This prevents paid users from being bounced due to API errors
  if (isError || data === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md px-4">
          <div className="text-yellow-500 text-5xl mb-4">⏳</div>
          <h2 className="text-xl font-semibold text-foreground">We're verifying your access...</h2>
          <p className="text-muted-foreground">
            There was an issue checking your subscription status. This doesn't affect your account.
          </p>
          <Button onClick={handleRetry} className="mt-4">
            Retry
          </Button>
          {debugPanel}
        </div>
      </div>
    );
  }

  // Only redirect to pricing when ALL conditions are met:
  // 1. authReady is true (we've checked session)
  // 2. sessionUserId exists (user is logged in)
  // 3. subscription check completed successfully (not error)
  // 4. subscription is definitively inactive
  if (!hasActivePlan) {
    // Final check: only redirect if we're sure about the state
    if (authReady && sessionUserId && !isError && data !== undefined) {
      const redirectPath = encodeURIComponent(location.pathname);
      return (
        <>
          {debugPanel}
          <Navigate
            to={`/pricing?reason=subscribe&next=${redirectPath}`}
            replace
          />
        </>
      );
    }
    
    // If conditions aren't met, show loading while we wait
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground text-sm">Checking access...</p>
          {debugPanel}
        </div>
      </div>
    );
  }

  return (
    <>
      {debugPanel}
      {children}
    </>
  );
};

export default BillingGuard;
