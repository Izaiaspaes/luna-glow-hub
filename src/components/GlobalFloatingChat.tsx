import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Sparkles, Loader2, Bot, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// FAQ responses for visitors (no AI needed)
const FAQ_RESPONSES: Record<string, Record<string, string>> = {
  pt: {
    "Como funciona o rastreamento do ciclo?": "O Luna rastreia seu ciclo menstrual automaticamente! Você registra a data de início da menstruação e o app calcula sua fase atual (menstrual, folicular, ovulatória ou lútea), prevendo sintomas e oferecendo recomendações personalizadas para cada fase. 🌸",
    "O que é a Luna Sense IA?": "Luna Sense é nossa assistente de IA especializada em bem-estar feminino! Ela conversa com você sobre ciclo, sintomas, nutrição, humor e sono, oferecendo sugestões personalizadas de autocuidado adaptadas à sua fase do ciclo. Disponível no plano Premium Plus! ✨",
    "Quais são os recursos premium?": "Os recursos Premium incluem: planos de bem-estar ilimitados, recomendações personalizadas com IA, Diário da Mulher com análise inteligente e SOS Feminino para momentos difíceis. O Premium Plus adiciona Luna Sense, Análise de Beleza IA e Closet Virtual! 👑",
    "Qual a diferença entre Premium e Premium Plus?": "Premium (R$19,90/mês): planos ilimitados, IA para bem-estar, Diário com IA e SOS Feminino. Premium Plus (R$29,90/mês): tudo do Premium + Luna Sense (chat IA), Análise de Beleza IA e Meu Closet Virtual com sugestões de looks! 💜",
    "Quanto custa cada pacote?": "Gratuito: 1 plano de bem-estar ativo. Premium: R$19,90/mês ou R$199/ano. Premium Plus: R$29,90/mês ou R$299/ano. Todos os planos podem ser cancelados a qualquer momento! 💰",
    "Posso cancelar a qualquer momento?": "Sim! Você pode cancelar sua assinatura a qualquer momento pelo painel de configurações. Seu acesso Premium continua até o fim do período pago. Sem multas ou taxas de cancelamento! ✅",
    "Como aliviar cólicas menstruais?": "Dicas para aliviar cólicas: 1) Aplique calor na região abdominal, 2) Pratique exercícios leves como yoga, 3) Beba chás como gengibre ou camomila, 4) Mantenha-se hidratada, 5) Descanse quando necessário. Para suporte personalizado, experimente nosso plano Premium! 🌿",
    "Dicas para TPM?": "Para aliviar a TPM: 1) Reduza sal e cafeína, 2) Pratique exercícios regulares, 3) Durma bem (7-8h), 4) Consuma alimentos ricos em magnésio e vitamina B6, 5) Pratique técnicas de relaxamento. O Luna Premium oferece planos personalizados para cada fase! 🧘‍♀️",
    "Como melhorar meu ciclo?": "Para um ciclo mais saudável: 1) Mantenha alimentação equilibrada, 2) Pratique exercícios regularmente, 3) Gerencie o estresse, 4) Durma bem, 5) Hidrate-se. O rastreamento contínuo no Luna ajuda a identificar padrões e melhorar seu bem-estar! 🌟",
  },
  en: {
    "How does cycle tracking work?": "Luna automatically tracks your menstrual cycle! You log your period start date and the app calculates your current phase (menstrual, follicular, ovulatory, or luteal), predicting symptoms and offering personalized recommendations for each phase. 🌸",
    "What is Luna Sense AI?": "Luna Sense is our AI assistant specialized in women's wellness! She chats with you about cycle, symptoms, nutrition, mood, and sleep, offering personalized self-care suggestions adapted to your cycle phase. Available on Premium Plus! ✨",
    "What are the premium features?": "Premium features include: unlimited wellness plans, AI-powered personalized recommendations, Women's Journal with smart analysis, and SOS Feminino for difficult moments. Premium Plus adds Luna Sense, AI Beauty Analysis, and Virtual Closet! 👑",
    "What's the difference between Premium and Premium Plus?": "Premium ($9.90/mo): unlimited plans, AI wellness, Journal with AI, and SOS. Premium Plus ($19.90/mo): everything in Premium + Luna Sense (AI chat), AI Beauty Analysis, and My Virtual Closet with outfit suggestions! 💜",
    "How much does each plan cost?": "Free: 1 active wellness plan. Premium: $9.90/month or $99/year. Premium Plus: $19.90/month or $199/year. All plans can be canceled anytime! 💰",
    "Can I cancel anytime?": "Yes! You can cancel your subscription anytime from the settings panel. Your Premium access continues until the end of your paid period. No fees or penalties! ✅",
    "How to relieve menstrual cramps?": "Tips to relieve cramps: 1) Apply heat to your abdomen, 2) Do light exercise like yoga, 3) Drink teas like ginger or chamomile, 4) Stay hydrated, 5) Rest when needed. For personalized support, try our Premium plan! 🌿",
    "Tips for PMS?": "To ease PMS: 1) Reduce salt and caffeine, 2) Exercise regularly, 3) Sleep well (7-8h), 4) Eat foods rich in magnesium and vitamin B6, 5) Practice relaxation techniques. Luna Premium offers personalized plans for each phase! 🧘‍♀️",
    "How to improve my cycle?": "For a healthier cycle: 1) Maintain a balanced diet, 2) Exercise regularly, 3) Manage stress, 4) Sleep well, 5) Stay hydrated. Continuous tracking with Luna helps identify patterns and improve your wellbeing! 🌟",
  },
  es: {
    "¿Cómo funciona el seguimiento del ciclo?": "¡Luna rastrea automáticamente tu ciclo menstrual! Registras la fecha de inicio de tu período y la app calcula tu fase actual (menstrual, folicular, ovulatoria o lútea), prediciendo síntomas y ofreciendo recomendaciones personalizadas. 🌸",
    "¿Qué es Luna Sense IA?": "¡Luna Sense es nuestra asistente de IA especializada en bienestar femenino! Conversa contigo sobre ciclo, síntomas, nutrición, ánimo y sueño, ofreciendo sugerencias personalizadas de autocuidado adaptadas a tu fase del ciclo. ¡Disponible en Premium Plus! ✨",
    "¿Cuáles son las funciones premium?": "Las funciones Premium incluyen: planes de bienestar ilimitados, recomendaciones personalizadas con IA, Diario de Mujer con análisis inteligente y SOS Femenino. ¡Premium Plus agrega Luna Sense, Análisis de Belleza IA y Closet Virtual! 👑",
    "¿Cuál es la diferencia entre Premium y Premium Plus?": "Premium ($9.90/mes): planes ilimitados, IA para bienestar, Diario con IA y SOS. Premium Plus ($19.90/mes): todo de Premium + Luna Sense (chat IA), Análisis de Belleza IA y Mi Closet Virtual con sugerencias de looks! 💜",
    "¿Cuánto cuesta cada plan?": "Gratis: 1 plan de bienestar activo. Premium: $9.90/mes o $99/año. Premium Plus: $19.90/mes o $199/año. ¡Todos los planes se pueden cancelar en cualquier momento! 💰",
    "¿Puedo cancelar en cualquier momento?": "¡Sí! Puedes cancelar tu suscripción en cualquier momento desde el panel de configuración. Tu acceso Premium continúa hasta el final del período pagado. ¡Sin multas ni cargos! ✅",
    "¿Cómo aliviar los cólicos menstruales?": "Consejos para aliviar cólicos: 1) Aplica calor en el abdomen, 2) Haz ejercicios suaves como yoga, 3) Bebe tés como jengibre o manzanilla, 4) Mantente hidratada, 5) Descansa cuando lo necesites. ¡Prueba nuestro plan Premium! 🌿",
    "Consejos para el SPM?": "Para aliviar el SPM: 1) Reduce sal y cafeína, 2) Ejercítate regularmente, 3) Duerme bien (7-8h), 4) Come alimentos ricos en magnesio y vitamina B6, 5) Practica técnicas de relajación. ¡Luna Premium ofrece planes personalizados! 🧘‍♀️",
    "¿Cómo mejorar mi ciclo?": "Para un ciclo más saludable: 1) Mantén una alimentación equilibrada, 2) Ejercítate regularmente, 3) Maneja el estrés, 4) Duerme bien, 5) Hidrátate. ¡El seguimiento continuo en Luna ayuda a identificar patrones! 🌟",
  }
};

