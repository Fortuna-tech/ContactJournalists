import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";

// Log config in development only for debugging
if (import.meta.env.DEV) {
  console.log("[AUTH] Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
}

const MAGIC_LINK_COOLDOWN_MS = 60000; // 60 seconds

const Auth = () => {
  const [email, setEmail] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const hydrationComplete = useRef(false);
  const lastOtpRequestTime = useRef<number>(0);

  const navigate = useNavigate();

  // Primary hydration: getSession() on mount with timeout failsafe
  useEffect(() => {
    let mounted = true;

    // Hard timeout failsafe: force loading to complete after 1500ms
    const timeoutId = setTimeout(() => {
      if (mounted && !hydrationComplete.current) {
        console.warn("[Auth] Hydration timeout: forcing isAuthLoading = false after 1500ms");
        hydrationComplete.current = true;
        setIsAuthLoading(false);
      }
    }, 1500);

    const hydrateSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        // Set session state from result
        setSession(initialSession);
      } catch (error) {
        console.warn("[Auth] getSession() failed:", error);
      } finally {
        // Always set isAuthLoading = false after getSession() resolves
        if (mounted && !hydrationComplete.current) {
          hydrationComplete.current = true;
          setIsAuthLoading(false);
        }
      }
    };

    hydrateSession();

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  // Supplementary: onAuthStateChange updates session (not required for hydration)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Handle redirect when session exists (after hydration completes)
  useEffect(() => {
    if (isAuthLoading || !session) return;

    let mounted = true;

    const redirectLoggedInUser = async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_complete")
        .eq("id", session.user.id)
        .maybeSingle();

      if (!mounted) return;

      if (profile?.onboarding_complete) {
        navigate("/feed", { replace: true });
      } else {
        navigate("/onboarding", { replace: true });
      }
    };

    redirectLoggedInUser();

    return () => {
      mounted = false;
    };
  }, [isAuthLoading, session, navigate]);

  const { toast } = useToast();

  // Cooldown timer effect
  useEffect(() => {
    if (cooldownRemaining <= 0) return;
    const timer = setInterval(() => {
      setCooldownRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownRemaining]);

  const emailMutation = useMutation({
    mutationFn: async (email: string) => {
      // Clear any previous error
      setOtpError(null);

      console.log("[AUTH OTP] sending to", email);

      // Let Supabase use its configured Site URL for redirect
      const { data, error } = await supabase.auth.signInWithOtp({ email });

      console.log("[AUTH OTP] result", { data, error });

      if (error) {
        // Set inline error for visibility
        setOtpError(error.message);
        throw error;
      }

      // Only record successful request time for cooldown
      lastOtpRequestTime.current = Date.now();
      setCooldownRemaining(Math.ceil(MAGIC_LINK_COOLDOWN_MS / 1000));
    },
    onSuccess: () => {
      toast({
        title: "Check your email",
        description: "We sent you a magic link to sign in.",
      });
    },
    onError: (error: Error) => {
      console.error("[AUTH OTP] Error:", error.message);
      toast({
        title: "Error sending magic link",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const googleMutation = useMutation({
    mutationFn: async () => {
      console.log("[AUTH GOOGLE] initiating OAuth");
      
      // Let Supabase use its configured Site URL for redirect
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      if (error) throw error;
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check cooldown to prevent spam clicking
    if (cooldownRemaining > 0) {
      toast({
        title: "Please wait",
        description: `You can request another link in ${cooldownRemaining} seconds.`,
        variant: "destructive",
      });
      return;
    }

    if (email) {
      emailMutation.mutate(email);
    }
  };

  const handleGoogleLogin = () => {
    googleMutation.mutate();
  };

  // Show loading while auth state is hydrating
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side - Image */}
      <div className="hidden lg:block bg-accent">
        <div className="h-full flex items-center justify-center p-12">
          <div className="text-center space-y-4">
            <h1 className="text-6xl font-semibold text-foreground">
              Contact Journalist
            </h1>
            <p className="text-xl text-muted-foreground">
              Connect journalists with sources
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Welcome</h2>
            <p className="text-muted-foreground">Sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  // Clear error when user starts typing
                  if (otpError) setOtpError(null);
                }}
                className={`h-12 ${otpError ? "border-destructive" : ""}`}
                required
              />
              {/* Inline error message */}
              {otpError && (
                <p className="text-sm text-destructive">{otpError}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12"
              disabled={emailMutation.isPending || cooldownRemaining > 0}
            >
              {emailMutation.isPending
                ? "Sending magic link..."
                : cooldownRemaining > 0
                ? `Wait ${cooldownRemaining}s before resending`
                : "Continue with Email"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full h-12"
            onClick={handleGoogleLogin}
            disabled={googleMutation.isPending}
          >
            {googleMutation.isPending
              ? "Redirecting..."
              : "Continue with Google"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
