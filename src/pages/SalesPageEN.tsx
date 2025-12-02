import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/Layout";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { PricingComparison } from "@/components/PricingComparison";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

const SalesPageEN = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Force English language for this sales page
    if (i18n.language !== 'en') {
      i18n.changeLanguage('en');
    }
  }, [i18n]);

  return (
    <Layout>
      <div className="min-h-screen">
        <Hero />
        <Features />
        <PricingComparison />
        <Testimonials />
        <FAQ />
        <CTA />
        <Footer />
      </div>
    </Layout>
  );
};

export default SalesPageEN;
