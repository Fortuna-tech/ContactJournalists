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

// Gate debug logs: only in dev or with ?debug param
const DEBUG_AUTH = import.meta.env.DEV || new URLSearchParams(window.location.search).has("debug");

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

      // Check if user has completed onboarding
      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_complete, role")
        .eq("id", userId)
        .maybeSingle();

      if (!mounted) return;

      if (!profile?.onboarding_complete) {
        setLastRedirectReason("onboarding");
        setAuthState("success");
        if (DEBUG_AUTH) console.log("[CALLBACK] redirecting to /onboarding");
        navigate("/onboarding", { replace: true });
        return;
      }

      // Journalists go directly to their dashboard (no subscription required)
      if (profile.role === "journalist") {
        setLastRedirectReason("journalist");
        setAuthState("success");
        if (DEBUG_AUTH) console.log("[CALLBACK] redirecting to /journalist/dashboard");
        navigate("/journalist/dashboard", { replace: true });
        return;
      }

      // All other roles (founder, agency, admin) go to /feed
      setLastRedirectReason("feed");
      setAuthState("success");
      if (DEBUG_AUTH) console.log("[CALLBACK] redirecting to /feed");
      navigate("/feed", { replace: true });
    };

    const handleAuthCallback = async () => {
      try {
        // TEMP DEBUG: Log incoming URL
        if (DEBUG_AUTH) console.log("[CALLBACK] url", window.location.href);
        
        // Set up auth state listener BEFORE exchanging code
        // This ensures we catch the SIGNED_IN event
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (DEBUG_AUTH) console.log("[CALLBACK] auth state change", { event, hasSession: !!session });
            
            if (event === "SIGNED_IN" && session) {
              if (DEBUG_AUTH) console.log("[CALLBACK] SIGNED_IN event received, session confirmed");
              await handleRedirectWithSession(session.user.id);
            }
          }
        );

        // Step 1: Explicitly exchange the code/token from URL
        const { data: exchangeData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(window.location.href);
        
        // TEMP DEBUG: Log exchange result
        if (DEBUG_AUTH) console.log("[CALLBACK] exchange result", { data: exchangeData, error: exchangeError });
        
        if (exchangeError) {
          console.error("[CALLBACK] Exchange failed:", exchangeError.message);
          
          // Check if we already have a session (code might have been used already)
          const { data: existingSession } = await supabase.auth.getSession();
          if (DEBUG_AUTH) console.log("[CALLBACK] existing session check", { hasSession: !!existingSession?.session });
          
          if (existingSession?.session) {
            // Session exists, proceed with redirect
            await handleRedirectWithSession(existingSession.session.user.id);
          } else {
            // No session and exchange failed - real error
            if (mounted && !hasCompleted.current) {
              hasCompleted.current = true;
              setAuthReady(true);
              setLastRedirectReason("exchange_failed");
              setErrorMessage("Login link expired or already used. Please request a new magic link.");
              setAuthState("error");
            }
          }
          subscription.unsubscribe();
          return;
        }

        // Exchange succeeded - the onAuthStateChange listener will handle redirect
        // But also verify session directly as a fallback
        const { data } = await supabase.auth.getSession();
        if (DEBUG_AUTH) console.log("[SESSION] after exchange", { session: data?.session ? "exists" : "null", userId: data?.session?.user?.id });

        if (data?.session && !hasCompleted.current) {
          // Session confirmed, proceed with redirect
          await handleRedirectWithSession(data.session.user.id);
        }

        // Cleanup subscription after handling
        setTimeout(() => subscription.unsubscribe(), 1000);

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
