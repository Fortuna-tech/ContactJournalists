import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import AuthDebugPanel from "@/components/ui/AuthDebugPanel";

type AuthState = "processing" | "error" | "success";
type RedirectReason = "none" | "onboarding" | "journalist" | "feed" | "auth_failed" | "no_session" | "exchange_failed" | "timeout";

// Hard timeout to prevent infinite loading
const AUTH_TIMEOUT_MS = 8000;

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [authState, setAuthState] = useState<AuthState>("processing");
  const [authReady, setAuthReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [lastRedirectReason, setLastRedirectReason] = useState<RedirectReason>("none");
  const hasCompleted = useRef(false);

  const showDebug = searchParams.get("debug") === "1";

  useEffect(() => {
    let mounted = true;

    // Hard timeout failsafe - prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (mounted && !hasCompleted.current) {
        console.error("[AuthCallback] Timeout after 8 seconds");
        hasCompleted.current = true;
        setAuthReady(true);
        setLastRedirectReason("timeout");
        setErrorMessage("Sign in took too long. Please try again.");
        setAuthState("error");
      }
    }, AUTH_TIMEOUT_MS);

    const handleAuthCallback = async () => {
      try {
        // Step 1: Explicitly exchange the code/token from URL
        // This handles magic link tokens and OAuth codes
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(window.location.href);
        
        if (exchangeError) {
          // exchangeCodeForSession may fail if there's no code in URL (e.g., already exchanged)
          // In that case, we still try getSession below
          console.warn("Exchange code warning (may be expected):", exchangeError.message);
        }

        // Step 2: After exchange attempt, confirm session exists
        const { data, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (!mounted || hasCompleted.current) return;

        // Mark as completed to prevent timeout from firing
        hasCompleted.current = true;
        setAuthReady(true);

        if (data.session) {
          setSessionUserId(data.session.user.id);

          // Check if user has completed onboarding
          const { data: profile } = await supabase
            .from("profiles")
            .select("onboarding_complete, role")
            .eq("id", data.session.user.id)
            .maybeSingle();

          if (!mounted) return;

          if (!profile?.onboarding_complete) {
            setLastRedirectReason("onboarding");
            setAuthState("success");
            navigate("/onboarding", { replace: true });
            return;
          }

          // Journalists go directly to their dashboard (no subscription required)
          if (profile.role === "journalist") {
            setLastRedirectReason("journalist");
            setAuthState("success");
            navigate("/journalist/dashboard", { replace: true });
            return;
          }

          // All other roles (founder, agency, admin) go to /feed
          // BillingGuard will handle subscription check with grace period
          setLastRedirectReason("feed");
          setAuthState("success");
          navigate("/feed", { replace: true });
        } else {
          // No session after exchange - this is a real failure
          setLastRedirectReason("no_session");
          setErrorMessage("Login didn't complete. Please request a new magic link.");
          setAuthState("error");
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        if (mounted && !hasCompleted.current) {
          hasCompleted.current = true;
          setAuthReady(true);
          setLastRedirectReason("exchange_failed");
          setErrorMessage("Login didn't complete. Please request a new magic link.");
          setAuthState("error");
        }
      }
    };

    handleAuthCallback();

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, [navigate, toast]);

  const handleRequestNewLink = () => {
    navigate("/auth", { replace: true });
  };

  // Error state - show error UI, don't silently redirect
  if (authState === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md px-4">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-foreground">Sign In Issue</h2>
          <p className="text-muted-foreground">
            {errorMessage || "Login didn't complete. Please request a new magic link."}
          </p>
          <Button onClick={handleRequestNewLink} className="mt-4">
            Request New Magic Link
          </Button>
          
          {showDebug && (
            <AuthDebugPanel
              route="/auth/callback"
              authReady={authReady}
              sessionUserId={sessionUserId}
              subscriptionStatus="unknown"
              lastRedirectReason={lastRedirectReason}
            />
          )}
        </div>
      </div>
    );
  }

  // Processing state - show loading
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground">Completing sign in...</p>
        
        {showDebug && (
          <AuthDebugPanel
            route="/auth/callback"
            authReady={authReady}
            sessionUserId={sessionUserId}
            subscriptionStatus="unknown"
            lastRedirectReason={lastRedirectReason}
          />
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