const QUICK_REPLIES: Record<string, Array<{ category: string; questions: string[] }>> = {
  pt: [
    {
      category: "Recursos",
      questions: [
        "Como funciona o rastreamento do ciclo?",
        "O que é a Luna Sense IA?",
        "Quais são os recursos premium?",
      ]
    },
    {
      category: "Pacotes",
      questions: [
        "Qual a diferença entre Premium e Premium Plus?",
        "Quanto custa cada pacote?",
        "Posso cancelar a qualquer momento?",
      ]
    },
    {
      category: "Saúde",
      questions: [
        "Como aliviar cólicas menstruais?",
        "Dicas para TPM?",
        "Como melhorar meu ciclo?",
      ]
    }
  ],
  en: [
    {
      category: "Features",
      questions: [
        "How does cycle tracking work?",
        "What is Luna Sense AI?",
        "What are the premium features?",
      ]
    },
    {
      category: "Plans",
      questions: [
        "What's the difference between Premium and Premium Plus?",
        "How much does each plan cost?",
        "Can I cancel anytime?",
      ]
    },
    {
      category: "Health",
      questions: [
        "How to relieve menstrual cramps?",
        "Tips for PMS?",
        "How to improve my cycle?",
      ]
    }
  ],
  es: [
    {
      category: "Funciones",
      questions: [
        "¿Cómo funciona el seguimiento del ciclo?",
        "¿Qué es Luna Sense IA?",
        "¿Cuáles son las funciones premium?",
      ]
    },
    {
      category: "Planes",
      questions: [
        "¿Cuál es la diferencia entre Premium y Premium Plus?",
        "¿Cuánto cuesta cada plan?",
        "¿Puedo cancelar en cualquier momento?",
      ]
    },
    {
      category: "Salud",
      questions: [
        "¿Cómo aliviar los cólicos menstruales?",
        "Consejos para el SPM?",
        "¿Cómo mejorar mi ciclo?",
      ]
    }
  ]
};

