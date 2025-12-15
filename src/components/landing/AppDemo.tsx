import { motion, useScroll, useTransform } from "framer-motion";
import { 
  Moon, 
  Heart, 
  Brain, 
  Sparkles, 
  Calendar, 
  TrendingUp,
  Shield,
  Bell,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRef, useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";

// Import real app screenshots
import appScreenDashboard from "@/assets/app-screen-dashboard.jpg";
import appScreenWellness from "@/assets/app-screen-wellness.jpg";
import appScreenJournal from "@/assets/app-screen-journal.jpg";
import appScreenBeauty from "@/assets/app-screen-beauty.jpg";
import appScreenSOS from "@/assets/app-screen-sos.jpg";

const features = [
  {
    icon: Calendar,
    color: "from-luna-pink to-luna-purple",
    delay: 0
  },
  {
    icon: Moon,
    color: "from-luna-purple to-luna-blue",
    delay: 0.1
  },
  {
    icon: Heart,
    color: "from-luna-orange to-luna-pink",
    delay: 0.2
  },
  {
    icon: Brain,
    color: "from-luna-blue to-luna-green",
    delay: 0.3
  },
  {
    icon: TrendingUp,
    color: "from-luna-green to-luna-blue",
    delay: 0.4
  },
  {
    icon: Sparkles,
    color: "from-luna-pink to-luna-orange",
    delay: 0.5
  },
  {
    icon: Shield,
    color: "from-luna-purple to-luna-pink",
    delay: 0.6
  },
  {
    icon: Bell,
    color: "from-luna-orange to-luna-green",
    delay: 0.7
  }
];

const screens = [
  {
    image: appScreenDashboard,
    titleKey: "appDemo.screens.dashboard.title",
    descKey: "appDemo.screens.dashboard.description",
    defaultTitle: "Dashboard Personalizado",
    defaultDesc: "Visualize ciclo, sono, humor e energia em tempo real"
  },
  {
    image: appScreenWellness,
    titleKey: "appDemo.screens.wellness.title",
    descKey: "appDemo.screens.wellness.description",
    defaultTitle: "Planos de Bem-Estar",
    defaultDesc: "Recomendações personalizadas geradas por IA"
  },
  {
    image: appScreenJournal,
    titleKey: "appDemo.screens.journal.title",
    descKey: "appDemo.screens.journal.description",
    defaultTitle: "Diário & Luna Sense",
    defaultDesc: "Escreva sobre seu dia e converse com IA"
  },
  {
    image: appScreenBeauty,
    titleKey: "appDemo.screens.beauty.title",
    descKey: "appDemo.screens.beauty.description",
    defaultTitle: "Beleza & Closet Virtual",
    defaultDesc: "Análise de beleza com IA e sugestões de looks"
  },
  {
    image: appScreenSOS,
    titleKey: "appDemo.screens.sos.title",
    descKey: "appDemo.screens.sos.description",
    defaultTitle: "SOS Feminino",
    defaultDesc: "Suporte imediato quando você mais precisa"
  }
];

export const AppDemo = () => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeScreen, setActiveScreen] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  // Touch/swipe gesture state
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  // Auto-play carousel every 4 seconds
  const nextScreen = useCallback(() => {
    setActiveScreen((prev) => (prev + 1) % screens.length);
  }, []);

  const prevScreen = useCallback(() => {
    setActiveScreen((prev) => (prev - 1 + screens.length) % screens.length);
  }, []);

  // Handle touch events for swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsPaused(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setIsPaused(false);
      return;
    }
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      nextScreen();
    } else if (isRightSwipe) {
      prevScreen();
    }
    
    // Resume auto-play after 5 seconds
    setTimeout(() => setIsPaused(false), 5000);
  };

  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      nextScreen();
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, nextScreen]);

  // Parallax scroll effects
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Transform values for parallax elements
  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const y3 = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 15]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -15]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);

  return (
    <section 
      ref={containerRef}
      className="py-16 md:py-24 overflow-hidden bg-gradient-to-b from-background via-muted/30 to-background relative"
    >
      {/* Floating Parallax Background Elements */}
      <motion.div
        style={{ y: y1, rotate: rotate1, opacity }}
        className="absolute top-20 left-[5%] w-32 h-32 rounded-full bg-gradient-to-br from-luna-pink/20 to-luna-purple/10 blur-2xl"
      />
      <motion.div
        style={{ y: y2, rotate: rotate2, opacity }}
        className="absolute top-40 right-[10%] w-48 h-48 rounded-full bg-gradient-to-br from-luna-blue/20 to-luna-green/10 blur-3xl"
      />
      <motion.div
        style={{ y: y3, opacity }}
        className="absolute bottom-32 left-[15%] w-40 h-40 rounded-full bg-gradient-to-br from-luna-orange/15 to-luna-pink/10 blur-2xl"
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header with Parallax */}
        <motion.div
          style={{ scale }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
          >
            <Sparkles className="h-4 w-4" />
            {t('appDemo.badge', 'Experiência Completa')}
          </motion.span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {t('appDemo.title', 'Tudo que você precisa em um só lugar')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('appDemo.subtitle', 'Funcionalidades inteligentes que se adaptam ao seu ciclo e rotina')}
          </p>
        </motion.div>

        {/* Phone Mockup with Real Screenshots */}
        <div className="relative max-w-5xl mx-auto">
          {/* Floating Feature Icons - Left Side with Parallax */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-6 -translate-x-8">
            {features.slice(0, 4).map((feature, index) => (
              <motion.div
                key={index}
                style={{ y: index % 2 === 0 ? y1 : y2 }}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: feature.delay }}
                whileHover={{ scale: 1.15, x: 10, rotate: 5 }}
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg cursor-pointer backdrop-blur-sm`}
              >
                <feature.icon className="h-7 w-7 text-white" />
              </motion.div>
            ))}
          </div>

          {/* Floating Feature Icons - Right Side with Parallax */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-6 translate-x-8">
            {features.slice(4, 8).map((feature, index) => (
              <motion.div
                key={index}
                style={{ y: index % 2 === 0 ? y2 : y3 }}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: feature.delay }}
                whileHover={{ scale: 1.15, x: -10, rotate: -5 }}
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg cursor-pointer backdrop-blur-sm`}
              >
                <feature.icon className="h-7 w-7 text-white" />
              </motion.div>
            ))}
          </div>

          {/* Center Phone Mockup with Real Screenshots */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative mx-auto w-[260px] sm:w-[280px] md:w-[320px] touch-none"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Swipe hint for mobile - shows briefly on first load */}
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 3 }}
              className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none md:hidden"
            >
              <div className="bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm flex items-center gap-2">
                <ChevronLeft className="h-4 w-4 animate-pulse" />
                <span>{t('appDemo.swipeHint', 'Deslize para ver mais')}</span>
                <ChevronRight className="h-4 w-4 animate-pulse" />
              </div>
            </motion.div>

            {/* Phone Frame */}
            <div className="relative bg-gradient-to-b from-foreground/90 to-foreground rounded-[2.5rem] sm:rounded-[3rem] p-1.5 sm:p-2 shadow-2xl">
              {/* Screen - adjusted aspect ratio for real mobile screenshots */}
              <div className="relative bg-background rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden aspect-[9/19] select-none">
                {/* Real App Screenshot with Carousel */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeScreen}
                    initial={{ opacity: 0, x: touchEnd && touchStart && touchEnd < touchStart ? 30 : -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: touchEnd && touchStart && touchEnd < touchStart ? -30 : 30 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="absolute inset-0"
                  >
                    <img 
                      src={screens[activeScreen].image}
                      alt={t(screens[activeScreen].titleKey, screens[activeScreen].defaultTitle)}
                      className="w-full h-full object-cover object-top pointer-events-none"
                      draggable={false}
                      loading="lazy"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Screen Indicator Dots */}
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
                  {screens.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setActiveScreen(index);
                        setIsPaused(true);
                        setTimeout(() => setIsPaused(false), 5000);
                      }}
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        index === activeScreen 
                          ? "bg-primary w-4" 
                          : "bg-white/60 w-1.5 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>

                {/* Progress bar for auto-play */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-black/10 z-10">
                  <motion.div
                    key={`progress-${activeScreen}`}
                    initial={{ width: "0%" }}
                    animate={{ width: isPaused ? "0%" : "100%" }}
                    transition={{ duration: 4, ease: "linear" }}
                    className="h-full bg-primary/60"
                  />
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevScreen}
              className="absolute left-[-60px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card border border-border shadow-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors hidden md:flex"
            >
              <ChevronLeft className="h-5 w-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextScreen}
              className="absolute right-[-60px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card border border-border shadow-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors hidden md:flex"
            >
              <ChevronRight className="h-5 w-5" />
            </motion.button>

            {/* Decorative Elements with Enhanced Parallax */}
            <motion.div
              style={{ y: y1, rotate: rotate1 }}
              animate={{ 
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-luna-orange to-luna-pink rounded-2xl shadow-lg flex items-center justify-center"
            >
              <Sparkles className="h-8 w-8 text-white" />
            </motion.div>

            <motion.div
              style={{ y: y2, rotate: rotate2 }}
              animate={{ 
                scale: [1, 1.15, 1],
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
              className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-luna-blue to-luna-purple rounded-xl shadow-lg flex items-center justify-center"
            >
              <Heart className="h-6 w-6 text-white" />
            </motion.div>

            {/* New floating element with parallax */}
            <motion.div
              style={{ y: y3 }}
              animate={{ 
                x: [0, 5, 0],
                rotate: [0, -10, 0],
              }}
              transition={{ 
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-1/3 -right-10 w-10 h-10 bg-gradient-to-br from-luna-green to-luna-blue rounded-lg shadow-lg flex items-center justify-center"
            >
              <Brain className="h-5 w-5 text-white" />
            </motion.div>
          </motion.div>

          {/* Screen Description */}
          <motion.div
            key={`desc-${activeScreen}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center mt-6"
          >
            <h3 className="text-lg font-semibold mb-1">
              {t(screens[activeScreen].titleKey, screens[activeScreen].defaultTitle)}
            </h3>
            <p className="text-muted-foreground text-sm">
              {t(screens[activeScreen].descKey, screens[activeScreen].defaultDesc)}
            </p>
          </motion.div>

          {/* Mobile Feature Grid with Staggered Animation */}
          <div className="grid grid-cols-4 gap-4 mt-8 lg:hidden">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.08,
                  type: "spring",
                  stiffness: 200
                }}
                whileTap={{ scale: 0.9 }}
                className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-md`}
              >
                <feature.icon className="h-6 w-6 text-white" />
              </motion.div>
            ))}
          </div>

          {/* Mobile Navigation - Larger touch targets */}
          <div className="flex justify-center gap-6 mt-4 md:hidden">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                prevScreen();
                setIsPaused(true);
                setTimeout(() => setIsPaused(false), 5000);
              }}
              className="w-12 h-12 rounded-full bg-card border border-border shadow-lg flex items-center justify-center text-muted-foreground active:bg-muted"
            >
              <ChevronLeft className="h-6 w-6" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                nextScreen();
                setIsPaused(true);
                setTimeout(() => setIsPaused(false), 5000);
              }}
              className="w-12 h-12 rounded-full bg-card border border-border shadow-lg flex items-center justify-center text-muted-foreground active:bg-muted"
            >
              <ChevronRight className="h-6 w-6" />
            </motion.button>
          </div>
        </div>

        {/* Feature List with Parallax Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid md:grid-cols-3 gap-6 mt-16"
        >
          {[
            {
              title: t('appDemo.feature1.title', 'Rastreamento Inteligente'),
              description: t('appDemo.feature1.description', 'Acompanhe seu ciclo, sono, humor e energia com insights personalizados'),
              icon: Calendar,
              color: "luna-purple",
              gradient: "from-luna-purple/20 to-luna-pink/10"
            },
            {
              title: t('appDemo.feature2.title', 'IA Personalizada'),
              description: t('appDemo.feature2.description', 'Recomendações adaptadas ao seu corpo e rotina com inteligência artificial'),
              icon: Brain,
              color: "luna-pink",
              gradient: "from-luna-pink/20 to-luna-orange/10"
            },
            {
              title: t('appDemo.feature3.title', 'Privacidade Total'),
              description: t('appDemo.feature3.description', 'Seus dados protegidos com criptografia de ponta a ponta'),
              icon: Shield,
              color: "luna-blue",
              gradient: "from-luna-blue/20 to-luna-green/10"
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ 
                y: -8, 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              className={`bg-gradient-to-br ${item.gradient} border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all backdrop-blur-sm`}
            >
              <motion.div 
                whileHover={{ rotate: 10, scale: 1.1 }}
                className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${item.color} to-${item.color}/60 flex items-center justify-center mb-4`}
              >
                <item.icon className="h-6 w-6 text-white" />
              </motion.div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
