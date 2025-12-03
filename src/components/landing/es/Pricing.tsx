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
      name: "Gratuito",
      price: formatPrice(0, currency),
      period: "para siempre",
      description: "Perfecto para comenzar tu viaje",
      features: [
        "Seguimiento básico del ciclo",
        "Calendario menstrual",
        "Predicciones de fase",
        "Acceso limitado a Luna Sense",
      ],
      cta: "Comenzar Gratis",
      variant: "ctaOutline" as const,
      popular: false
    },
    {
      name: "Premium Mensual",
      price: formatPrice(prices.premium.monthly, currency),
      period: "/mes",
      description: "Todas las funcionalidades desbloqueadas",
      features: [
        "Todo del paquete Gratuito",
        "Luna Sense 24/7 ilimitado",
        "Diario con análisis IA completo",
        "SOS Femenino prioritario",
        "Análisis de belleza",
        "Insights de salud avanzados",
      ],
      cta: "Suscribir Ahora",
      variant: "cta" as const,
      popular: true
    },
    {
      name: "Premium Plus Anual",
      price: formatPrice(prices.premiumPlus.yearly, currency),
      originalPrice: formatPrice(prices.premiumPlus.monthly * 12, currency),
      period: "/año",
      badge: "Mejor Valor",
      description: "Transformación completa garantizada",
      features: [
        "Todo del Premium Mensual",
        "Closet Virtual inteligente",
        "Planes personalizados por fase",
        "Comunidad exclusiva VIP",
        "Contenido premium mensual",
        "Soporte prioritario 24/7",
        "Acceso vitalicio a nuevas funciones",
      ],
      cta: "Obtener Mejor Valor",
      variant: "cta" as const,
      popular: false,
      highlight: true
    }
  ];

  if (isLoading) {
    return (
      <section className="py-24 bg-gradient-to-b from-background to-luna-pink-light/30">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">Cargando precios...</div>
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
            Oferta Limitada
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Elige el plan de suscripción perfecto para ti
          </h2>
          <p className="text-xl text-muted-foreground">
            Comienza gratis y actualiza cuando estés lista para transformar tu bienestar
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
              <Card 
                className={`relative p-8 space-y-6 transition-all duration-300 h-full ${
                  plan.highlight 
                    ? 'border-4 border-primary shadow-2xl scale-105 bg-gradient-to-br from-card to-luna-pink-light' 
                    : 'border-2 hover:border-primary/30 hover:shadow-xl'
                }`}
              >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                  Más Popular
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
                    De {plan.originalPrice}
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
          Todos los planes incluyen garantía de satisfacción de 7 días • Cancela cuando quieras
        </motion.div>
      </div>
    </section>
  );
};
