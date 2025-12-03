import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Gratuito",
    price: "R$ 0",
    period: "para sempre",
    description: "Perfeito para começar sua jornada",
    features: [
      "Rastreamento básico do ciclo",
      "Calendário menstrual",
      "Previsões de fase",
      "Acesso limitado ao Luna Sense",
    ],
    cta: "Começar Grátis",
    variant: "ctaOutline" as const,
    popular: false
  },
  {
    name: "Premium Mensal",
    price: "R$ 19,90",
    period: "/mês",
    description: "Todas as funcionalidades desbloqueadas",
    features: [
      "Tudo do pacote Gratuito",
      "Luna Sense 24/7 ilimitado",
      "Diário com análise IA completa",
      "SOS Feminino prioritário",
      "Análises de beleza",
      "Insights de saúde avançados",
    ],
    cta: "Assinar Agora",
    variant: "cta" as const,
    popular: true
  },
  {
    name: "Premium Plus Anual",
    price: "R$ 299,00",
    originalPrice: "R$ 358,80",
    period: "/ano",
    badge: "Melhor Valor",
    description: "Transformação completa garantida",
    features: [
      "Tudo do Premium Mensal",
      "Closet Virtual inteligente",
      "Planos personalizados por fase",
      "Comunidade exclusiva VIP",
      "Conteúdo premium mensal",
      "Suporte prioritário 24/7",
      "Acesso vitalício a novos recursos",
    ],
    cta: "Garantir Melhor Valor",
    variant: "cta" as const,
    popular: false,
    highlight: true
  }
];

export const Pricing = () => {
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
            Escolha o pacote de assinatura perfeito para você
          </h2>
          <p className="text-xl text-muted-foreground">
            Comece grátis e faça upgrade quando estiver pronta para transformar seu bem-estar
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
                    ? 'border-4 border-primary shadow-2xl scale-105 bg-gradient-to-br from-white to-luna-pink-light' 
                    : 'border-2 hover:border-primary/30 hover:shadow-xl'
                }`}
              >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white">
                  Mais Popular
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
                onClick={() => window.location.href = 'https://lunaglow.com.br/pricing'}
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
          Todos os pacotes incluem 7 dias de garantia de satisfação • Cancele quando quiser
        </motion.div>
      </div>
    </section>
  );
};
