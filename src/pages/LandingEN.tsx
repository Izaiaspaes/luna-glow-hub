import { Hero } from "@/components/landing/en/Hero";
import { Features } from "@/components/landing/en/Features";
import { Pricing } from "@/components/landing/en/Pricing";
import { Testimonials } from "@/components/landing/en/Testimonials";
import { FAQ } from "@/components/landing/en/FAQ";
import { FinalCTA } from "@/components/landing/en/FinalCTA";
import { TrustSection } from "@/components/landing/en/TrustSection";
import { ExitIntentPopup } from "@/components/landing/ExitIntentPopup";

const LandingEN = () => {
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
    </div>
  );
};

export default LandingEN;
