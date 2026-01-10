import { useEffect, useState } from "react";
import { useNavigate, Routes, Route, Navigate } from "react-router-dom";
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

const Feed = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate("/auth");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role, onboarding_complete")
        .eq("id", session.user.id)
        .maybeSingle();

      if (!profile?.onboarding_complete) {
        navigate("/onboarding");
        return;
      }

      setRole(profile.role);
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

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

  if (!role) return null;

  if (role === "journalist") {
    return <Navigate to="/journalist/dashboard" replace />;
  }

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
