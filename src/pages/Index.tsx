import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Privacy } from "@/components/Privacy";
import { Waitlist } from "@/components/Waitlist";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <Privacy />
      <Waitlist />
      <Footer />
    </div>
  );
};

export default Index;
