import { useEffect, useMemo, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Sparkles, 
  Calendar,
  MessageSquare,
  Heart,
  Camera,
  ShoppingBag,
  TrendingUp,
  ArrowRight,
  Star,
  PartyPopper
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { trackPurchase } from "@/lib/analytics";
import Confetti from "@/components/Confetti";

const PricingSuccess = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, subscriptionStatus, userProfile } = useAuth();
  const emailSentRef = useRef(false);

  // Preview mode for design testing (use ?preview=true or ?preview=plus)
  const previewMode = searchParams.get("preview");
  const isPreviewMode = previewMode === "true" || previewMode === "plus";

  useEffect(() => {
    // If not logged in and not in preview mode, redirect to auth
    if (!user && !isPreviewMode) {
      navigate("/auth");
    }
  }, [user, navigate, isPreviewMode]);

  // Determine if user is Premium or Premium Plus
  const isPremiumPlus = useMemo(() => {
    // In preview mode, check if preview=plus
    if (isPreviewMode) {
      return previewMode === "plus";
    }
    const stripeProductIds = ['prod_TVfx4bH4H0okVe', 'prod_TVfxAziuEOC4QN'];
    const hasStripePremiumPlus = subscriptionStatus?.product_id && stripeProductIds.includes(subscriptionStatus.product_id);
    const hasDbPremiumPlus = userProfile?.subscription_plan === 'premium_plus';
    return hasStripePremiumPlus || hasDbPremiumPlus;
  }, [subscriptionStatus, userProfile, isPreviewMode, previewMode]);

  // Track purchase and send confirmation email once when page loads (skip in preview mode)
  useEffect(() => {
    const handlePurchaseSuccess = async () => {
      if (!user || emailSentRef.current || isPreviewMode) return;
      
      // Check if subscription is active (either via Stripe or database)
      const hasActiveSubscription = subscriptionStatus?.subscribed || 
        userProfile?.subscription_plan === 'premium' || 
        userProfile?.subscription_plan === 'premium_plus';
      
      if (!hasActiveSubscription) return;

      emailSentRef.current = true;
      
      const planType = isPremiumPlus ? 'premium_plus' : 'premium';
      
      // Track purchase event for GTM/GA4
      trackPurchase({ planType });
      
      try {
        await supabase.functions.invoke('send-subscription-confirmation', {
          body: {
            userId: user.id,
            planType,
            billingPeriod: 'monthly' // Default, could be enhanced to detect actual billing period
          }
        });
        
        console.log('[PricingSuccess] Confirmation email sent');
      } catch (error) {
        console.error('[PricingSuccess] Error sending confirmation email:', error);
      }
    };

    handlePurchaseSuccess();
  }, [user, subscriptionStatus, userProfile, isPremiumPlus, isPreviewMode]);

  const planName = isPremiumPlus ? "Premium Plus" : "Premium";

  // Define features based on plan tier
  const premiumFeatures = [
    {
      icon: Sparkles,
      title: t('pricingSuccess.features.unlimitedPlans.title'),
      description: t('pricingSuccess.features.unlimitedPlans.desc')
    },
    {
      icon: TrendingUp,
      title: t('pricingSuccess.features.aiRecommendations.title'),
      description: t('pricingSuccess.features.aiRecommendations.desc')
    },
    {
      icon: MessageSquare,
      title: t('pricingSuccess.features.womenJournal.title'),
      description: t('pricingSuccess.features.womenJournal.desc')
    },
    {
      icon: Heart,
      title: t('pricingSuccess.features.sosFeminino.title'),
      description: t('pricingSuccess.features.sosFeminino.desc')
    }
  ];

  const premiumPlusFeatures = [
    ...premiumFeatures,
    {
      icon: MessageSquare,
      title: t('pricingSuccess.features.lunaSense.title'),
      description: t('pricingSuccess.features.lunaSense.desc')
    },
    {
      icon: Camera,
      title: t('pricingSuccess.features.beautyAnalysis.title'),
      description: t('pricingSuccess.features.beautyAnalysis.desc')
    },
    {
      icon: ShoppingBag,
      title: t('pricingSuccess.features.virtualCloset.title'),
      description: t('pricingSuccess.features.virtualCloset.desc')
    },
    {
      icon: Calendar,
      title: t('pricingSuccess.features.predictions.title'),
      description: t('pricingSuccess.features.predictions.desc')
    }
  ];

  const displayedFeatures = isPremiumPlus ? premiumPlusFeatures : premiumFeatures;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }
    }
  };

  const featureCardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.5 + i * 0.1,
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    })
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: [0.4, 0, 0.6, 1] as const
    }
  };

  return (
    <Layout>
      {/* Confetti celebration */}
      <Confetti duration={6000} pieces={150} />
      
      {isPreviewMode && (
        <div className="bg-amber-500 text-white text-center py-2 px-4 text-sm font-medium">
          🔍 Modo Preview - Visualizando: {isPremiumPlus ? "Premium Plus" : "Premium"} | 
          <a href="/pricing/success?preview=true" className="underline ml-2">Premium</a> | 
          <a href="/pricing/success?preview=plus" className="underline ml-2">Premium Plus</a>
        </div>
      )}
      
      <div className="min-h-screen bg-gradient-to-b from-luna-pink/10 via-luna-purple/10 to-background py-16 px-4 overflow-hidden">
        {/* Floating decorative elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, 0],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-10 text-luna-pink/20"
          >
            <Star className="w-16 h-16" fill="currentColor" />
          </motion.div>
          <motion.div
            animate={{
              y: [0, 20, 0],
              rotate: [0, -10, 0],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-40 right-20 text-luna-purple/20"
          >
            <Sparkles className="w-12 h-12" />
          </motion.div>
          <motion.div
            animate={{
              y: [0, -15, 0],
              x: [0, 10, 0],
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-40 left-20 text-luna-blue/20"
          >
            <PartyPopper className="w-14 h-14" />
          </motion.div>
          <motion.div
            animate={{
              y: [0, 15, 0],
              rotate: [0, -15, 0],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-60 right-10 text-luna-orange/20"
          >
            <Heart className="w-10 h-10" fill="currentColor" />
          </motion.div>
        </div>

        <motion.div 
          className="max-w-4xl mx-auto space-y-8 relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Success Header */}
          <motion.div 
            className="text-center space-y-6"
            variants={itemVariants}
          >
            <motion.div 
              className="flex justify-center"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 15,
                delay: 0.2 
              }}
            >
              <div className="relative">
                {/* Animated rings */}
                <motion.div
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-r from-luna-pink via-luna-purple to-luna-blue rounded-full"
                />
                <motion.div
                  animate={{
                    scale: [1, 1.8, 1],
                    opacity: [0.3, 0, 0.3],
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  className="absolute inset-0 bg-gradient-to-r from-luna-blue via-luna-purple to-luna-pink rounded-full"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-luna-pink via-luna-purple to-luna-blue rounded-full blur-2xl opacity-40"></div>
                <motion.div
                  animate={pulseAnimation}
                  className="relative z-10 bg-gradient-to-br from-luna-pink/20 to-luna-purple/20 rounded-full p-4"
                >
                  <CheckCircle2 className="w-20 h-20 md:w-24 md:h-24 text-luna-purple" strokeWidth={1.5} />
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-luna-pink via-luna-purple to-luna-blue bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0%", "100%", "0%"],
                }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{ backgroundSize: "200%" }}
              >
                {t('pricingSuccess.title', { plan: planName })}
              </motion.h1>
            </motion.div>
            
            <motion.p 
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {t('pricingSuccess.subtitle', { plan: planName })}
            </motion.p>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.9, stiffness: 200 }}
            >
              <Badge 
                variant="secondary" 
                className="text-lg px-6 py-3 bg-gradient-to-r from-luna-pink/20 to-luna-purple/20 border-luna-purple/30"
              >
                <motion.div animate={pulseAnimation}>
                  <Sparkles className="w-5 h-5 mr-2 text-luna-purple" />
                </motion.div>
                {t('pricingSuccess.planActive', { plan: planName })}
              </Badge>
            </motion.div>
          </motion.div>

          {/* Premium Features Grid */}
          <motion.div variants={itemVariants}>
            <Card className="border-luna-purple/20 shadow-xl backdrop-blur-sm bg-card/80">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-luna-purple" />
                  {t('pricingSuccess.featuresTitle')}
                </CardTitle>
                <CardDescription>
                  {t('pricingSuccess.featuresSubtitle', { plan: planName })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {displayedFeatures.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <motion.div 
                        key={index}
                        custom={index}
                        variants={featureCardVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover={{ 
                          scale: 1.02, 
                          boxShadow: "0 10px 30px -10px hsl(var(--luna-purple) / 0.3)" 
                        }}
                        className="flex gap-4 p-4 rounded-xl border border-border/50 bg-gradient-to-br from-background to-luna-purple/5 cursor-default"
                      >
                        <div className="flex-shrink-0">
                          <motion.div 
                            className="w-12 h-12 rounded-full bg-gradient-to-br from-luna-pink/30 to-luna-purple/30 flex items-center justify-center"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            <Icon className="w-6 h-6 text-luna-purple" />
                          </motion.div>
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-semibold text-lg">{feature.title}</h3>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Next Steps */}
          <motion.div variants={itemVariants}>
            <Card className="border-luna-blue/20 shadow-xl backdrop-blur-sm bg-card/80">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-luna-blue" />
                  {t('pricingSuccess.nextStepsTitle')}
                </CardTitle>
                <CardDescription>
                  {t('pricingSuccess.nextStepsSubtitle', { plan: planName })}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((step, index) => (
                    <motion.div 
                      key={step}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + index * 0.15 }}
                      className="flex items-start gap-4"
                    >
                      <motion.div 
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-luna-purple/30 to-luna-blue/30 flex items-center justify-center flex-shrink-0"
                        whileHover={{ scale: 1.1, rotate: 10 }}
                      >
                        <span className="text-luna-purple font-bold">{step}</span>
                      </motion.div>
                      <div className="pt-1">
                        <h4 className="font-semibold">{t(`pricingSuccess.step${step}Title`)}</h4>
                        <p className="text-sm text-muted-foreground">
                          {t(`pricingSuccess.step${step}Desc`)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* CTA Button */}
          <motion.div 
            className="text-center space-y-4 pb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                onClick={() => navigate("/dashboard")}
                className="bg-gradient-to-r from-luna-pink via-luna-purple to-luna-blue hover:opacity-90 text-white px-10 py-7 text-xl font-semibold shadow-2xl shadow-luna-purple/30 group relative overflow-hidden"
              >
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                />
                <span className="relative flex items-center gap-2">
                  {t('pricingSuccess.ctaButton')}
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </motion.div>
            
            <motion.p 
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
            >
              {t('pricingSuccess.helpText')}
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default PricingSuccess;
