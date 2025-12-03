import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "¿Luna Glow es realmente gratis?",
    answer: "¡Sí! Puedes usar Luna Glow gratis para siempre con funcionalidades básicas como seguimiento de ciclo y calendario. Los planes premium desbloquean características avanzadas como IA ilimitada y análisis completos."
  },
  {
    question: "¿Mis datos son privados?",
    answer: "¡Absolutamente! Tus datos son 100% privados y encriptados. Nunca compartimos o vendemos tu información personal. Tienes control total sobre tus datos."
  },
  {
    question: "¿Puedo cancelar en cualquier momento?",
    answer: "Sí, puedes cancelar tu plan premium en cualquier momento sin cargos o penalidades. Si cancelas, continúas teniendo acceso a las características premium hasta el fin del período pagado."
  },
  {
    question: "¿Cómo funciona la garantía de 7 días?",
    answer: "Si no quedas satisfecha en los primeros 7 días, reembolsamos 100% del valor pagado, sin preguntas. Queremos que tengas certeza de que Luna es perfecto para ti."
  },
  {
    question: "¿Luna funciona para todos los ciclos?",
    answer: "¡Sí! Luna se adapta a ciclos regulares, irregulares, cortos o largos. Nuestra IA aprende de tus patrones únicos y se ajusta continuamente para ofrecer las mejores predicciones."
  },
  {
    question: "¿Necesito conocimiento técnico?",
    answer: "¡No! Luna Glow fue diseñado para ser súper intuitivo. Si sabes usar redes sociales, puedes usar Luna. Nuestra IA te guía en cada paso."
  }
];

export const FAQ = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-luna-pink-light/30 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Preguntas frecuentes
            </h2>
            <p className="text-xl text-muted-foreground">
              Todo lo que necesitas saber sobre Luna Glow
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
