import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Shield, Heart } from "lucide-react";
import heroImage from "@/assets/hero-woman-phone.jpg";
import { motion } from "framer-motion";
import { trackCTAClick, trackStartOnboarding, trackViewFeatures } from "@/lib/analytics";

export const Hero = () => {
  const handleStartClick = () => {
    trackCTAClick({
      ctaLocation: 'hero',
      ctaText: 'Comece Grátis Agora',
      destination: '/onboarding'
    });
    trackStartOnboarding({ source: 'hero' });
    window.location.href = '/onboarding';
  };

  const handlePremiumClick = () => {
    trackCTAClick({
      ctaLocation: 'hero',
      ctaText: 'Ver Pacotes Premium',
      destination: '/onboarding'
    });
    trackViewFeatures({ source: 'hero_premium' });
    window.location.href = '/onboarding';
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-luna-pink-light to-luna-peach">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-20 right-20 w-72 h-72 bg-luna-pink/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-32 left-20 w-96 h-96 bg-luna-purple/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.7
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        {/* Video Section */}
        <motion.div
          className="max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-primary/20">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/yIGeeyj3NYo?autoplay=1&mute=1"
              title="Luna - Apresentação"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left Content */}
          <motion.div 
            className="space-y-8 text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Badge className="bg-gradient-to-r from-luna-pink via-luna-purple to-primary text-white border-0 px-4 py-2 text-sm font-medium shadow-lg">
                <Sparkles className="w-4 h-4 mr-2" />
                Oferta Especial - Economize no Pacote Anual
              </Badge>
            </motion.div>

            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Seu ciclo, sua{" "}
                <span className="gradient-text">força</span>
              </h1>
              <p className="text-xl md:text-2xl text-foreground/80 max-w-2xl mx-auto lg:mx-0">
                Entenda seu corpo, antecipe suas fases e receba planos personalizados por IA para cada momento do seu ciclo
              </p>
            </motion.div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Button 
                size="xl" 
                variant="cta" 
                className="group"
                onClick={handleStartClick}
              >
                Comece Grátis Agora
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="xl" 
                variant="ctaOutline"
                onClick={handlePremiumClick}
              >
                Ver Pacotes Premium
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div 
              className="flex flex-wrap gap-8 justify-center lg:justify-start pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div className="flex items-center gap-2 text-sm">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">100% Privado</div>
                  <div className="text-muted-foreground text-xs">Seus dados seguros</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">500+ Mulheres</div>
                  <div className="text-muted-foreground text-xs">Já transformaram</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          >
            <motion.div 
              className="relative rounded-3xl overflow-hidden shadow-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img 
                src={heroImage} 
                alt="Mulher feliz usando o Luna Glow" 
                className="w-full h-auto object-cover"
              />
            </motion.div>
            {/* Floating card */}
            <motion.div 
              className="absolute -bottom-6 -left-6 bg-card/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-border max-w-xs"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1, duration: 0.6, type: "spring", stiffness: 100 }}
            >
              <div className="text-sm text-muted-foreground mb-1">Última análise</div>
              <div className="text-lg font-semibold mb-2">Seu sono melhorou 23%</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full w-[75%] gradient-bg rounded-full" />
                </div>
                <span className="text-xs font-medium text-primary">75%</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
