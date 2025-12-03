import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useDynamicPricing } from "@/hooks/useDynamicPricing";
import { useCurrency } from "@/hooks/useCurrency";

export const Pricing = () => {
  const { pricing, formatPrice, isLoading } = useDynamicPricing();
  const { currency } = useCurrency();
  const prices = pricing[currency];

  const plans = [
    {
      name: "Free",
      price: formatPrice(0, currency),
      period: "forever",
      description: "Perfect to start your journey",
      features: [
        "Basic cycle tracking",
        "Menstrual calendar",
        "Phase predictions",
        "Limited Luna Sense access",
      ],
      cta: "Start Free",
      variant: "ctaOutline" as const,
      popular: false
    },
    {
      name: "Premium Monthly",
      price: formatPrice(prices.premium.monthly, currency),
      period: "/month",
      description: "All features unlocked",
      features: [
        "Everything in Free",
        "Luna Sense 24/7 unlimited",
        "AI-powered journal analysis",
        "Priority SOS support",
        "Beauty analyses",
        "Advanced health insights",
      ],
      cta: "Subscribe Now",
      variant: "cta" as const,
      popular: true
    },
    {
      name: "Premium Plus Annual",
      price: formatPrice(prices.premiumPlus.yearly, currency),
      originalPrice: formatPrice(prices.premiumPlus.monthly * 12, currency),
      period: "/year",
      badge: "Best Value",
      description: "Complete transformation guaranteed",
      features: [
        "Everything in Premium",
        "Smart Virtual Closet",
        "Phase-personalized plans",
        "Exclusive VIP community",
        "Monthly premium content",
        "Priority 24/7 support",
        "Lifetime access to new features",
      ],
      cta: "Get Best Value",
      variant: "cta" as const,
      popular: false,
      highlight: true
    }
  ];

  if (isLoading) {
    return (
      <section className="py-24 bg-gradient-to-b from-background to-luna-pink-light/30">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">Loading prices...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-b from-background to-luna-pink-light/30">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="bg-primary/10 text-primary border-0 mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            Limited Offer
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Choose the perfect subscription package for you
          </h2>
          <p className="text-xl text-muted-foreground">
            Start free and upgrade when you're ready to transform your wellness
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -10 }}
            >
              <Card className={`relative p-8 space-y-6 transition-all duration-300 h-full ${
                plan.highlight 
                  ? 'border-4 border-primary shadow-2xl scale-105 bg-gradient-to-br from-card to-luna-pink-light' 
                  : 'border-2 hover:border-primary/30 hover:shadow-xl'
              }`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                )}
                
                {plan.badge && (
                  <Badge className="absolute -top-3 right-6 gradient-bg text-white font-bold px-4 py-1">
                    {plan.badge}
                  </Badge>
                )}

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    {plan.name}
                    {plan.highlight && <Crown className="w-5 h-5 text-primary" />}
                  </h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  {plan.originalPrice && (
                    <div className="text-sm text-muted-foreground line-through">
                      Was {plan.originalPrice}
                    </div>
                  )}
                </div>

                <Button 
                  size="lg" 
                  variant={plan.variant}
                  className="w-full"
                  onClick={() => window.location.href = '/pricing'}
                >
                  {plan.cta}
                </Button>

                <ul className="space-y-3 pt-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center mt-12 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          All packages include 7-day satisfaction guarantee • Cancel anytime
        </motion.div>
      </div>
    </section>
  );
};
