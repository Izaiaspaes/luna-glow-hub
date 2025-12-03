import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { Check, X, Sparkles, Crown, Gift } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCurrency } from "@/hooks/useCurrency";
import { useDynamicPricing } from "@/hooks/useDynamicPricing";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const PricingComparison = () => {
  const { t } = useTranslation();
  const { currency } = useCurrency();
  const { pricing, formatPrice } = useDynamicPricing();
  const navigate = useNavigate();
  const [redirecting, setRedirecting] = useState(false);
  
  const prices = pricing[currency];

  const handleCTAClick = () => {
    setRedirecting(true);
    setTimeout(() => {
      navigate('/auth');
    }, 600);
  };

  const features = [
    {
      category: t("pricingComparison.tracking"),
      items: [
        { name: t("pricingComparison.features.cycleTracking"), free: true, premium: true, premiumPlus: true },
        { name: t("pricingComparison.features.moodSleep"), free: true, premium: true, premiumPlus: true },
        { name: t("pricingComparison.features.wellnessPlans"), free: "1", premium: t("pricingComparison.unlimited"), premiumPlus: t("pricingComparison.unlimited") },
      ]
    },
    {
      category: t("pricingComparison.aiFeatures"),
      items: [
        { name: t("pricingComparison.features.aiRecommendations"), free: false, premium: true, premiumPlus: true },
        { name: t("pricingComparison.features.womenDiary"), free: false, premium: true, premiumPlus: true },
        { name: t("pricingComparison.features.sosFeminino"), free: false, premium: true, premiumPlus: true },
        { name: t("pricingComparison.features.lunaSense"), free: false, premium: false, premiumPlus: true },
        { name: t("pricingComparison.features.beautyAnalysis"), free: false, premium: false, premiumPlus: true },
        { name: t("pricingComparison.features.virtualCloset"), free: false, premium: false, premiumPlus: true },
      ]
    },
    {
      category: t("pricingComparison.other"),
      items: [
        { name: t("pricingComparison.features.partner"), free: true, premium: true, premiumPlus: true },
        { name: t("pricingComparison.features.privacy"), free: true, premium: true, premiumPlus: true },
        { name: t("pricingComparison.features.support"), free: t("pricingComparison.basic"), premium: t("pricingComparison.priority"), premiumPlus: t("pricingComparison.vip") },
      ]
    }
  ];

  const plans = [
    {
      name: "Free",
      icon: Gift,
      price: formatPrice(prices.free.monthly, currency),
      description: t("pricingComparison.plans.free.description"),
      color: "luna-blue",
      gradient: "from-luna-blue/10 to-transparent",
      highlight: false
    },
    {
      name: "Premium",
      icon: Sparkles,
      price: formatPrice(prices.premium.monthly, currency),
      description: t("pricingComparison.plans.premium.description"),
      color: "luna-purple",
      gradient: "from-luna-purple/10 to-transparent",
      highlight: true
    },
    {
      name: "Premium Plus",
      icon: Crown,
      price: formatPrice(prices.premiumPlus.monthly, currency),
      description: t("pricingComparison.plans.premiumPlus.description"),
      color: "luna-pink",
      gradient: "from-luna-pink/10 to-transparent",
      highlight: false
    }
  ];

  const renderFeatureValue = (value: boolean | string) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className="h-5 w-5 text-luna-green mx-auto" />
      ) : (
        <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
      );
    }
    return <span className="text-sm font-medium">{value}</span>;
  };

  return (
    <section className="py-20 bg-background relative">
      {/* Redirect Animation Overlay */}
      {redirecting && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center animate-fade-in">
          <div className="text-center space-y-4 animate-scale-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-colorful animate-pulse">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <p className="text-lg font-medium">{t('pricing.redirecting') || 'Redirecionando para login...'}</p>
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            <span>{t("pricingComparison.badge")}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">
            {t("pricingComparison.title")}{" "}
            <span className="bg-gradient-colorful bg-clip-text text-transparent">
              {t("pricingComparison.titleHighlight")}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("pricingComparison.subtitle")}
          </p>
        </div>

        {/* Comparison Table */}
        <div className="max-w-6xl mx-auto">
          {/* Plans Header */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="col-span-1"></div>
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              return (
                <Card 
                  key={index}
                  className={`relative overflow-hidden ${plan.highlight ? 'border-primary border-2 shadow-hover' : 'border-2'}`}
                >
                  {plan.highlight && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-colorful text-white text-xs font-bold py-1 text-center">
                      {t("pricingComparison.mostPopular")}
                    </div>
                  )}
                  <div className={`p-6 ${plan.highlight ? 'pt-10' : ''}`}>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className={`p-2 rounded-lg bg-${plan.color}`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold">{plan.name}</h3>
                    </div>
                    <div className="text-center mb-2">
                      <div className="text-3xl font-bold text-primary">{plan.price}</div>
                      {plan.name !== "Free" && (
                        <div className="text-sm text-muted-foreground">/mês</div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground text-center">{plan.description}</p>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Features Comparison */}
          {features.map((category, catIndex) => (
            <div key={catIndex} className="mb-8">
              <h4 className="text-lg font-bold mb-4 text-foreground">{category.category}</h4>
              {category.items.map((item, itemIndex) => (
                <div 
                  key={itemIndex}
                  className={`grid grid-cols-4 gap-4 p-4 ${itemIndex % 2 === 0 ? 'bg-muted/30' : ''} rounded-lg`}
                >
                  <div className="col-span-1 flex items-center">
                    <span className="text-sm text-foreground">{item.name}</span>
                  </div>
                  <div className="flex items-center justify-center">
                    {renderFeatureValue(item.free)}
                  </div>
                  <div className="flex items-center justify-center">
                    {renderFeatureValue(item.premium)}
                  </div>
                  <div className="flex items-center justify-center">
                    {renderFeatureValue(item.premiumPlus)}
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* CTA Buttons */}
          <div className="grid grid-cols-4 gap-4 mt-8">
            <div className="col-span-1"></div>
            {plans.map((plan, index) => (
              <div key={index} className="flex justify-center">
                <Button 
                  variant={plan.highlight ? "colorful" : "outline"}
                  size="lg"
                  className="w-full"
                  onClick={handleCTAClick}
                  disabled={redirecting}
                >
                  {redirecting ? t("pricing.redirecting") : t("pricingComparison.cta")}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
