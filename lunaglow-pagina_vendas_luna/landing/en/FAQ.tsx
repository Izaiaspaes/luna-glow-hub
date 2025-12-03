import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Is Luna Glow really free?",
    answer: "Yes! You can use Luna Glow for free forever with basic features like cycle tracking and calendar. Premium plans unlock advanced features like unlimited AI and complete analyses."
  },
  {
    question: "Is my data private?",
    answer: "Absolutely! Your data is 100% private and encrypted. We never share or sell your personal information. You have complete control over your data."
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes, you can cancel your premium plan anytime without fees or penalties. If you cancel, you continue having access to premium features until the end of the paid period."
  },
  {
    question: "How does the 7-day guarantee work?",
    answer: "If you're not satisfied in the first 7 days, we refund 100% of the amount paid, no questions asked. We want you to be sure that Luna is perfect for you."
  },
  {
    question: "Does Luna work for all cycles?",
    answer: "Yes! Luna adapts to regular, irregular, short or long cycles. Our AI learns from your unique patterns and continuously adjusts to offer the best predictions."
  },
  {
    question: "Do I need technical knowledge?",
    answer: "No! Luna Glow was designed to be super intuitive. If you know how to use social media, you can use Luna. Our AI guides you at every step."
  }
];

export const FAQ = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-luna-pink-light/30 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Frequently asked questions
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about Luna Glow
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
