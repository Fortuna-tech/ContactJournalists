import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import PricingSelection from "@/components/onboarding/PricingSelection";

/**
 * Dedicated pricing page for subscription gating.
 * PR/Founders without active Stripe subscription are redirected here.
 *
 * Route protection:
 * - Not logged in → redirect to /auth
 * - Logged in but no role → redirect to /onboarding
 * - Journalist role → redirect to /journalist/dashboard (no subscription needed)
 * - PR/Founder role → show pricing page
 *
 * Query params:
 *   - reason: why user was redirected (e.g., "subscribe")
 *   - next: path to redirect to after successful checkout
 */
const Pricing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  const reason = searchParams.get("reason");

  // Auth and role protection
  useEffect(() => {
    let mounted = true;

    const checkAuthAndRole = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (!session) {
          // Not logged in - redirect to auth with current path preserved
          const currentUrl = location.pathname + location.search;
          navigate(`/auth?next=${encodeURIComponent(currentUrl)}`, { replace: true });
          return;
        }

        // Check user's profile for role
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, onboarding_complete")
          .eq("id", session.user.id)
          .maybeSingle();

        if (!mounted) return;

        // If no profile or no role set, redirect to onboarding
        if (!profile || !profile.role) {
          navigate("/onboarding", { replace: true });
          return;
        }

        // If onboarding not complete, redirect to onboarding
        if (!profile.onboarding_complete) {
          navigate("/onboarding", { replace: true });
          return;
        }

        // Journalists don't need subscriptions - redirect to their dashboard
        if (profile.role === "journalist") {
          navigate("/journalist/dashboard", { replace: true });
          return;
        }

        // PR/Founder/Agency - allow access to pricing
        setIsAuthorized(true);
      } catch (error) {
        console.error("Pricing auth check error:", error);
        if (mounted) {
          navigate("/auth", { replace: true });
        }
      } finally {
        if (mounted) {
          setIsAuthChecking(false);
        }
      }
    };

    checkAuthAndRole();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  // Show loading while checking auth/role
  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authorized (will redirect)
  if (!isAuthorized) {
    return null;
  }

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
