import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Shield, 
  Sparkles, 
  CreditCard, 
  Lock, 
  Users, 
  Calendar,
  Heart,
  Smartphone,
  Moon,
  Bell,
  ShoppingBag,
  MessageCircle,
  HelpCircle
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const FAQ = () => {
  const { t } = useTranslation();

  const tx = (key: string, fallback: string) => {
    const value = t(key, { defaultValue: fallback });
    return value === key ? fallback : value;
  };

  const faqCategories = [
    {
      title: "Sobre a Luna",
      faqs: [
        {
          icon: Shield,
          question: "A Luna Glow é realmente gratuita?",
          answer: "Sim! Você pode usar a Luna Glow gratuitamente para sempre com funcionalidades básicas como acompanhamento de ciclo, calendário e insights diários. Os planos Premium e Premium Plus desbloqueiam recursos avançados como IA ilimitada, análises completas de beleza e saúde, guarda-roupa virtual e muito mais.",
        },
        {
          icon: Sparkles,
          question: "Como funciona a IA da Luna?",
          answer: "Nossa IA avançada analisa seus dados de saúde, ciclo menstrual, humor, sono e energia para oferecer insights 100% personalizados. Ela aprende com seus padrões únicos e se adapta continuamente para oferecer as melhores previsões e recomendações.",
        },
        {
          icon: Lock,
          question: "Meus dados estão realmente seguros?",
          answer: "Absolutamente! Sua privacidade é nossa prioridade máxima. Usamos criptografia de ponta a ponta, seguimos rigorosamente a LGPD e NUNCA compartilhamos ou vendemos seus dados. Você tem controle total sobre suas informações e pode exportar ou excluir tudo a qualquer momento.",
        },
      ],
    },
    {
      title: "Funcionalidades",
      faqs: [
        {
          icon: Calendar,
          question: "Posso acompanhar meu ciclo menstrual?",
          answer: "Sim! A Luna oferece acompanhamento completo do ciclo menstrual com previsões precisas, alertas personalizados, registro de sintomas e insights sobre cada fase do seu ciclo. Nossa IA aprende com seus padrões para oferecer previsões cada vez mais precisas.",
        },
        {
          icon: Heart,
          question: "O que é a Análise de Beleza com IA?",
          answer: "É um recurso exclusivo que analisa suas características únicas (tom de pele, formato do rosto, tipo de cabelo) para oferecer recomendações personalizadas de maquiagem, skincare e estilo. Disponível nos planos Premium e Premium Plus.",
        },
        {
          icon: ShoppingBag,
          question: "Como funciona o Guarda-Roupa Virtual?",
          answer: "Você pode fotografar suas roupas e a IA organiza automaticamente por categoria, cor e ocasião. O sistema sugere combinações de looks baseadas no seu estilo, no clima e na sua agenda. É como ter uma consultora de moda pessoal!",
        },
        {
          icon: Moon,
          question: "A Luna acompanha sono e energia?",
          answer: "Sim! Você pode registrar a qualidade do sono, horários e como se sentiu ao acordar. A Luna correlaciona esses dados com seu ciclo e humor para identificar padrões e oferecer dicas personalizadas para melhorar seu descanso.",
        },
        {
          icon: MessageCircle,
          question: "O que é a Luna Sense?",
          answer: "É nossa assistente de IA conversacional que você pode consultar a qualquer momento. Ela conhece seu histórico, entende seu contexto e oferece conselhos personalizados sobre saúde, bem-estar, beleza e autocuidado.",
        },
      ],
    },
    {
      title: "Planos e Pagamento",
      faqs: [
        {
          icon: CreditCard,
          question: "Quais formas de pagamento vocês aceitam?",
          answer: "Aceitamos cartão de crédito (Visa, Mastercard, Elo, American Express), PIX e boleto bancário. Os pagamentos são processados de forma segura via Stripe.",
        },
        {
          icon: Bell,
          question: "Posso cancelar minha assinatura a qualquer momento?",
          answer: "Sim! Você pode cancelar seu plano Premium a qualquer momento, sem taxas ou penalidades. Se cancelar, você continua tendo acesso aos recursos premium até o fim do período já pago.",
        },
        {
          icon: HelpCircle,
          question: "Como funciona a garantia de 7 dias?",
          answer: "Se você não ficar satisfeita nos primeiros 7 dias, reembolsamos 100% do valor pago, sem perguntas. Queremos que você tenha certeza de que a Luna é perfeita para você.",
        },
      ],
    },
    {
      title: "Compartilhamento e Comunidade",
      faqs: [
        {
          icon: Users,
          question: "Posso compartilhar meus dados com meu parceiro(a)?",
          answer: "Sim! Com o recurso de Modo Parceiro, você pode convidar alguém para acompanhar informações selecionadas do seu ciclo. Você controla exatamente o que é compartilhado e pode revogar o acesso a qualquer momento.",
        },
        {
          icon: Smartphone,
          question: "A Luna funciona como aplicativo?",
          answer: "Sim! A Luna Glow é um Progressive Web App (PWA), ou seja, você pode instalá-la diretamente no seu celular sem precisar de loja de apps. Funciona offline e envia notificações como qualquer app nativo.",
        },
      ],
    },
  ];

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <HelpCircle className="w-4 h-4" />
            Central de Ajuda
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-primary-glow to-secondary bg-clip-text text-transparent">
            {tx('faq.title', 'Perguntas Frequentes')}
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Tudo o que você precisa saber sobre a Luna Glow. Não encontrou sua resposta? Entre em contato conosco!
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-12">
          {faqCategories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-sm font-bold">
                  {categoryIndex + 1}
                </span>
                {category.title}
              </h3>
              
              <Accordion type="single" collapsible className="w-full space-y-3">
                {category.faqs.map((faq, index) => {
                  const Icon = faq.icon;
                  return (
                    <AccordionItem
                      key={index}
                      value={`category-${categoryIndex}-item-${index}`}
                      className="border border-border/50 rounded-xl px-6 bg-card/80 backdrop-blur-sm hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                    >
                      <AccordionTrigger className="hover:no-underline py-5">
                        <div className="flex items-center gap-4 text-left">
                          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-secondary/30 transition-colors">
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                          <span className="font-semibold text-foreground text-base md:text-lg">
                            {faq.question}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed pb-5 pl-16 text-base">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-background to-secondary/10 border border-border/50">
            <div className="text-center sm:text-left">
              <p className="font-semibold text-foreground mb-1">
                Ainda tem dúvidas?
              </p>
              <p className="text-sm text-muted-foreground">
                Nossa equipe está pronta para ajudar você
              </p>
            </div>
            <Button asChild className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground">
              <Link to="/pricing">
                <MessageCircle className="w-4 h-4 mr-2" />
                Fale Conosco
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
