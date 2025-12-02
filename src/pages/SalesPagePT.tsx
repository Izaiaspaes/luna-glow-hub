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

const SalesPagePT = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Force Portuguese language for this sales page
    if (i18n.language !== 'pt') {
      i18n.changeLanguage('pt');
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

export default SalesPagePT;
