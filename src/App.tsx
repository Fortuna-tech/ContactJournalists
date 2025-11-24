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
import BlogPost from "./pages/BlogPost";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/blog/how-to-get-press-for-your-brand-without-a-pr-agency"
            element={<BlogPost />}
          />
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
            <Route path="saved-sources" element={<JournalistSavedSources />} />
            <Route path="settings" element={<JournalistSettings />} />
            <Route path="help" element={<JournalistHelp />} />
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
