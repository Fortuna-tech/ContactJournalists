import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import Onboarding from "./pages/Onboarding";
import Feed from "./pages/Feed";
import JournalistQueryDetail from "@/components/feed/JournalistQueryDetail";
import GetPress from "./pages/blog/GetPress";
import Affiliate from "./pages/Affiliate";
import Profile from "./pages/Profile";

// Journalist Pages
import JournalistDashboard from "@/pages/journalist/Dashboard";
import MyRequests from "@/pages/journalist/MyRequests";
import CreateRequest from "@/pages/journalist/CreateRequest";
import RequestDetails from "@/pages/journalist/RequestDetails";
import JournalistSavedSources from "@/pages/journalist/SavedSources";
import JournalistSettings from "@/pages/journalist/Settings";
import JournalistHelp from "@/pages/journalist/Help";
import JournalistLayout from "@/layouts/JournalistLayout";
import PressPitchExamplesBlog from "./pages/blog/PressPitchExamplesBlog";
import { HelmetProvider } from "react-helmet-async";
import PLTemplateBlogPost from "./pages/blog/PLTemplateBlog";
import UltimateGuideBlog from "./pages/blog/UltimateGuideBlog";
import PressWithoutAgencyBlog from "./pages/blog/PressWithoutAgencyBlog";
import HowToPitchJournalistsTwitter from "./pages/blog/HowToPitchJournalistsTwitter";
import HowToFindRightReporterBlog from "./pages/blog/HowToFindRightReporterBlog";
import PRForFoundersBlog from "./pages/blog/PRForFoundersBlog";
import FounderMistakesBlog from "./pages/blog/FounderMistakesBlog";
import FollowingUpBlog from "./pages/blog/FollowingUpBlog";
import BestTimeToEmailBlog from "./pages/blog/BestTimeToEmailBlog";
import PRPlaybookSoloFoundersBlog from "./pages/blog/PRPlaybookSoloFoundersBlog";
import PlacesToFindJournalistsBlog from "./pages/blog/PlacesToFindJournalistsBlog";
import HowToTurnTweetIntoPressFeature from "./pages/blog/HowToTurnTweetIntoPressFeature";
import ReachJournalistsByNicheBlog from "./pages/blog/ReachJournalistsByNicheBlog";
import BlogPost from "./pages/blog/BlogPost";
import Guides from "./pages/Guides";
import WaitlisSignup from "./pages/WaitlisSignup";

// Admin Pages
import AdminLayout from "@/layouts/AdminLayout";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminJournalists from "@/pages/admin/Journalists";
import AdminCsvImport from "@/pages/admin/CsvImport";
import AdminBannerManagement from "@/pages/admin/BannerManagement";
import AdminStoryRequestBroadcasts from "@/pages/admin/StoryRequestBroadcasts";
import SimpleBlogScheduler from "@/pages/admin/SimpleBlogScheduler";
import BlogForm from "@/pages/admin/BlogForm";
import MfaSetup from "@/pages/admin/MfaSetup";
import MfaVerify from "@/pages/admin/MfaVerify";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <HelmetProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/guides" element={<Guides />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/waitlist-signup" element={<WaitlisSignup />} />
            <Route
              path="/blog/how-to-get-press-for-your-brand-without-a-pr-agency"
              element={<GetPress />}
            />
            <Route
              path="/blog/press-pitch-examples-that-get-replies"
              element={<PressPitchExamplesBlog />}
            />
            <Route
              path="/blog/free-small-business-pl-template-google-sheets-excel"
              element={<PLTemplateBlogPost />}
            />
            <Route
              path="/blog/ultimate-guide-best-platforms-contacting-journalists-2026"
              element={<UltimateGuideBlog />}
            />
            <Route
              path="/blog/the-fastest-ways-to-get-press-coverage-without-an-agency"
              element={<PressWithoutAgencyBlog />}
            />
            <Route
              path="/blog/how-to-pitch-journalists-on-twitter"
              element={<HowToPitchJournalistsTwitter />}
            />
            <Route
              path="/blog/how-to-find-the-right-reporter-for-your-story"
              element={<HowToFindRightReporterBlog />}
            />
            <Route
              path="/blog/how-founders-can-use-pr-to-explode-early-stage-growth"
              element={<PRForFoundersBlog />}
            />
            <Route
              path="/blog/11-mistakes-founders-make-when-pitching-journalists"
              element={<FounderMistakesBlog />}
            />
            <Route
              path="/blog/why-following-up-matters-and-how-often-to-do-it"
              element={<FollowingUpBlog />}
            />
            <Route
              path="/blog/best-time-of-day-to-email-journalists"
              element={<BestTimeToEmailBlog />}
            />
            <Route
              path="/blog/pr-playbook-for-solo-founders"
              element={<PRPlaybookSoloFoundersBlog />}
            />
            <Route
              path="/blog/20-places-to-find-journalists-covering-your-niche"
              element={<PlacesToFindJournalistsBlog />}
            />
            <Route
              path="/blog/how-to-turn-a-tweet-into-a-press-feature"
              element={<HowToTurnTweetIntoPressFeature />}
            />
            <Route
              path="/blog/how-to-reach-food-fitness-beauty-tech-journalists"
              element={<ReachJournalistsByNicheBlog />}
            />
            {/* Generic blog post route - reads from Supabase */}
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/affiliates" element={<Affiliate />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/onboarding" element={<Onboarding />} />

            {/* Legacy/Founder Feed Route */}
            <Route path="/feed/*" element={<Feed />}>
              <Route path=":queryId" element={<JournalistQueryDetail />} />
            </Route>

            {/* New Journalist Routes */}
            <Route path="/journalist" element={<JournalistLayout />}>
              <Route index element={<JournalistDashboard />} />
              <Route path="dashboard" element={<JournalistDashboard />} />
              <Route path="requests" element={<MyRequests />} />
              <Route path="requests/new" element={<CreateRequest />} />
              <Route path="requests/:id" element={<RequestDetails />} />
              <Route
                path="saved-sources"
                element={<JournalistSavedSources />}
              />
              <Route path="settings" element={<JournalistSettings />} />
              <Route path="help" element={<JournalistHelp />} />
            </Route>

            {/* Admin MFA Routes (outside AdminLayout to avoid redirect loops) */}
            <Route path="/admin/mfa-setup" element={<MfaSetup />} />
            <Route path="/admin/mfa-verify" element={<MfaVerify />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="journalists" element={<AdminJournalists />} />
              <Route path="import" element={<AdminCsvImport />} />
              <Route path="banners" element={<AdminBannerManagement />} />
              <Route
                path="story-requests"
                element={<AdminStoryRequestBroadcasts />}
              />
            </Route>

            {/* Private Blog Admin Dashboard - Secret URL */}
            <Route
              path="/admin/blog-dashboard-a7f3b9c2d1e4f5a6"
              element={<SimpleBlogScheduler />}
            />
            <Route
              path="/admin/blog-dashboard-a7f3b9c2d1e4f5a6/new"
              element={<BlogForm />}
            />
            <Route
              path="/admin/blog-dashboard-a7f3b9c2d1e4f5a6/edit/:id"
              element={<BlogForm />}
            />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HelmetProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
