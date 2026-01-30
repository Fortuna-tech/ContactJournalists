import { useSearchParams } from "react-router-dom";
import PricingSelection from "@/components/onboarding/PricingSelection";

/**
 * Dedicated pricing page for subscription gating.
 * Founders without active Stripe subscription are redirected here.
 *
 * Query params:
 *   - reason: why user was redirected (e.g., "subscribe")
 *   - next: path to redirect to after successful checkout
 */
const Pricing = () => {
  const [searchParams] = useSearchParams();
  const reason = searchParams.get("reason");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background">
      {reason === "subscribe" && (
        <div className="mb-8 text-center max-w-md">
          <p className="text-muted-foreground">
            Please select a plan to continue using ContactJournalists.
          </p>
        </div>
      )}
      <PricingSelection />
    </div>
  );
};

export default Pricing;
