import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { ServicesHighlight } from "@/components/landing/ServicesHighlight";
import { Pricing } from "@/components/landing/Pricing";
import { Testimonials } from "@/components/landing/Testimonials";
import { CompetitorComparison } from "@/components/landing/CompetitorComparison";
import { CountdownTimer } from "@/components/landing/CountdownTimer";
import { FAQ } from "@/components/landing/FAQ";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { TrustSection } from "@/components/landing/TrustSection";
import { ExitIntentPopup } from "@/components/landing/ExitIntentPopup";
import { SocialProof } from "@/components/landing/SocialProof";
import { StickyCTA } from "@/components/landing/StickyCTA";
import { Quiz } from "@/components/landing/Quiz";
import { VideoDemo } from "@/components/landing/VideoDemo";

const LandingPT = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <VideoDemo videoId="dQw4w9WgXcQ" />
      <Features />
      <Quiz />
      <ServicesHighlight />
      <Testimonials />
      <CompetitorComparison />
      <CountdownTimer />
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

export default LandingPT;
