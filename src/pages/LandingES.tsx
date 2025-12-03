import { Hero } from "@/components/landing/es/Hero";
import { Features } from "@/components/landing/es/Features";
import { Pricing } from "@/components/landing/es/Pricing";
import { Testimonials } from "@/components/landing/es/Testimonials";
import { FAQ } from "@/components/landing/es/FAQ";
import { FinalCTA } from "@/components/landing/es/FinalCTA";
import { TrustSection } from "@/components/landing/es/TrustSection";
import { ExitIntentPopup } from "@/components/landing/ExitIntentPopup";
import { SocialProof } from "@/components/landing/es/SocialProof";
import { StickyCTA } from "@/components/landing/es/StickyCTA";

const LandingES = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <Testimonials />
      <TrustSection />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <ExitIntentPopup />
      <SocialProof />
      <StickyCTA />
    </div>
  );
};

export default LandingES;
