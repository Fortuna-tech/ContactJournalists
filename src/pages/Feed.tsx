import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import JournalistFeed from "@/components/feed/JournalistFeed";
import AgencyFounderFeed from "@/components/feed/AgencyFounderFeed";
import FounderLayout from "@/layouts/FounderLayout";
import JournalistLayout from "@/layouts/JournalistLayout";
import BillingGuard from "@/components/billing/BillingGuard";
import FindJournalists from "@/pages/founder/FindJournalists";
import PressPitchGenerator from "@/pages/founder/PressPitchGenerator";
import MediaLists from "@/pages/founder/MediaLists";
import SavedContacts from "@/pages/founder/SavedContacts";
import MyActivity from "@/pages/founder/MyActivity";
import Settings from "@/pages/founder/Settings";
import Help from "@/pages/founder/Help";

/**
 * Feed component - assumes route guards handle auth/subscription checks.
 * Does NOT perform independent redirects that could race with hydration.
 * Only fetches role to determine which layout to show.
 */
const Feed = () => {
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);

  // Preserve debug param for child components
  const debugParam = searchParams.get("debug") === "1" ? "?debug=1" : "";

  useEffect(() => {
    let mounted = true;

    const fetchRole = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!mounted) return;

        // Mark auth as ready after first check
        setAuthReady(true);

        if (!session) {
          // No session - but DON'T redirect here.
          // Let parent route guards handle unauthenticated users.
          // Just show loading state and let the guard redirect if needed.
          setLoading(false);
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("role, onboarding_complete")
          .eq("id", session.user.id)
          .maybeSingle();

        if (!mounted) return;

        // If profile check fails or incomplete, don't redirect - let guards handle it
        if (profile) {
          setRole(profile.role);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Feed: Error fetching role:", error);
        if (mounted) {
          setLoading(false);
          setAuthReady(true);
        }
      }
    };

    fetchRole();

    return () => {
      mounted = false;
    };
  }, []);

  // Loading state - no redirects during load
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

  // No role determined - show minimal state, don't redirect
  // BillingGuard or auth guards will handle unauthorized access
  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Checking access...</p>
        </div>
      </div>
    );
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
