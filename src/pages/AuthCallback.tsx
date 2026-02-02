import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

/**
 * AuthCallback handles magic link / OAuth code exchange only.
 * After successful auth, redirects to /feed and lets BillingGuard handle subscription checks.
 * This avoids duplicate subscription checks and race conditions.
 */
const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    let mounted = true;

    const handleAuthCallback = async () => {
      try {
        // Exchange code for session (handles magic link and OAuth)
        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (!mounted) return;

        if (data.session) {
          // Check if user has completed onboarding
          const { data: profile } = await supabase
            .from("profiles")
            .select("onboarding_complete, role")
            .eq("id", data.session.user.id)
            .maybeSingle();

          if (!mounted) return;

          if (!profile?.onboarding_complete) {
            navigate("/onboarding", { replace: true });
            return;
          }

          // Journalists go directly to their dashboard (no subscription required)
          if (profile.role === "journalist") {
            navigate("/journalist/dashboard", { replace: true });
            return;
          }

          // All other roles (founder, agency, admin) go to /feed
          // BillingGuard will handle subscription check with grace period
          navigate("/feed", { replace: true });
        } else {
          // No session - redirect to auth
          navigate("/auth", { replace: true });
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        if (mounted) {
          toast({
            title: "Authentication error",
            description: "Failed to sign in. Please try again.",
            variant: "destructive",
          });
          navigate("/auth", { replace: true });
        }
      } finally {
        if (mounted) {
          setIsProcessing(false);
        }
      }
    };

    handleAuthCallback();

    return () => {
      mounted = false;
    };
  }, [navigate, toast]);

  // Always show loading while processing - no redirects until complete
  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Completing sign in...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallback;
