import { useEffect, useMemo, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  ArrowRight
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { trackPurchase } from "@/lib/analytics";

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

  return (
    <Layout>
      {isPreviewMode && (
        <div className="bg-amber-500 text-white text-center py-2 px-4 text-sm font-medium">
          🔍 Modo Preview - Visualizando: {isPremiumPlus ? "Premium Plus" : "Premium"} | 
          <a href="/pricing/success?preview=true" className="underline ml-2">Premium</a> | 
          <a href="/pricing/success?preview=plus" className="underline ml-2">Premium Plus</a>
        </div>
      )}
      <div className="min-h-screen bg-gradient-to-b from-luna-pink/10 via-luna-purple/10 to-background py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Success Header */}
          <div className="text-center space-y-4 animate-fade-in">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-luna-pink via-luna-purple to-luna-blue rounded-full blur-2xl opacity-30 animate-pulse"></div>
                <CheckCircle2 className="w-24 h-24 text-luna-purple relative z-10" strokeWidth={1.5} />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-luna-pink via-luna-purple to-luna-blue bg-clip-text text-transparent">
              {t('pricingSuccess.title', { plan: planName })}
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('pricingSuccess.subtitle', { plan: planName })}
            </p>

            <Badge variant="secondary" className="text-lg px-6 py-2">
              <Sparkles className="w-5 h-5 mr-2" />
              {t('pricingSuccess.planActive', { plan: planName })}
            </Badge>
          </div>

          {/* Premium Features Grid */}
          <Card className="border-luna-purple/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">
                {t('pricingSuccess.featuresTitle')}
              </CardTitle>
              <CardDescription>
                {t('pricingSuccess.featuresSubtitle', { plan: planName })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {displayedFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div 
                      key={index}
                      className="flex gap-4 p-4 rounded-lg border border-border/50 hover:border-luna-purple/30 transition-all hover:shadow-md"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-luna-pink/20 to-luna-purple/20 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-luna-purple" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold text-lg">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="border-luna-blue/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">
                {t('pricingSuccess.nextStepsTitle')}
              </CardTitle>
              <CardDescription>
                {t('pricingSuccess.nextStepsSubtitle', { plan: planName })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-luna-purple/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-luna-purple font-semibold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">{t('pricingSuccess.step1Title')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t('pricingSuccess.step1Desc')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-luna-purple/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-luna-purple font-semibold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">{t('pricingSuccess.step2Title')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t('pricingSuccess.step2Desc')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-luna-purple/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-luna-purple font-semibold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">{t('pricingSuccess.step3Title')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t('pricingSuccess.step3Desc')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-luna-purple/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-luna-purple font-semibold">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">{t('pricingSuccess.step4Title')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t('pricingSuccess.step4Desc')}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Button */}
          <div className="text-center space-y-4">
            <Button
              size="lg"
              onClick={() => navigate("/dashboard")}
              className="bg-gradient-to-r from-luna-pink via-luna-purple to-luna-blue hover:opacity-90 text-white px-8 py-6 text-lg group"
            >
              {t('pricingSuccess.ctaButton')}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <p className="text-sm text-muted-foreground">
              {t('pricingSuccess.helpText')}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PricingSuccess;
