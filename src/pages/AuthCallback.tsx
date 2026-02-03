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

      if (DEBUG_AUTH) console.log("[CALLBACK] handleRedirectWithSession, userId:", userId);

      // Check for `next` query param for custom redirect
      const nextParam = searchParams.get("next");
      if (nextParam && nextParam.startsWith("/")) {
        setLastRedirectReason("next_param");
        setAuthState("success");
        if (DEBUG_AUTH) console.log("[CALLBACK] redirecting to next param:", nextParam);
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
        
        if (error && DEBUG_AUTH) {
          console.error("[CALLBACK] Profile fetch error:", error.message);
        }
        profile = data;
        if (DEBUG_AUTH) console.log("[CALLBACK] profile:", profile);
      } catch (err) {
        if (DEBUG_AUTH) console.error("[CALLBACK] Profile fetch exception:", err);
      }

      if (!mounted) return;

      // No profile or onboarding not complete -> go to onboarding
      if (!profile?.onboarding_complete) {
        setLastRedirectReason("onboarding");
        setAuthState("success");
        if (DEBUG_AUTH) console.log("[CALLBACK] redirecting to /onboarding");
        window.location.href = "/onboarding";
        return;
      }

      // Journalists go directly to their dashboard (no subscription required)
      if (profile.role === "journalist") {
        setLastRedirectReason("journalist");
        setAuthState("success");
        if (DEBUG_AUTH) console.log("[CALLBACK] redirecting to /journalist/dashboard");
        window.location.href = "/journalist/dashboard";
        return;
      }

      // All other roles (founder, agency, admin) go to /feed
      setLastRedirectReason("feed");
      setAuthState("success");
      if (DEBUG_AUTH) console.log("[CALLBACK] redirecting to /feed");
      window.location.href = "/feed";
    };

    const handleAuthCallback = async () => {
      try {
        // Log incoming URL for debugging
        if (DEBUG_AUTH) {
          console.log("[CALLBACK] url", window.location.href);
          console.log("[CALLBACK] search params", window.location.search);
          console.log("[CALLBACK] hash", window.location.hash ? "present" : "none");
        }

        // Set up auth state listener to catch session from any flow
        // (PKCE code exchange OR hash-based token detection)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (DEBUG_AUTH) console.log("[CALLBACK] auth state change", { event, hasSession: !!session });
            
            if ((event === "SIGNED_IN" || event === "TOKEN_REFRESHED") && session && !hasCompleted.current) {
              if (DEBUG_AUTH) console.log("[CALLBACK] Session confirmed via auth state change");
              await handleRedirectWithSession(session.user.id);
              subscription.unsubscribe();
            }
          }
        );

        // Check if we already have a session (handles page refresh or detectSessionInUrl already processed)
        const { data: existingSessionData } = await supabase.auth.getSession();
        if (DEBUG_AUTH) console.log("[CALLBACK] existing session check", { hasSession: !!existingSessionData?.session });
        
        if (existingSessionData?.session && !hasCompleted.current) {
          if (DEBUG_AUTH) console.log("[CALLBACK] Already have session, redirecting...");
          await handleRedirectWithSession(existingSessionData.session.user.id);
          subscription.unsubscribe();
          return;
        }

        // Check for PKCE code in URL
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        
        // Check for hash-based tokens (older magic link flow)
        const hasHashTokens = window.location.hash.includes("access_token");
        
        if (code) {
          // PKCE flow - exchange code for session
          if (DEBUG_AUTH) console.log("[CALLBACK] Found code, exchanging...");
          
          const { data: exchangeData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          
          if (DEBUG_AUTH) console.log("[CALLBACK] exchange result", { 
            hasSession: !!exchangeData?.session, 
            error: exchangeError?.message 
          });
          
          if (exchangeError) {
            console.error("[CALLBACK] Exchange failed:", exchangeError.message);
            
            // Check if session exists anyway (code might have been used already)
            const { data: retrySession } = await supabase.auth.getSession();
            if (retrySession?.session && !hasCompleted.current) {
              await handleRedirectWithSession(retrySession.session.user.id);
              subscription.unsubscribe();
              return;
            }
            
            // Real failure
            if (mounted && !hasCompleted.current) {
              hasCompleted.current = true;
              setAuthReady(true);
              setLastRedirectReason("exchange_failed");
              setErrorMessage("Login link expired or already used. Please request a new magic link.");
              setAuthState("error");
            }
            subscription.unsubscribe();
            return;
          }

          // Exchange succeeded
          if (exchangeData?.session && !hasCompleted.current) {
            if (DEBUG_AUTH) console.log("[CALLBACK] Exchange succeeded");
            await handleRedirectWithSession(exchangeData.session.user.id);
            subscription.unsubscribe();
          }
          
        } else if (hasHashTokens) {
          // Hash-based token flow - detectSessionInUrl should handle it
          // Wait a bit for Supabase to process the hash
          if (DEBUG_AUTH) console.log("[CALLBACK] Hash tokens detected, waiting for detectSessionInUrl...");
          
          // Give detectSessionInUrl time to process
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const { data: hashSession } = await supabase.auth.getSession();
          if (hashSession?.session && !hasCompleted.current) {
            if (DEBUG_AUTH) console.log("[CALLBACK] Session from hash tokens");
            await handleRedirectWithSession(hashSession.session.user.id);
            subscription.unsubscribe();
          } else if (!hasCompleted.current) {
            // Hash present but no session - might still be processing
            // The onAuthStateChange listener will catch it
            if (DEBUG_AUTH) console.log("[CALLBACK] Waiting for onAuthStateChange to catch hash session...");
          }
          
        } else {
          // No code and no hash - check if maybe detectSessionInUrl is still processing
          if (DEBUG_AUTH) console.log("[CALLBACK] No code or hash, waiting briefly for session...");
          
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const { data: delayedSession } = await supabase.auth.getSession();
          if (delayedSession?.session && !hasCompleted.current) {
            await handleRedirectWithSession(delayedSession.session.user.id);
            subscription.unsubscribe();
          } else if (!hasCompleted.current) {
            hasCompleted.current = true;
            setAuthReady(true);
            setLastRedirectReason("exchange_failed");
            setErrorMessage("No authentication code found. Please request a new magic link.");
            setAuthState("error");
            subscription.unsubscribe();
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
