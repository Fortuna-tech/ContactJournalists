import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { getBillingAccount } from "@/lib/api";

const ACTIVE_STATUSES = ["active", "trialing", "past_due"];

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (data.session) {
          // Check if user has completed onboarding and get their role
          const { data: profile } = await supabase
            .from("profiles")
            .select("onboarding_complete, role")
            .eq("id", data.session.user.id)
            .maybeSingle();

          if (!profile?.onboarding_complete) {
            navigate("/onboarding");
            return;
          }

          // Journalists go directly to their dashboard (unchanged behaviour)
          if (profile.role === "journalist") {
            navigate("/journalist/dashboard");
            return;
          }

          // For founders and agencies: check Stripe subscription status
          if (profile.role === "founder" || profile.role === "agency") {
            try {
              const billing = await getBillingAccount();
              const status = billing?.status?.toLowerCase();
              const hasActivePlan = billing && status && ACTIVE_STATUSES.includes(status);

              if (!hasActivePlan) {
                // Founder without active subscription -> pricing page
                const nextPath = searchParams.get("next") || "/feed";
                navigate(`/pricing?reason=subscribe&next=${encodeURIComponent(nextPath)}`);
                return;
              }
            } catch (billingError) {
              // If billing check fails, redirect to pricing to be safe
              console.error("Billing check failed:", billingError);
              navigate("/pricing?reason=subscribe&next=%2Ffeed");
              return;
            }
          }

          // User has active subscription or is admin -> go to feed (or next param)
          const nextPath = searchParams.get("next") || "/feed";
          navigate(nextPath);
        } else {
          navigate("/auth");
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        toast({
          title: "Authentication error",
          description: "Failed to sign in. Please try again.",
          variant: "destructive",
        });
        navigate("/auth");
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
