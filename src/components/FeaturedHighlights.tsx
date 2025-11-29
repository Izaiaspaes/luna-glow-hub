import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { Sparkles, Heart, Brain, Calendar, MessageCircle, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";
import featureHealth from "@/assets/feature-health.jpg";
import featureCommunity from "@/assets/feature-community.jpg";
import featureShop from "@/assets/feature-shop.jpg";

export const FeaturedHighlights = () => {
  const { t } = useTranslation();

  const highlights = [
    {
      icon: Brain,
      title: "Luna Sense - Assistente Inteligente",
      description: "Sua companheira de bem-estar que entende você. Converse livremente sobre ciclo, sintomas, alimentação e emoções com respostas empáticas e personalizadas.",
      image: featureHealth,
      color: "luna-purple",
      features: ["Conversas naturais 24/7", "Adapta-se ao seu ciclo", "Suporte emocional"],
      gradient: "from-luna-purple/20 to-transparent"
    },
    {
      icon: Heart,
      title: "Diário da Mulher com IA",
      description: "Escreva livremente sobre seu dia e receba insights poderosos. A IA identifica padrões, correlaciona humor com ciclo e oferece sugestões práticas.",
      image: featureCommunity,
      color: "luna-pink",
      features: ["Análise automática", "Padrões recorrentes", "Histórico completo"],
      gradient: "from-luna-pink/20 to-transparent"
    },
    {
      icon: Sparkles,
      title: "Rastreamento Inteligente",
      description: "Monitore ciclo, sono, humor e energia com análises por voz. A IA gera planos personalizados de nutrição, exercícios e autocuidado.",
      image: featureShop,
      color: "luna-blue",
      features: ["Transcrição por voz", "Planos personalizados", "Insights diários"],
      gradient: "from-luna-blue/20 to-transparent"
    }
  ];

  const miniFeatures = [
    {
      icon: MessageCircle,
      title: "SOS Feminino",
      description: "Suporte imediato para momentos difíceis com técnicas de relaxamento e acolhimento.",
      color: "luna-orange"
    },
    {
      icon: Calendar,
      title: "Luna a Dois",
      description: "Compartilhe seu ciclo com seu parceiro(a) de forma educativa e respeitosa.",
      color: "luna-green"
    },
    {
      icon: Shield,
      title: "Privacidade Total",
      description: "Criptografia de ponta a ponta e controle total sobre seus dados.",
      color: "luna-purple"
    }
  ];

  return (
    <section className="py-20 bg-gradient-soft">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            <span>Funcionalidades Premium</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">
            Ferramentas que{" "}
            <span className="bg-gradient-colorful bg-clip-text text-transparent">
              transformam
            </span>{" "}
            seu bem-estar
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Tecnologia de ponta combinada com empatia e privacidade para apoiar todas as dimensões da sua saúde
          </p>
        </div>

        {/* Main Highlights */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {highlights.map((highlight, index) => {
            const Icon = highlight.icon;
            return (
              <Card 
                key={index}
                className="group overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-hover"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={highlight.image} 
                    alt={highlight.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${highlight.gradient}`} />
                  <div className="absolute top-4 left-4">
                    <div className={`p-3 rounded-xl bg-${highlight.color} shadow-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-foreground">
                    {highlight.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {highlight.description}
                  </p>
                  
                  <div className="space-y-2">
                    {highlight.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className={`h-1.5 w-1.5 rounded-full bg-${highlight.color}`} />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Mini Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {miniFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="p-6 hover:shadow-hover transition-all duration-300 border-2 hover:border-primary/30"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-lg bg-${feature.color}/10`}>
                    <Icon className={`h-5 w-5 text-${feature.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <NavLink to="/auth">
              <Button variant="colorful" size="lg" className="group">
                Experimente Grátis
                <Sparkles className="ml-2 h-5 w-5 transition-transform group-hover:rotate-12" />
              </Button>
            </NavLink>
            <NavLink to="/features">
              <Button variant="outline" size="lg">
                Ver Todas as Funcionalidades
              </Button>
            </NavLink>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Sem cartão de crédito • Cancele quando quiser
          </p>
        </div>
      </div>
    </section>
  );
};
