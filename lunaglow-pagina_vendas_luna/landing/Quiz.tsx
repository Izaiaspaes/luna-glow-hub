import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const quizQuestions = [
  {
    id: 1,
    question: "Qual é o seu principal objetivo com o Luna Glow?",
    options: [
      "Entender melhor meu ciclo menstrual",
      "Controlar sintomas de TPM",
      "Melhorar meu bem-estar geral",
      "Ter suporte emocional 24/7"
    ]
  },
  {
    id: 2,
    question: "Como você prefere acompanhar seu ciclo?",
    options: [
      "App simples e rápido",
      "Com análises detalhadas por IA",
      "Com diário e insights personalizados",
      "Com comunidade e suporte"
    ]
  },
  {
    id: 3,
    question: "O que mais te incomoda no seu ciclo?",
    options: [
      "Não consigo prever quando vai vir",
      "Sofro muito com sintomas físicos",
      "Mudanças de humor são difíceis",
      "Não sei como me cuidar em cada fase"
    ]
  }
];

export const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (questionId: number, optionIndex: number) => {
    setAnswers({ ...answers, [questionId]: optionIndex });
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const canProceed = answers[quizQuestions[currentQuestion].id] !== undefined;

  if (showResult) {
    return (
      <section className="py-16 bg-gradient-to-b from-luna-pink-light/30 to-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="max-w-2xl mx-auto p-12 text-center space-y-8 border-4 border-primary shadow-2xl gradient-bg text-white">
              <div className="space-y-4">
                <Badge className="bg-white/20 text-white border-0 text-lg px-6 py-2">
                  ✨ Resultado
                </Badge>
                <h2 className="text-4xl font-bold">
                  Você está pronta para transformar seu bem-estar!
                </h2>
                <p className="text-xl opacity-90">
                  Com base nas suas respostas, o Luna Glow vai revolucionar a forma como você cuida de si mesma
                </p>
              </div>

              <div className="space-y-4 pt-6">
                <Button 
                  size="xl" 
                  variant="default"
                  className="w-full bg-white text-primary hover:bg-white/90"
                  onClick={() => window.location.href = 'https://lunaglow.com.br/pricing'}
                >
                  Começar Grátis Agora
                  <ArrowRight className="ml-2" />
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    );
  }

  const question = quizQuestions[currentQuestion];

  return (
    <section className="py-16 bg-gradient-to-b from-luna-pink-light/30 to-background">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="bg-primary/10 text-primary border-0 mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            Quiz Rápido
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Descubra como o Luna Glow pode te ajudar
          </h2>
          <p className="text-lg text-muted-foreground">
            3 perguntas rápidas para personalizar sua experiência
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="max-w-3xl mx-auto p-8 space-y-8 border-2 hover:border-primary/30 transition-colors">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                  <span>Pergunta {currentQuestion + 1} de {quizQuestions.length}</span>
                  <span className="font-semibold text-primary">
                    {Math.round(((currentQuestion + 1) / quizQuestions.length) * 100)}%
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full gradient-bg"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold">{question.question}</h3>
                
                <RadioGroup
                  value={answers[question.id]?.toString()}
                  onValueChange={(value) => handleAnswer(question.id, parseInt(value))}
                >
                  <div className="space-y-3">
                    {question.options.map((option, index) => (
                      <motion.div 
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Label 
                          htmlFor={`q${question.id}-${index}`}
                          className={`flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            answers[question.id] === index 
                              ? 'border-primary bg-primary/5' 
                              : 'border-border hover:border-primary/50 hover:bg-muted/50'
                          }`}
                        >
                          <RadioGroupItem value={index.toString()} id={`q${question.id}-${index}`} />
                          <span className="text-base flex-1">{option}</span>
                        </Label>
                      </motion.div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <Button
                size="lg"
                variant="cta"
                onClick={handleNext}
                disabled={!canProceed}
                className="w-full"
              >
                {currentQuestion === quizQuestions.length - 1 ? "Ver Resultado" : "Próxima"}
                <ArrowRight className="ml-2" />
              </Button>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
