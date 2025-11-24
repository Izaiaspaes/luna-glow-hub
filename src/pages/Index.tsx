import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Statistics } from "@/components/Statistics";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { Privacy } from "@/components/Privacy";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <Statistics />
      <Testimonials />
      <FAQ />
      <Privacy />
      <CTA />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