const getWelcomeMessage = (lang: string, isLoggedIn: boolean, isPremium: boolean): string => {
  const messages: Record<string, Record<string, string>> = {
    pt: {
      visitor: "Olá! Sou a Luna 👋 Como posso te ajudar hoje? Escolha uma pergunta frequente ou digite sua dúvida!",
      free: "Olá! Sou a Luna 👋 Como posso te ajudar? Posso responder dúvidas ou, se preferir, faça upgrade para conversar com a IA!",
      premium: "Olá! Sou a Luna Sense 👋 Estou aqui para ajudar com qualquer dúvida sobre ciclo, bem-estar, beleza e muito mais!",
    },
    en: {
      visitor: "Hello! I'm Luna 👋 How can I help you today? Choose a common question or type your question!",
      free: "Hello! I'm Luna 👋 How can I help? I can answer FAQs or upgrade to chat with AI!",
      premium: "Hello! I'm Luna Sense 👋 I'm here to help with any questions about cycle, wellness, beauty, and more!",
    },
    es: {
      visitor: "¡Hola! Soy Luna 👋 ¿Cómo puedo ayudarte hoy? ¡Elige una pregunta frecuente o escribe tu duda!",
      free: "¡Hola! Soy Luna 👋 ¿Cómo puedo ayudarte? Puedo responder preguntas frecuentes o haz upgrade para chatear con IA!",
      premium: "¡Hola! Soy Luna Sense 👋 ¡Estoy aquí para ayudarte con cualquier duda sobre ciclo, bienestar, belleza y más!",
    }
  };
  
  const langMsgs = messages[lang] || messages.pt;
  if (!isLoggedIn) return langMsgs.visitor;
  if (isPremium) return langMsgs.premium;
  return langMsgs.free;
};

