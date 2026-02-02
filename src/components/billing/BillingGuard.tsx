import { ReactNode, useEffect, useState, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSubscriptionStatus } from "@/hooks/use-subscription";
import { useQueryClient } from "@tanstack/react-query";

const ACTIVE_STATUSES = ["active", "trialing", "past_due"];
const MAX_POLL_ATTEMPTS = 5; // 5 seconds grace period
const POLL_INTERVAL_MS = 1000;

interface BillingGuardProps {
  children: ReactNode;
}

/**
 * BillingGuard is the single source of truth for subscription gating.
 * It includes a grace period for Stripe webhook delays after checkout.
 */
const BillingGuard = ({ children }: BillingGuardProps) => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const { data, isLoading, isError, refetch } = useSubscriptionStatus();
  
  const [pollCount, setPollCount] = useState(0);
  const [isPolling, setIsPolling] = useState(false);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const status = data?.status?.toLowerCase();
  const hasActivePlan = data && status && ACTIVE_STATUSES.includes(status);

  // Start polling if subscription is not active and we haven't exhausted retries
  useEffect(() => {
    // Only start polling if:
    // 1. Not currently loading initial data
    // 2. No active plan detected
    // 3. Haven't exceeded max poll attempts
    // 4. Not already polling
    if (!isLoading && !hasActivePlan && pollCount < MAX_POLL_ATTEMPTS && !isPolling) {
      setIsPolling(true);
      
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
  }, [isLoading, hasActivePlan, pollCount, isPolling, queryClient, refetch]);

  // Stop polling immediately if we detect an active plan
  useEffect(() => {
    if (hasActivePlan && pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
      setIsPolling(false);
    }
  }, [hasActivePlan]);

  // Show loading during initial load or while polling for subscription
  if (isLoading || (isPolling && pollCount < MAX_POLL_ATTEMPTS)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground text-sm">
            {isPolling ? "Verifying subscription..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    console.error("Failed to load billing account");
  }

  // After loading and polling complete, check subscription status
  if (!hasActivePlan) {
    const redirectPath = encodeURIComponent(location.pathname);
    return (
      <Navigate
        to={`/pricing?reason=subscribe&next=${redirectPath}`}
        replace
      />
    );
  }

  return <>{children}</>;
};

export default BillingGuard;
