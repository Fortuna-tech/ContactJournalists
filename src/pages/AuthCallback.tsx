import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase, SITE_URL } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import AuthDebugPanel from "@/components/ui/AuthDebugPanel";

type AuthState = "processing" | "error" | "success";
type RedirectReason = "none" | "onboarding" | "journalist" | "feed" | "next_param" | "auth_failed" | "no_session" | "exchange_failed" | "timeout";

// Hard timeout to prevent infinite loading
const AUTH_TIMEOUT_MS = 8000;

// Gate debug logs: only in dev or with ?debug param
const DEBUG_AUTH = import.meta.env.DEV || new URLSearchParams(window.location.search).has("debug");

// Log SITE_URL on mount for debugging
if (DEBUG_AUTH) {
  console.log("[CALLBACK] SITE_URL:", SITE_URL);
}

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

    // Helper to handle redirect after confirmed session
    const handleRedirectWithSession = async (userId: string) => {
      if (!mounted || hasCompleted.current) return;
      
      hasCompleted.current = true;
      setAuthReady(true);
      setSessionUserId(userId);

      console.log("[CALLBACK] exchangeCodeForSession succeeded, userId:", userId);

      // Check for `next` query param for custom redirect
      const nextParam = searchParams.get("next");
      if (nextParam && nextParam.startsWith("/")) {
        setLastRedirectReason("next_param");
        setAuthState("success");
        console.log("[CALLBACK] redirecting to next param:", nextParam);
        window.location.href = nextParam;
        return;
      }

      // Check if user has completed onboarding
      let profile = null;
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("onboarding_complete, role")
          .eq("id", userId)
          .maybeSingle();
        
        if (error) {
          console.error("[CALLBACK] Profile fetch error:", error.message);
        }
        profile = data;
        console.log("[CALLBACK] profile:", profile);
      } catch (err) {
        console.error("[CALLBACK] Profile fetch exception:", err);
      }

      if (!mounted) return;

      // No profile or onboarding not complete -> go to onboarding
      if (!profile?.onboarding_complete) {
        setLastRedirectReason("onboarding");
        setAuthState("success");
        console.log("[CALLBACK] redirecting to /onboarding");
        window.location.href = "/onboarding";
        return;
      }

      // Journalists go directly to their dashboard (no subscription required)
      if (profile.role === "journalist") {
        setLastRedirectReason("journalist");
        setAuthState("success");
        console.log("[CALLBACK] redirecting to /journalist/dashboard");
        window.location.href = "/journalist/dashboard";
        return;
      }

      // All other roles (founder, agency, admin) go to /feed
      setLastRedirectReason("feed");
      setAuthState("success");
      console.log("[CALLBACK] redirecting to /feed");
      window.location.href = "/feed";
    };

    const handleAuthCallback = async () => {
      try {
        // Log incoming URL always for production debugging
        console.log("[CALLBACK] url", window.location.href);
        console.log("[CALLBACK] search params", window.location.search);
        
        // First check if we already have a session (handles page refresh case)
        const { data: existingSessionData } = await supabase.auth.getSession();
        console.log("[CALLBACK] existing session check", { hasSession: !!existingSessionData?.session });
        
        if (existingSessionData?.session && !hasCompleted.current) {
          console.log("[CALLBACK] Already have session, redirecting...");
          await handleRedirectWithSession(existingSessionData.session.user.id);
          return;
        }

        // Check if we have a code to exchange
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        
        if (!code) {
          console.error("[CALLBACK] No code in URL and no existing session");
          if (mounted && !hasCompleted.current) {
            hasCompleted.current = true;
            setAuthReady(true);
            setLastRedirectReason("exchange_failed");
            setErrorMessage("No authentication code found. Please request a new magic link.");
            setAuthState("error");
          }
          return;
        }

        console.log("[CALLBACK] Found code, exchanging...");

        // Exchange the code for a session
        const { data: exchangeData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        
        console.log("[CALLBACK] exchange result", { 
          hasSession: !!exchangeData?.session, 
          error: exchangeError?.message 
        });
        
        if (exchangeError) {
          console.error("[CALLBACK] Exchange failed:", exchangeError.message);
          
          // Check if we already have a session (code might have been used already)
          const { data: retrySession } = await supabase.auth.getSession();
          console.log("[CALLBACK] retry session check", { hasSession: !!retrySession?.session });
          
          if (retrySession?.session) {
            // Session exists, proceed with redirect
            await handleRedirectWithSession(retrySession.session.user.id);
          } else {
            // No session and exchange failed - real error
            if (mounted && !hasCompleted.current) {
              hasCompleted.current = true;
              setAuthReady(true);
              setLastRedirectReason("exchange_failed");
              setErrorMessage(`Login link expired or already used: ${exchangeError.message}`);
              setAuthState("error");
            }
          }
          return;
        }

        // Exchange succeeded - get session and redirect
        if (exchangeData?.session && !hasCompleted.current) {
          console.log("[CALLBACK] Exchange succeeded, session userId:", exchangeData.session.user.id);
          await handleRedirectWithSession(exchangeData.session.user.id);
        } else {
          // Fallback: try getSession
          const { data: fallbackSession } = await supabase.auth.getSession();
          console.log("[CALLBACK] fallback session", { hasSession: !!fallbackSession?.session });
          
          if (fallbackSession?.session && !hasCompleted.current) {
            await handleRedirectWithSession(fallbackSession.session.user.id);
          } else if (!hasCompleted.current) {
            hasCompleted.current = true;
            setAuthReady(true);
            setLastRedirectReason("no_session");
            setErrorMessage("Session could not be established. Please try again.");
            setAuthState("error");
          }
        }

      } catch (error) {
        console.error("[CALLBACK] Auth callback error:", error);
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
  }, [navigate, toast, searchParams]);

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