export const GlobalFloatingChat = () => {
  const { i18n, t } = useTranslation();
  const lang = i18n.language?.split('-')[0] || 'pt';
  const { user, userProfile } = useAuth();
  
  const isLoggedIn = !!user;
  const subscriptionPlan = userProfile?.subscription_plan;
  const isPremium = subscriptionPlan === 'premium' || subscriptionPlan === 'premium_plus';
  const isPremiumPlus = subscriptionPlan === 'premium_plus';

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Initialize welcome message when chat opens or language changes
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        role: "assistant",
        content: getWelcomeMessage(lang, isLoggedIn, isPremium)
      }]);
    }
  }, [isOpen, lang, isLoggedIn, isPremium]);

  // Reset messages when chat closes
  useEffect(() => {
    if (!isOpen) {
      setMessages([]);
      setShowQuickReplies(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const getFAQResponse = (question: string): string | null => {
    const langResponses = FAQ_RESPONSES[lang] || FAQ_RESPONSES.pt;
    return langResponses[question] || null;
  };

  const streamAIChat = async (userMessage: string) => {
    setIsLoading(true);
    setShowQuickReplies(false);
    
    const newMessages = [...messages, { role: "user" as const, content: userMessage }];
    setMessages(newMessages);

    try {
      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/luna-chat`;
      
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok || !response.body) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Erro ao enviar mensagem");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let assistantMessage = "";
      let streamDone = false;

      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantMessage += content;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "assistant",
                  content: assistantMessage
                };
                return updated;
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw || raw.startsWith(":") || !raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantMessage += content;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "assistant",
                  content: assistantMessage
                };
                return updated;
              });
            }
          } catch { /* ignore */ }
        }
      }

    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: lang === 'en' ? "Error" : lang === 'es' ? "Error" : "Erro",
        description: error instanceof Error ? error.message : "Erro ao enviar mensagem",
        variant: "destructive",
      });
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
      setTimeout(() => setShowQuickReplies(true), 1000);
    }
  };

  const handleQuickReply = async (question: string) => {
    setShowQuickReplies(false);
    setMessages(prev => [...prev, { role: "user", content: question }]);
    
    // Check for FAQ response first
    const faqResponse = getFAQResponse(question);
    
    if (faqResponse) {
      // Use FAQ response (no AI needed)
      setTimeout(() => {
        setMessages(prev => [...prev, { role: "assistant", content: faqResponse }]);
        setTimeout(() => setShowQuickReplies(true), 500);
      }, 500);
    } else if (isPremium) {
      // Use AI for Premium users
      await streamAIChat(question);
    } else {
      // Show upgrade prompt for non-premium
      const upgradeMsg: Record<string, string> = {
        pt: "Para perguntas personalizadas, faça upgrade para Premium ou Premium Plus e converse com a Luna Sense IA! 🌟",
        en: "For personalized questions, upgrade to Premium or Premium Plus and chat with Luna Sense AI! 🌟",
        es: "Para preguntas personalizadas, actualiza a Premium o Premium Plus y chatea con Luna Sense IA! 🌟"
      };
      setTimeout(() => {
        setMessages(prev => [...prev, { role: "assistant", content: upgradeMsg[lang] || upgradeMsg.pt }]);
        setTimeout(() => setShowQuickReplies(true), 500);
      }, 500);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    // Check if it's a FAQ question
    const faqResponse = getFAQResponse(userMessage);
    
    if (faqResponse) {
      setMessages(prev => [...prev, { role: "user", content: userMessage }]);
      setTimeout(() => {
        setMessages(prev => [...prev, { role: "assistant", content: faqResponse }]);
      }, 500);
    } else if (isPremium) {
      // Premium users get AI
      await streamAIChat(userMessage);
    } else {
      // Show upgrade prompt
      setMessages(prev => [...prev, { role: "user", content: userMessage }]);
      const upgradeMsg: Record<string, string> = {
        pt: "Essa pergunta requer a IA Luna Sense. Faça upgrade para Premium para ter acesso a respostas personalizadas! 💜",
        en: "This question requires Luna Sense AI. Upgrade to Premium for personalized answers! 💜",
        es: "Esta pregunta requiere Luna Sense IA. ¡Actualiza a Premium para respuestas personalizadas! 💜"
      };
      setTimeout(() => {
        setMessages(prev => [...prev, { role: "assistant", content: upgradeMsg[lang] || upgradeMsg.pt }]);
      }, 500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickReplies = QUICK_REPLIES[lang] || QUICK_REPLIES.pt;
  const placeholderText: Record<string, string> = {
    pt: "Digite sua mensagem...",
    en: "Type your message...",
    es: "Escribe tu mensaje..."
  };
  const alwaysHereText: Record<string, string> = {
    pt: "Sempre aqui para ajudar",
    en: "Always here to help",
    es: "Siempre aquí para ayudar"
  };
  const faqText: Record<string, string> = {
    pt: "Perguntas frequentes:",
    en: "Frequently asked questions:",
    es: "Preguntas frecuentes:"
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              size="lg"
              className="h-16 w-16 rounded-full shadow-2xl gradient-bg hover:scale-110 transition-transform group"
            >
              <MessageCircle className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
              <motion.div
                className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)]"
          >
            <Card className="h-[600px] max-h-[calc(100vh-6rem)] flex flex-col shadow-2xl border-2 border-primary/20">
              {/* Header */}
              <div className="gradient-bg text-white p-4 flex items-center justify-between rounded-t-lg">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      {isPremium ? <Sparkles className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                  </div>
                  <div>
                    <div className="font-bold flex items-center gap-2">
                      {isPremium ? "Luna Sense" : "Luna"}
                      {isPremiumPlus && <Sparkles className="w-4 h-4 text-yellow-300" />}
                    </div>
                    <div className="text-xs opacity-90">{alwaysHereText[lang] || alwaysHereText.pt}</div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-white/20 text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                          message.role === "user"
                            ? "gradient-bg text-white"
                            : "bg-muted text-foreground"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-muted rounded-2xl px-4 py-2">
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Quick Replies */}
                  {showQuickReplies && !isLoading && messages.length <= 3 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3 pt-2"
                    >
                      <div className="text-xs text-muted-foreground text-center font-medium">
                        {faqText[lang] || faqText.pt}
                      </div>
                      {quickReplies.map((category, idx) => (
                        <div key={idx} className="space-y-2">
                          <div className="text-xs font-semibold text-primary">
                            {category.category}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {category.questions.map((question, qIdx) => (
                              <Button
                                key={qIdx}
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuickReply(question)}
                                className="text-xs h-auto py-2 px-3 hover:bg-primary/10 hover:border-primary/30 transition-all"
                              >
                                {question}
                              </Button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {/* Premium Upgrade Banner for non-premium users */}
                  {!isPremium && isLoggedIn && messages.length > 2 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gradient-to-r from-luna-pink/20 via-luna-purple/20 to-primary/20 rounded-lg p-3 text-center"
                    >
                      <div className="flex items-center justify-center gap-2 text-sm font-medium text-foreground">
                        <Lock className="w-4 h-4" />
                        {lang === 'en' ? 'Upgrade for AI Chat' : lang === 'es' ? 'Actualiza para Chat IA' : 'Upgrade para Chat IA'}
                      </div>
                      <Button
                        size="sm"
                        variant="cta"
                        className="mt-2"
                        onClick={() => window.location.href = '/pricing'}
                      >
                        {lang === 'en' ? 'See Plans' : lang === 'es' ? 'Ver Planes' : 'Ver Pacotes'}
                      </Button>
                    </motion.div>
                  )}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={placeholderText[lang] || placeholderText.pt}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    size="icon"
                    variant="cta"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
