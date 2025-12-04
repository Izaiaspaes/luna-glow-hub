import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Heart, 
  Brain, 
  Moon, 
  Zap, 
  Shield, 
  ArrowRight,
  CheckCircle2,
  Gift,
  Crown
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useOnboarding } from "@/hooks/useOnboarding";
import { trackSignUp } from "@/lib/analytics";

export default function OnboardingSuccess() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { onboardingData } = useOnboarding();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Track sign_up event
    trackSignUp({ method: 'email' });
    
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const userName = onboardingData?.preferred_name || onboardingData?.full_name?.split(' ')[0] || t('onboardingSuccess.defaultName');

  const benefits = [
    {
      icon: Brain,
      title: t('onboardingSuccess.benefits.ai.title'),
      description: t('onboardingSuccess.benefits.ai.description'),
      color: "from-luna-purple to-luna-pink"
    },
    {
      icon: Moon,
      title: t('onboardingSuccess.benefits.tracking.title'),
      description: t('onboardingSuccess.benefits.tracking.description'),
      color: "from-luna-blue to-luna-purple"
    },
    {
      icon: Zap,
      title: t('onboardingSuccess.benefits.predictions.title'),
      description: t('onboardingSuccess.benefits.predictions.description'),
      color: "from-luna-orange to-luna-pink"
    },
    {
      icon: Shield,
      title: t('onboardingSuccess.benefits.privacy.title'),
      description: t('onboardingSuccess.benefits.privacy.description'),
      color: "from-luna-green to-luna-blue"
    }
  ];

  const premiumFeatures = [
    t('onboardingSuccess.premiumFeatures.unlimitedPlans'),
    t('onboardingSuccess.premiumFeatures.aiJournal'),
    t('onboardingSuccess.premiumFeatures.sosSupport'),
    t('onboardingSuccess.premiumFeatures.advancedPredictions'),
    t('onboardingSuccess.premiumFeatures.prioritySupport')
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-luna-pink-light/30 to-luna-peach/30 relative overflow-hidden">
      {/* Decorative elements - hidden on mobile for performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block">
        <motion.div 
          className="absolute top-20 right-10 md:right-20 w-48 md:w-72 h-48 md:h-72 bg-luna-pink/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-32 left-10 md:left-20 w-64 md:w-96 h-64 md:h-96 bg-luna-purple/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
        />
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-12 relative z-10">
        {/* Success Header */}
        <motion.div
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : -20 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-luna-green to-luna-blue mb-4 sm:mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: showContent ? 1 : 0 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
          >
            <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </motion.div>
          
          <Badge className="bg-gradient-to-r from-luna-pink via-luna-purple to-primary text-white border-0 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium shadow-lg mb-3 sm:mb-4">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
            {t('onboardingSuccess.badge')}
          </Badge>
          
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 px-2">
            {t('onboardingSuccess.welcome')} <span className="gradient-text">{userName}</span>! 🎉
          </h1>
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            {t('onboardingSuccess.subtitle')}
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8 sm:mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: showContent ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 30 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
            >
              <Card className="h-full border-2 border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-3 sm:p-6 text-center">
                  <div className={`inline-flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${benefit.color} mb-2 sm:mb-4`}>
                    <benefit.icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-sm sm:text-lg mb-1 sm:mb-2">{benefit.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-none">{benefit.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Premium Upgrade Card */}
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 30 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="border-2 border-primary/30 bg-gradient-to-br from-card via-card to-primary/5 shadow-2xl overflow-hidden">
            <CardContent className="p-5 sm:p-8 md:p-10">
              <div className="flex flex-col md:flex-row items-center gap-5 sm:gap-8">
                {/* Left side - Icon and badge */}
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <motion.div
                      className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-luna-orange via-luna-pink to-luna-purple flex items-center justify-center"
                      animate={{ 
                        boxShadow: [
                          "0 0 20px rgba(236, 72, 153, 0.3)",
                          "0 0 40px rgba(236, 72, 153, 0.5)",
                          "0 0 20px rgba(236, 72, 153, 0.3)"
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Crown className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
                    </motion.div>
                    <motion.div
                      className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-luna-orange text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full whitespace-nowrap"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Gift className="w-2.5 h-2.5 sm:w-3 sm:h-3 inline mr-0.5 sm:mr-1" />
                      {t('onboardingSuccess.specialBadge')}
                    </motion.div>
                  </div>
                </div>

                {/* Right side - Content */}
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3">
                    {t('onboardingSuccess.unlockTitle')} <span className="gradient-text">Luna</span>
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                    {t('onboardingSuccess.unlockDescription')}
                  </p>

                  {/* Features list */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-5 sm:mb-8">
                    {premiumFeatures.map((feature, index) => (
                      <motion.div
                        key={feature}
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: showContent ? 1 : 0, x: showContent ? 0 : -10 }}
                        transition={{ duration: 0.3, delay: 1 + index * 0.1 }}
                      >
                        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-luna-green/20 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-luna-green" />
                        </div>
                        <span className="text-xs sm:text-sm text-left">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Button 
                      size="lg" 
                      variant="cta"
                      className="group flex-1 text-sm sm:text-base"
                      onClick={() => navigate('/pricing')}
                    >
                      {t('onboardingSuccess.viewPlans')}
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="flex-1 text-sm sm:text-base"
                      onClick={() => navigate('/dashboard')}
                    >
                      <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      {t('onboardingSuccess.exploreFree')}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trust indicators */}
          <motion.div 
            className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-6 mt-6 sm:mt-8 text-xs sm:text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: showContent ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <div className="flex items-center justify-center gap-2">
              <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-luna-green" />
              <span>{t('onboardingSuccess.trust.securePayment')}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Gift className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-luna-orange" />
              <span>{t('onboardingSuccess.trust.guarantee')}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-luna-purple" />
              <span>{t('onboardingSuccess.trust.cancelAnytime')}</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
