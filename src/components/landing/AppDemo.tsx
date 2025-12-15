import { motion } from "framer-motion";
import { 
  Moon, 
  Heart, 
  Brain, 
  Sparkles, 
  Calendar, 
  TrendingUp,
  Shield,
  Bell
} from "lucide-react";
import { useTranslation } from "react-i18next";

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

export const AppDemo = () => {
  const { t } = useTranslation();

  return (
    <section className="py-16 md:py-24 overflow-hidden bg-gradient-to-b from-background via-muted/30 to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            {t('appDemo.badge', 'Experiência Completa')}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {t('appDemo.title', 'Tudo que você precisa em um só lugar')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('appDemo.subtitle', 'Funcionalidades inteligentes que se adaptam ao seu ciclo e rotina')}
          </p>
        </motion.div>

        {/* Phone Mockup with Features */}
        <div className="relative max-w-5xl mx-auto">
          {/* Floating Feature Icons - Left Side */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-6 -translate-x-8">
            {features.slice(0, 4).map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: feature.delay }}
                whileHover={{ scale: 1.1, x: 10 }}
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg cursor-pointer`}
              >
                <feature.icon className="h-7 w-7 text-white" />
              </motion.div>
            ))}
          </div>

          {/* Floating Feature Icons - Right Side */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-6 translate-x-8">
            {features.slice(4, 8).map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: feature.delay }}
                whileHover={{ scale: 1.1, x: -10 }}
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg cursor-pointer`}
              >
                <feature.icon className="h-7 w-7 text-white" />
              </motion.div>
            ))}
          </div>

          {/* Center Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative mx-auto w-[280px] md:w-[320px]"
          >
            {/* Phone Frame */}
            <div className="relative bg-gradient-to-b from-foreground/90 to-foreground rounded-[3rem] p-3 shadow-2xl">
              {/* Screen */}
              <div className="relative bg-background rounded-[2.5rem] overflow-hidden aspect-[9/19]">
                {/* Status Bar */}
                <div className="absolute top-0 left-0 right-0 h-8 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                  <div className="w-24 h-6 bg-foreground rounded-full" />
                </div>
                
                {/* App Content Animation */}
                <div className="absolute inset-0 pt-10 px-4 pb-4">
                  {/* Header */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="mb-4"
                  >
                    <div className="h-3 w-20 bg-muted rounded-full mb-2" />
                    <div className="h-5 w-32 bg-primary/20 rounded-full" />
                  </motion.div>

                  {/* Stats Cards */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="grid grid-cols-2 gap-2 mb-4"
                  >
                    <div className="bg-gradient-to-br from-luna-pink/20 to-luna-purple/20 rounded-xl p-3">
                      <Moon className="h-5 w-5 text-luna-purple mb-1" />
                      <div className="h-2 w-10 bg-muted rounded-full" />
                    </div>
                    <div className="bg-gradient-to-br from-luna-blue/20 to-luna-green/20 rounded-xl p-3">
                      <Heart className="h-5 w-5 text-luna-pink mb-1" />
                      <div className="h-2 w-12 bg-muted rounded-full" />
                    </div>
                  </motion.div>

                  {/* Calendar Preview */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 }}
                    className="bg-muted/50 rounded-xl p-3 mb-4"
                  >
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: 7 }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.8 + i * 0.05 }}
                          className={`h-6 w-6 rounded-full ${
                            i === 3 
                              ? "bg-gradient-to-br from-luna-pink to-luna-purple" 
                              : "bg-muted"
                          }`}
                        />
                      ))}
                    </div>
                  </motion.div>

                  {/* AI Recommendation */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.9 }}
                    className="bg-gradient-to-br from-primary/10 to-luna-purple/10 rounded-xl p-3 border border-primary/20"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <div className="h-2 w-16 bg-primary/30 rounded-full" />
                    </div>
                    <div className="space-y-1">
                      <div className="h-2 w-full bg-muted rounded-full" />
                      <div className="h-2 w-3/4 bg-muted rounded-full" />
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-luna-orange to-luna-pink rounded-2xl shadow-lg flex items-center justify-center"
            >
              <Sparkles className="h-8 w-8 text-white" />
            </motion.div>

            <motion.div
              animate={{ 
                y: [0, 10, 0],
                rotate: [0, -5, 0]
              }}
              transition={{ 
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-luna-blue to-luna-purple rounded-xl shadow-lg flex items-center justify-center"
            >
              <Heart className="h-6 w-6 text-white" />
            </motion.div>
          </motion.div>

          {/* Mobile Feature Grid */}
          <div className="grid grid-cols-4 gap-4 mt-8 lg:hidden">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-md`}
              >
                <feature.icon className="h-6 w-6 text-white" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Feature List */}
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
              color: "luna-purple"
            },
            {
              title: t('appDemo.feature2.title', 'IA Personalizada'),
              description: t('appDemo.feature2.description', 'Recomendações adaptadas ao seu corpo e rotina com inteligência artificial'),
              icon: Brain,
              color: "luna-pink"
            },
            {
              title: t('appDemo.feature3.title', 'Privacidade Total'),
              description: t('appDemo.feature3.description', 'Seus dados protegidos com criptografia de ponta a ponta'),
              icon: Shield,
              color: "luna-blue"
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div className={`w-12 h-12 rounded-xl bg-${item.color}/10 flex items-center justify-center mb-4`}>
                <item.icon className={`h-6 w-6 text-${item.color}`} />
              </div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
