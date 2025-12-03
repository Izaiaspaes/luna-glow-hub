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

const benefits = [
  {
    icon: Brain,
    title: "IA Personalizada",
    description: "Planos de bem-estar criados especialmente para você",
    color: "from-luna-purple to-luna-pink"
  },
  {
    icon: Moon,
    title: "Rastreamento Completo",
    description: "Ciclo, sono, humor e energia em um só lugar",
    color: "from-luna-blue to-luna-purple"
  },
  {
    icon: Zap,
    title: "Previsões Inteligentes",
    description: "Antecipe seus sintomas e prepare-se melhor",
    color: "from-luna-orange to-luna-pink"
  },
  {
    icon: Shield,
    title: "100% Privado",
    description: "Seus dados protegidos com criptografia",
    color: "from-luna-green to-luna-blue"
  }
];

const premiumFeatures = [
  "Planos de bem-estar ilimitados",
  "Diário da Mulher com IA",
  "SOS Feminino para momentos difíceis",
  "Previsões de sintomas avançadas",
  "Suporte prioritário"
];

export default function OnboardingSuccess() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { onboardingData } = useOnboarding();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Small delay for animation effect
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const userName = onboardingData?.preferred_name || onboardingData?.full_name?.split(' ')[0] || "você";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-luna-pink-light/30 to-luna-peach/30 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-20 right-20 w-72 h-72 bg-luna-pink/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-32 left-20 w-96 h-96 bg-luna-purple/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
        />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Success Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : -20 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-luna-green to-luna-blue mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: showContent ? 1 : 0 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
          >
            <CheckCircle2 className="w-10 h-10 text-white" />
          </motion.div>
          
          <Badge className="bg-gradient-to-r from-luna-pink via-luna-purple to-primary text-white border-0 px-4 py-2 text-sm font-medium shadow-lg mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            Cadastro Concluído!
          </Badge>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Bem-vinda, <span className="gradient-text">{userName}</span>! 🎉
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Seu perfil foi criado com sucesso. Agora você tem acesso a recursos incríveis para transformar seu bem-estar.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
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
                <CardContent className="p-6 text-center">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${benefit.color} mb-4`}>
                    <benefit.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
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
            <CardContent className="p-8 md:p-10">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Left side - Icon and badge */}
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <motion.div
                      className="w-24 h-24 rounded-full bg-gradient-to-br from-luna-orange via-luna-pink to-luna-purple flex items-center justify-center"
                      animate={{ 
                        boxShadow: [
                          "0 0 20px rgba(236, 72, 153, 0.3)",
                          "0 0 40px rgba(236, 72, 153, 0.5)",
                          "0 0 20px rgba(236, 72, 153, 0.3)"
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Crown className="w-12 h-12 text-white" />
                    </motion.div>
                    <motion.div
                      className="absolute -top-2 -right-2 bg-luna-orange text-white text-xs font-bold px-2 py-1 rounded-full"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Gift className="w-3 h-3 inline mr-1" />
                      ESPECIAL
                    </motion.div>
                  </div>
                </div>

                {/* Right side - Content */}
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl font-bold mb-3">
                    Desbloqueie todo o potencial do <span className="gradient-text">Luna</span>
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Escolha o plano ideal para você e comece sua jornada de transformação com recursos exclusivos.
                  </p>

                  {/* Features list */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                    {premiumFeatures.map((feature, index) => (
                      <motion.div
                        key={feature}
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: showContent ? 1 : 0, x: showContent ? 0 : -10 }}
                        transition={{ duration: 0.3, delay: 1 + index * 0.1 }}
                      >
                        <div className="w-5 h-5 rounded-full bg-luna-green/20 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-3 h-3 text-luna-green" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      size="xl" 
                      variant="cta"
                      className="group flex-1"
                      onClick={() => navigate('/pricing')}
                    >
                      Ver Planos e Assinar
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button 
                      size="xl" 
                      variant="outline"
                      className="flex-1"
                      onClick={() => navigate('/dashboard')}
                    >
                      <Heart className="w-5 h-5 mr-2" />
                      Explorar Grátis
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trust indicators */}
          <motion.div 
            className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: showContent ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-luna-green" />
              <span>Pagamento 100% seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-luna-orange" />
              <span>7 dias de garantia</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-luna-purple" />
              <span>Cancele quando quiser</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
