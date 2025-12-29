import { Hero } from "@/components/landing/en/Hero";
import { Features } from "@/components/landing/en/Features";
import { Pricing } from "@/components/landing/en/Pricing";
import { Testimonials } from "@/components/landing/en/Testimonials";
import { FAQ } from "@/components/landing/en/FAQ";
import { FinalCTA } from "@/components/landing/en/FinalCTA";
import { TrustSection } from "@/components/landing/en/TrustSection";
import { ExitIntentPopup } from "@/components/landing/ExitIntentPopup";
import { SocialProof } from "@/components/landing/en/SocialProof";
import { StickyCTA } from "@/components/landing/en/StickyCTA";
import { Quiz } from "@/components/landing/en/Quiz";
import { CountdownTimer } from "@/components/landing/en/CountdownTimer";
import { AppDemo } from "@/components/landing/AppDemo";
import { Footer } from "@/components/landing/Footer";

const LandingEN = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Quiz />
      <AppDemo />
      <Features />
      <Testimonials />
      <CountdownTimer />
      <TrustSection />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <ExitIntentPopup />
      <SocialProof />
      <Footer />
      <StickyCTA />
    </div>
  );
};

export default LandingEN;
