import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, Sparkles, Crown, Heart } from "lucide-react";

const questions = [
  {
    id: 1,
    question: "Com que frequência você gostaria de usar o app?",
    options: [
      { text: "Ocasionalmente (1-2x por semana)", points: { free: 3, premium: 1, premiumPlus: 0 } },
      { text: "Regularmente (3-4x por semana)", points: { free: 1, premium: 3, premiumPlus: 1 } },
      { text: "Diariamente", points: { free: 0, premium: 2, premiumPlus: 3 } },
    ],
  },
  {
    id: 2,
    question: "Você gostaria de conversar com a Luna Sense (IA)?",
    options: [
      { text: "Não preciso", points: { free: 3, premium: 0, premiumPlus: 0 } },
      { text: "Às vezes, para dúvidas pontuais", points: { free: 1, premium: 3, premiumPlus: 1 } },
      { text: "Sim, quero suporte ilimitado 24/7", points: { free: 0, premium: 2, premiumPlus: 3 } },
    ],
  },
  {
    id: 3,
    question: "Você mantém um diário sobre suas emoções e sintomas?",
    options: [
      { text: "Não costumo registrar", points: { free: 3, premium: 1, premiumPlus: 0 } },
      { text: "Sim, de vez em quando", points: { free: 1, premium: 3, premiumPlus: 1 } },
      { text: "Sim, quero análises profundas com IA", points: { free: 0, premium: 1, premiumPlus: 3 } },
    ],
  },
  {
    id: 4,
    question: "Análises de beleza personalizadas são importantes?",
    options: [
      { text: "Não me interessa", points: { free: 3, premium: 1, premiumPlus: 0 } },
      { text: "Seria legal ter", points: { free: 1, premium: 3, premiumPlus: 2 } },
      { text: "Sim, quero recomendações personalizadas", points: { free: 0, premium: 1, premiumPlus: 3 } },
    ],
  },
  {
    id: 5,
    question: "Você precisa de um 'SOS Feminino' para emergências?",
    options: [
      { text: "Não preciso", points: { free: 3, premium: 1, premiumPlus: 0 } },
      { text: "Seria útil ter", points: { free: 1, premium: 3, premiumPlus: 2 } },
      { text: "Sim, é essencial para mim", points: { free: 0, premium: 1, premiumPlus: 3 } },
    ],
  },
  {
    id: 6,
    question: "Closet virtual com recomendações por fase do ciclo?",
    options: [
      { text: "Não me interessa", points: { free: 3, premium: 1, premiumPlus: 0 } },
      { text: "Parece interessante", points: { free: 1, premium: 3, premiumPlus: 2 } },
      { text: "Sim, quero me vestir conforme meu ciclo", points: { free: 0, premium: 1, premiumPlus: 3 } },
    ],
  },
  {
    id: 7,
    question: "Planos de bem-estar personalizados para cada fase?",
    options: [
      { text: "Não preciso", points: { free: 3, premium: 1, premiumPlus: 0 } },
      { text: "Seria bom ter sugestões básicas", points: { free: 1, premium: 3, premiumPlus: 1 } },
      { text: "Sim, quero planos completos e personalizados", points: { free: 0, premium: 1, premiumPlus: 3 } },
    ],
  },
  {
    id: 8,
    question: "Importância de conteúdo premium exclusivo?",
    options: [
      { text: "Não é importante", points: { free: 3, premium: 1, premiumPlus: 0 } },
      { text: "Seria um diferencial", points: { free: 1, premium: 3, premiumPlus: 2 } },
      { text: "Sim, quero acesso a tudo", points: { free: 0, premium: 1, premiumPlus: 3 } },
    ],
  },
  {
    id: 9,
    question: "Você gostaria de participar de uma comunidade exclusiva?",
    options: [
      { text: "Prefiro usar sozinha", points: { free: 3, premium: 1, premiumPlus: 0 } },
      { text: "Seria legal conhecer outras usuárias", points: { free: 1, premium: 3, premiumPlus: 2 } },
      { text: "Sim, adoro trocar experiências", points: { free: 0, premium: 1, premiumPlus: 3 } },
    ],
  },
  {
    id: 10,
    question: "Quanto você investiria mensalmente no seu bem-estar?",
    options: [
      { text: "Prefiro começar grátis", points: { free: 3, premium: 1, premiumPlus: 0 } },
      { text: "Até R$ 30/mês", points: { free: 1, premium: 3, premiumPlus: 1 } },
      { text: "R$ 50+ se valer a pena", points: { free: 0, premium: 1, premiumPlus: 3 } },
    ],
  },
];

