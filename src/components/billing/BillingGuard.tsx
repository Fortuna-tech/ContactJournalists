import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSubscriptionStatus } from "@/hooks/use-subscription";

const ACTIVE_STATUSES = ["active", "trialing", "past_due"];

interface BillingGuardProps {
  children: ReactNode;
}

const BillingGuard = ({ children }: BillingGuardProps) => {
  const location = useLocation();
  const { data, isLoading, isError } = useSubscriptionStatus();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    console.error("Failed to load billing account");
  }

  const status = data?.status?.toLowerCase();
  const hasActivePlan = data && status && ACTIVE_STATUSES.includes(status);

  if (!hasActivePlan) {
    return (
      <Navigate
        to="/onboarding?step=plan"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <>{children}</>;
};

export default BillingGuard;
