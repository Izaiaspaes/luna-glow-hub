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

  const faqs = [
    {
      icon: Shield,
      question: t('faq.q1'),
      answer: t('faq.a1'),
    },
    {
      icon: Sparkles,
      question: t('faq.q2'),
      answer: t('faq.a2'),
    },
    {
      icon: Calendar,
      question: t('faq.q3'),
      answer: t('faq.a3'),
    },
    {
      icon: CreditCard,
      question: t('faq.q4'),
      answer: t('faq.a4'),
    },
    {
      icon: Users,
      question: t('faq.q5'),
      answer: t('faq.a5'),
    },
    {
      icon: Lock,
      question: t('faq.q6'),
      answer: t('faq.a6'),
    },
  ];
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-primary-glow to-secondary bg-clip-text text-transparent">
            {t('faq.title')}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t('faq.subtitle')}
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