const planResults = {
  free: {
    name: "Plano Gratuito",
    icon: Heart,
    color: "text-luna-purple",
    description: "Perfeito para você começar sua jornada de autocuidado",
    cta: "Começar Grátis",
  },
  premium: {
    name: "Premium Mensal",
    icon: Sparkles,
    color: "text-primary",
    description: "Ideal para quem quer todas as funcionalidades essenciais",
    cta: "Assinar Premium",
  },
  premiumPlus: {
    name: "Premium Plus Anual",
    icon: Crown,
    color: "text-luna-peach",
    description: "A escolha definitiva para transformação completa",
    cta: "Garantir 70% OFF",
  },
};

export const PlanCalculator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<string | null>(null);

  const handleAnswer = (questionId: number, optionIndex: number) => {
    setAnswers({ ...answers, [questionId]: optionIndex });
  };

  const calculateResult = () => {
    const scores = { free: 0, premium: 0, premiumPlus: 0 };
    
    Object.entries(answers).forEach(([questionId, optionIndex]) => {
      const question = questions[parseInt(questionId) - 1];
      const option = question.options[optionIndex];
      scores.free += option.points.free;
      scores.premium += option.points.premium;
      scores.premiumPlus += option.points.premiumPlus;
    });

    const maxScore = Math.max(scores.free, scores.premium, scores.premiumPlus);
    if (scores.premiumPlus === maxScore) return "premiumPlus";
    if (scores.premium === maxScore) return "premium";
    return "free";
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const planResult = calculateResult();
      setResult(planResult);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
  };

  const progress = ((Object.keys(answers).length) / questions.length) * 100;
  const currentQuestion = questions[currentStep];
  const canProceed = answers[currentQuestion.id] !== undefined;

  if (result) {
    const plan = planResults[result as keyof typeof planResults];
    const Icon = plan.icon;

    return (
      <section className="py-24 bg-gradient-to-b from-luna-pink-light/20 to-background">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto p-12 text-center space-y-8 border-4 border-primary shadow-2xl">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Icon className={`w-10 h-10 ${plan.color}`} />
            </div>
            
            <div className="space-y-4">
              <Badge className="bg-primary/10 text-primary border-0 text-lg px-6 py-2">
                Seu Plano Ideal
              </Badge>
              <h2 className="text-4xl font-bold">{plan.name}</h2>
              <p className="text-xl text-muted-foreground">{plan.description}</p>
            </div>

            <div className="space-y-4 pt-6">
              <Button 
                size="xl" 
                variant="cta" 
                className="w-full"
                onClick={() => window.location.href = 'https://lunaglow.com.br/auth'}
              >
                {plan.cta}
                <ArrowRight className="ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="ghost" 
                className="w-full"
                onClick={handleReset}
              >
                Refazer Calculadora
              </Button>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-b from-luna-pink-light/20 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge className="bg-primary/10 text-primary border-0 mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            Descubra Seu Plano Ideal
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Qual plano combina com você?
          </h2>
          <p className="text-xl text-muted-foreground">
            Responda 10 perguntas rápidas e descubra o plano perfeito para suas necessidades
          </p>
        </div>

        <Card className="max-w-3xl mx-auto p-8 space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>Pergunta {currentStep + 1} de {questions.length}</span>
              <span>{Math.round(progress)}% completo</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold">{currentQuestion.question}</h3>
            
            <RadioGroup
              value={answers[currentQuestion.id]?.toString()}
              onValueChange={(value) => handleAnswer(currentQuestion.id, parseInt(value))}
            >
              <div className="space-y-4">
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <RadioGroupItem value={index.toString()} id={`q${currentQuestion.id}-${index}`} />
                    <Label 
                      htmlFor={`q${currentQuestion.id}-${index}`}
                      className="text-base cursor-pointer flex-1 py-4 px-4 rounded-lg border-2 border-transparent hover:border-primary/20 transition-all"
                    >
                      {option.text}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          <div className="flex gap-4 pt-6">
            <Button
              size="lg"
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex-1"
            >
              <ArrowLeft className="mr-2" />
              Voltar
            </Button>
            <Button
              size="lg"
              variant="cta"
              onClick={handleNext}
              disabled={!canProceed}
              className="flex-1"
            >
              {currentStep === questions.length - 1 ? "Ver Resultado" : "Próxima"}
              <ArrowRight className="ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
};
