import { ReactNode, useEffect, useState, useRef } from "react";
import { Navigate, useLocation, useSearchParams } from "react-router-dom";
import { useSubscriptionStatus } from "@/hooks/use-subscription";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import AuthDebugPanel from "@/components/ui/AuthDebugPanel";

const ACTIVE_STATUSES = ["active", "trialing", "past_due"];
const MAX_POLL_ATTEMPTS = 5; // 5 seconds grace period
const POLL_INTERVAL_MS = 1000;

type SubscriptionDisplayStatus = "active" | "inactive" | "unknown" | "error";
type RedirectReason = "none" | "no_subscription" | "waiting" | "error_retry";

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
 */
const BillingGuard = ({ children }: BillingGuardProps) => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { data, isLoading, isError, refetch } = useSubscriptionStatus();
  
  const [pollCount, setPollCount] = useState(0);
  const [isPolling, setIsPolling] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [lastRedirectReason, setLastRedirectReason] = useState<RedirectReason>("none");
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

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

  // Check auth state on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSessionUserId(session?.user?.id || null);
      setAuthReady(true);
    };
    checkAuth();
  }, []);

  // Start polling if subscription is not active and we haven't exhausted retries
  useEffect(() => {
    // Only start polling if:
    // 1. Not currently loading initial data
    // 2. No active plan detected
    // 3. Haven't exceeded max poll attempts
    // 4. Not already polling
    // 5. NOT in error state (don't poll on errors)
    if (!isLoading && !hasActivePlan && !isError && pollCount < MAX_POLL_ATTEMPTS && !isPolling) {
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
  }, [isLoading, hasActivePlan, isError, pollCount, isPolling, queryClient, refetch]);

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
    setLastRedirectReason("error_retry");
    await queryClient.invalidateQueries({ queryKey: ["billingAccount"] });
    refetch();
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

  // Show loading during initial load or while polling for subscription
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
    setLastRedirectReason("error_retry");
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
      setLastRedirectReason("no_subscription");
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
