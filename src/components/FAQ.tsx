import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Shield, Sparkles, CreditCard, Lock, Users, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";

export const FAQ = () => {
  const { t } = useTranslation();

  const tx = (key: string, fallback: string) => {
    const value = t(key, { defaultValue: fallback });
    return value === key ? fallback : value;
  };

  const faqs = [
    {
      icon: Shield,
      question: tx('faq.q1', 'A Luna é gratuita?'),
      answer: tx('faq.a1', 'Sim! A Luna oferece um plano gratuito com recursos essenciais. Você também pode assinar o Premium para funcionalidades avançadas.'),
    },
    {
      icon: Sparkles,
      question: tx('faq.q2', 'Como funciona a IA da Luna?'),
      answer: tx('faq.a2', 'Nossa IA analisa seus dados de saúde para oferecer insights personalizados sobre seu ciclo, sono, humor e energia.'),
    },
    {
      icon: Calendar,
      question: tx('faq.q3', 'Posso acompanhar meu ciclo menstrual?'),
      answer: tx('faq.a3', 'Sim! A Luna oferece acompanhamento completo do ciclo menstrual com previsões e alertas personalizados.'),
    },
    {
      icon: CreditCard,
      question: tx('faq.q4', 'Como funciona o pagamento?'),
      answer: tx('faq.a4', 'Aceitamos cartão de crédito e PIX. Você pode cancelar sua assinatura a qualquer momento.'),
    },
    {
      icon: Users,
      question: tx('faq.q5', 'Posso compartilhar dados com meu parceiro?'),
      answer: tx('faq.a5', 'Sim! Com o recurso de compartilhamento, você pode escolher quais informações compartilhar.'),
    },
    {
      icon: Lock,
      question: tx('faq.q6', 'Meus dados estão seguros?'),
      answer: tx('faq.a6', 'Absolutamente! Usamos criptografia de ponta e seguimos a LGPD para proteger suas informações.'),
    },
  ];
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-primary-glow to-secondary bg-clip-text text-transparent">
            {tx('faq.title', 'Perguntas Frequentes')}
          </h2>
          <p className="text-muted-foreground text-lg">
            {tx('faq.subtitle', 'Tire suas dúvidas sobre a Luna')}
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => {
            const Icon = faq.icon;
            return (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border/50 rounded-lg px-6 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors duration-300"
              >
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-3 text-left">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-semibold text-foreground">
                      {faq.question}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4 pl-13">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            {t('faq.contact')}{" "}
            <a
              href="mailto:suporte@lunaglow.com.br"
              className="text-primary font-semibold hover:underline"
            >
              {t('faq.contactLink')}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};
