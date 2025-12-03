import { Hero } from "@/components/landing/es/Hero";
import { Quiz } from "@/components/landing/es/Quiz";
import { CountdownTimer } from "@/components/landing/es/CountdownTimer";
import { Features } from "@/components/landing/es/Features";
import { ServicesHighlight } from "@/components/landing/es/ServicesHighlight";
import { Pricing } from "@/components/landing/es/Pricing";
import { SavingsCalculator } from "@/components/landing/es/SavingsCalculator";
import { PackageComparison } from "@/components/landing/es/PackageComparison";
import { CompetitorComparisonES } from "@/components/landing/es/CompetitorComparison";
import { Testimonials } from "@/components/landing/es/Testimonials";
import { TrustSection } from "@/components/landing/es/TrustSection";
import { FAQ } from "@/components/landing/es/FAQ";
import { FinalCTA } from "@/components/landing/es/FinalCTA";
import { ExitIntentPopup } from "@/components/landing/ExitIntentPopup";
import { FloatingChatES } from "@/components/FloatingChat/es";
import { SocialProofES } from "@/components/landing/es/SocialProof";
import { StickyCTAES } from "@/components/landing/es/StickyCTA";

const LandingES = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Quiz />
      <CountdownTimer />
      <Features />
      <ServicesHighlight />
      <Pricing />
      <SavingsCalculator />
      <PackageComparison />
      <CompetitorComparisonES />
      <Testimonials />
      <TrustSection />
      <FAQ />
      <FinalCTA />
      <ExitIntentPopup />
      <FloatingChatES />
      <SocialProofES />
      <StickyCTAES />
    </div>
  );
};

export default LandingES;
