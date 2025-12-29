import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { trackCTAClick, trackStartOnboarding, trackViewFeatures } from "@/lib/analytics";

export const CTA = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleStartClick = () => {
    trackCTAClick({
      ctaLocation: 'cta_section',
      ctaText: t('cta.startButton'),
      destination: '/auth'
    });
    trackStartOnboarding({ source: 'cta_section' });
    navigate("/auth");
  };

  const handleFeaturesClick = () => {
    trackCTAClick({
      ctaLocation: 'cta_section',
      ctaText: t('cta.featuresButton'),
      destination: '/features'
    });
    trackViewFeatures({ source: 'cta_section' });
    navigate("/features");
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-grid-white/5 bg-[size:30px_30px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl" />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6 animate-fade-in">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-semibold">{t('cta.badge')}</span>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-primary-glow to-secondary bg-clip-text text-transparent animate-fade-in">
          {t('cta.title')}
        </h2>

        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in">
          {t('cta.subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
          <Button
            size="lg"
            variant="colorful"
            onClick={handleStartClick}
            className="group text-lg px-8 py-6"
          >
            {t('cta.startButton')}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={handleFeaturesClick}
            className="border-primary/50 hover:bg-primary/5 hover:border-primary transition-all duration-300 text-lg px-8 py-6"
          >
            {t('cta.featuresButton')}
          </Button>
        </div>

        <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground animate-fade-in">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span>{t('cta.noCard')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span>{t('cta.private')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span>{t('cta.cancelAnytime')}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
