import { Hero } from "@/components/landing/Hero";
import { Quiz } from "@/components/landing/Quiz";
import { CountdownTimer } from "@/components/landing/CountdownTimer";
import { Features } from "@/components/landing/Features";
import { ServicesHighlight } from "@/components/landing/ServicesHighlight";
import { Pricing } from "@/components/landing/Pricing";
import { SavingsCalculator } from "@/components/landing/SavingsCalculator";
import { PackageComparison } from "@/components/landing/PackageComparison";
import { CompetitorComparison } from "@/components/landing/CompetitorComparison";
import { Testimonials } from "@/components/landing/Testimonials";
import { TrustSection } from "@/components/landing/TrustSection";
import { FAQ } from "@/components/landing/FAQ";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { ExitIntentPopup } from "@/components/landing/ExitIntentPopup";
import { FloatingChat } from "@/components/FloatingChat";
import { SocialProof } from "@/components/landing/SocialProof";
import { StickyCTA } from "@/components/landing/StickyCTA";

const Index = () => {
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
      <CompetitorComparison />
      <Testimonials />
      <TrustSection />
      <FAQ />
      <FinalCTA />
      <ExitIntentPopup />
      <FloatingChat />
      <SocialProof />
      <StickyCTA />
    </div>
  );
};

export default Index;
