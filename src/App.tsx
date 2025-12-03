import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSessionTimeout } from "./hooks/useSessionTimeout";
import { SessionTimeoutModal } from "./components/SessionTimeoutModal";
import { SOSButton } from "./components/SOSButton";
import Index from "./pages/Index";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import PricingSuccess from "./pages/PricingSuccess";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import PartnerInvite from "./pages/PartnerInvite";
import PartnerDashboard from "./pages/PartnerDashboard";
import Onboarding from "./pages/Onboarding";
import Install from "./pages/Install";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import LandingPT from "./pages/LandingPT";
import LandingEN from "./pages/LandingEN";
import LandingES from "./pages/LandingES";
import "./i18n";

const queryClient = new QueryClient();

const AppContent = () => {
  const { showWarning, handleRenewSession, handleLogout } = useSessionTimeout();

  return (
    <>
      <Toaster />
      <Sonner />
      <SOSButton />
      <SessionTimeoutModal
        open={showWarning}
        onRenew={handleRenewSession}
        onLogout={handleLogout}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/pricing/success" element={<PricingSuccess />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/partner-invite" element={<PartnerInvite />} />
          <Route path="/partner-dashboard" element={<PartnerDashboard />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/install" element={<Install />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <AppContent />
      </Suspense>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
