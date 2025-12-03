import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "O Luna Glow é realmente grátis?",
    answer: "Sim! Você pode usar o Luna Glow gratuitamente para sempre com funcionalidades básicas como rastreamento de ciclo e calendário. Os planos premium desbloqueiam recursos avançados como IA ilimitada e análises completas."
  },
  {
    question: "Meus dados são privados?",
    answer: "Absolutamente! Seus dados são 100% privados e criptografados. Nunca compartilhamos ou vendemos suas informações pessoais. Você tem controle total sobre seus dados."
  },
  {
    question: "Posso cancelar a qualquer momento?",
    answer: "Sim, você pode cancelar seu plano premium a qualquer momento sem taxas ou penalidades. Se cancelar, você continua tendo acesso aos recursos premium até o fim do período pago."
  },
  {
    question: "Como funciona a garantia de 7 dias?",
    answer: "Se você não ficar satisfeita nos primeiros 7 dias, reembolsamos 100% do valor pago, sem perguntas. Queremos que você tenha certeza de que o Luna é perfeito para você."
  },
  {
    question: "O Luna funciona para todos os ciclos?",
    answer: "Sim! O Luna se adapta a ciclos regulares, irregulares, curtos ou longos. Nossa IA aprende com seus padrões únicos e se ajusta continuamente para oferecer as melhores previsões."
  },
  {
    question: "Preciso de conhecimento técnico?",
    answer: "Não! O Luna Glow foi projetado para ser super intuitivo. Se você sabe usar redes sociais, consegue usar o Luna. Nossa IA guia você em cada passo."
  }
];

export const FAQ = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-luna-pink-light/30 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Perguntas frequentes
            </h2>
            <p className="text-xl text-muted-foreground">
              Tudo o que você precisa saber sobre o Luna Glow
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card border-2 rounded-lg px-6 data-[state=open]:border-primary/30"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
