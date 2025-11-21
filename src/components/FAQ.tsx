import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Shield, Sparkles, CreditCard, Lock, Users, Calendar } from "lucide-react";

const faqs = [
  {
    icon: Shield,
    question: "Meus dados estão realmente seguros?",
    answer:
      "Sim! A privacidade é nossa prioridade máxima. Todos os seus dados são criptografados e armazenados de forma segura. Você tem controle total sobre suas informações e pode exportar ou deletar seus dados a qualquer momento. Nunca compartilhamos suas informações pessoais sem seu consentimento explícito.",
  },
  {
    icon: Sparkles,
    question: "Como funciona a Inteligência Artificial do Luna?",
    answer:
      "Nossa IA analisa seus dados de rastreamento (ciclo, sono, humor e energia) para identificar padrões únicos do seu corpo. Com base nessas análises, ela gera Planos de Bem-Estar personalizados com recomendações práticas e acionáveis, adaptadas especificamente para você. Quanto mais você usa, mais precisas ficam as recomendações.",
  },
  {
    icon: Calendar,
    question: "Qual a diferença entre Pacotes e Planos de Bem-Estar?",
    answer:
      "Pacotes são os nossos planos de assinatura (Gratuito e Premium) que definem quais recursos você tem acesso. Já os Planos de Bem-Estar são as recomendações personalizadas geradas pela nossa IA com base nos seus dados de rastreamento, como rotinas de sono, dicas nutricionais e exercícios.",
  },
  {
    icon: CreditCard,
    question: "O que está incluído no Pacote Gratuito?",
    answer:
      "O Pacote Gratuito inclui rastreamento básico de ciclo, sono, humor e energia, acesso ao assistente AI com respostas limitadas, visualização de dados em gráficos simples e notificações básicas. É perfeito para começar a entender melhor seu corpo e rotina.",
  },
  {
    icon: Users,
    question: "Como funciona a transcrição por voz?",
    answer:
      "A transcrição por voz está disponível apenas no Pacote Premium e permite que você registre suas informações de rastreamento falando ao invés de digitando. Nossa IA transcreve automaticamente sua fala e analisa o conteúdo para preencher os campos e gerar insights personalizados.",
  },
  {
    icon: Lock,
    question: "Posso cancelar minha assinatura a qualquer momento?",
    answer:
      "Sim, você pode cancelar sua assinatura Premium a qualquer momento sem custos adicionais. Seus dados permanecerão seguros e você continuará tendo acesso aos recursos do Pacote Gratuito. Não há período de fidelidade ou taxas de cancelamento.",
  },
];

export const FAQ = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-primary-glow to-secondary bg-clip-text text-transparent">
            Perguntas Frequentes
          </h2>
          <p className="text-muted-foreground text-lg">
            Tire suas dúvidas sobre privacidade, funcionamento e recursos do Luna
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
            Ainda tem dúvidas?{" "}
            <a
              href="mailto:suporte@luna.app"
              className="text-primary font-semibold hover:underline"
            >
              Entre em contato conosco
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};
