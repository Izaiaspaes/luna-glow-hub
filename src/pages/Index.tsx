import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { FeaturedHighlights } from "@/components/FeaturedHighlights";
import { PricingComparison } from "@/components/PricingComparison";
import { PlanCalculator } from "@/components/PlanCalculator";
import { Statistics } from "@/components/Statistics";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { Privacy } from "@/components/Privacy";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { Layout } from "@/components/Layout";
import { HeroSkeleton, FeaturesSkeleton } from "@/components/skeletons";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect authenticated users to dashboard
    if (!loading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  // Show skeleton loading while checking auth
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen">
          <HeroSkeleton />
          <FeaturesSkeleton />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen">
        <AnnouncementBanner />
        <Hero />
        <Statistics />
        <FeaturedHighlights />
      <PricingComparison />
      <PlanCalculator />
      <Testimonials />
      <FAQ />
        <Privacy />
        <CTA />
        <Footer />
      </div>
    </Layout>
  );
};

export default Index;