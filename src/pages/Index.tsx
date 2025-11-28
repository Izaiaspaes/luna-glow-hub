import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Statistics } from "@/components/Statistics";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { Privacy } from "@/components/Privacy";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Layout } from "@/components/Layout";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect authenticated users to dashboard
    if (!loading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  // Show loading while checking auth
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen">
        <Hero />
        <Statistics />
        <Testimonials />
        <FAQ />
        <Privacy />
        <CTA />
        <Footer />
        <WhatsAppButton />
      </div>
    </Layout>
  );
};

export default Index;