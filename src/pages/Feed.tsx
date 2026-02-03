import { useEffect, useState, useRef } from "react";
import { Routes, Route, Navigate, useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import JournalistFeed from "@/components/feed/JournalistFeed";
import AgencyFounderFeed from "@/components/feed/AgencyFounderFeed";
import FounderLayout from "@/layouts/FounderLayout";
import BillingGuard from "@/components/billing/BillingGuard";
import FindJournalists from "@/pages/founder/FindJournalists";
import PressPitchGenerator from "@/pages/founder/PressPitchGenerator";
import MediaLists from "@/pages/founder/MediaLists";
import SavedContacts from "@/pages/founder/SavedContacts";
import MyActivity from "@/pages/founder/MyActivity";
import Settings from "@/pages/founder/Settings";
import Help from "@/pages/founder/Help";
import { Button } from "@/components/ui/button";

// Gate debug logs: only in dev or with ?debug param
const DEBUG_AUTH = import.meta.env.DEV || new URLSearchParams(window.location.search).has("debug");

// Hard timeout to prevent infinite loading
const FEED_TIMEOUT_MS = 8000;

/**
 * Feed component - assumes route guards handle auth/subscription checks.
 * Does NOT perform independent redirects that could race with hydration.
 * Only fetches role to determine which layout to show.
 * Has hard timeout to prevent infinite loading.
 */
const Feed = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const [noSession, setNoSession] = useState(false);
  const fetchComplete = useRef(false);

  // Preserve debug param for child components
  const debugParam = searchParams.get("debug") === "1" ? "?debug=1" : "";

  useEffect(() => {
    let mounted = true;

    // Hard timeout failsafe
    const timeoutId = setTimeout(() => {
      if (mounted && !fetchComplete.current) {
        console.error("[Feed] Timeout after 8 seconds");
        fetchComplete.current = true;
        setHasTimedOut(true);
        setLoading(false);
      }
    }, FEED_TIMEOUT_MS);

    const fetchRole = async () => {
      try {
        // TEMP DEBUG: Log session check on Feed
        if (DEBUG_AUTH) console.log("[FEED] checking session...");
        const { data: { session } } = await supabase.auth.getSession();
        if (DEBUG_AUTH) console.log("[FEED] session result", { session: session ? "exists" : "null", userId: session?.user?.id });

        if (!mounted || fetchComplete.current) return;

        if (!session) {
          // No session - redirect to auth
          if (DEBUG_AUTH) console.log("[FEED] no session, redirecting to /auth");
          fetchComplete.current = true;
          setNoSession(true);
          setLoading(false);
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("role, onboarding_complete")
          .eq("id", session.user.id)
          .maybeSingle();

        if (!mounted || fetchComplete.current) return;

        fetchComplete.current = true;

        // If no profile or not onboarded, redirect to onboarding
        if (!profile?.onboarding_complete) {
          navigate("/onboarding", { replace: true });
          return;
        }

        setRole(profile.role);
        setLoading(false);
      } catch (error) {
        console.error("Feed: Error fetching role:", error);
        if (mounted && !fetchComplete.current) {
          fetchComplete.current = true;
          setHasTimedOut(true);
          setLoading(false);
        }
      }
    };

    fetchRole();

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, [navigate]);

  const handleBackToAuth = () => {
    navigate("/auth", { replace: true });
  };

  // No session - redirect to auth
  if (noSession) {
    return <Navigate to="/auth" replace />;
  }

  // Timeout state - show error with back to auth option
  if (hasTimedOut) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md px-4">
          <div className="text-yellow-500 text-5xl mb-4">⏳</div>
          <h2 className="text-xl font-semibold text-foreground">Taking too long...</h2>
          <p className="text-muted-foreground">
            We couldn't load your dashboard. Please try signing in again.
          </p>
          <Button onClick={handleBackToAuth}>
            Back to Sign In
          </Button>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // No role determined - redirect to onboarding
  if (!role) {
    return <Navigate to="/onboarding" replace />;
  }

  // Journalist role - redirect to journalist dashboard (no subscription needed)
  if (role === "journalist") {
    return <Navigate to={`/journalist/dashboard${debugParam}`} replace />;
  }

  // Founder/Agency/Admin roles - wrap in BillingGuard for subscription check
  return (
    <BillingGuard>
      <Routes>
        <Route element={<FounderLayout />}>
          <Route index element={<AgencyFounderFeed />} />
          <Route path="find-journalists" element={<FindJournalists />} />
          <Route path="pitch-generator" element={<PressPitchGenerator />} />
          <Route path="media-lists" element={<MediaLists />} />
          <Route path="saved-contacts" element={<SavedContacts />} />
          <Route path="activity" element={<MyActivity />} />
          <Route path="settings" element={<Settings />} />
          <Route path="help" element={<Help />} />
        </Route>
      </Routes>
    </BillingGuard>
  );
};

export default Feed;
