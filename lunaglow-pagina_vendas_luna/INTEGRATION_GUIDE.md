# 🌙 Luna Glow Landing Page - Guia de Integração

## 📋 Checklist de Arquivos

### Componentes Landing (src/components/landing/)
- [ ] Hero.tsx
- [ ] Features.tsx
- [ ] ServicesHighlight.tsx
- [ ] PlanCalculator.tsx
- [ ] Testimonials.tsx
- [ ] Pricing.tsx
- [ ] TrustSection.tsx
- [ ] FAQ.tsx
- [ ] FinalCTA.tsx
- [ ] ExitIntentPopup.tsx

### Assets (src/assets/)
- [ ] hero-woman.jpg
- [ ] feature-ai.jpg
- [ ] feature-journal.jpg
- [ ] feature-tracking.jpg

### Outros Componentes (src/components/)
- [ ] NavLink.tsx

---

## 🚀 Passo a Passo da Integração

### 1. Preparar o Projeto Destino

No projeto: https://lovable.dev/projects/5614a286-263c-41cd-81ef-3a005d6df553

1. Ative o **Dev Mode** (toggle superior esquerdo)
2. Ative a **edição de código**: `Account Settings → Labs → Enable Code Editing`
3. Crie a estrutura de pastas:
   - `src/components/landing/`
   - `src/assets/` (se não existir)

### 2. Copiar os Componentes

**IMPORTANTE:** Copie cada arquivo na ordem listada abaixo.

---

## 📄 Arquivos Completos

### src/components/NavLink.tsx

```tsx
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const NavLink = ({ href, children, className }: NavLinkProps) => {
  return (
    <Link
      to={href}
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary",
        className
      )}
    >
      {children}
    </Link>
  );
};
```

---

### src/components/landing/Hero.tsx

```tsx
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Shield, Users } from "lucide-react";
import heroImage from "@/assets/hero-woman.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-luna-pink-light/20 via-background to-luna-purple-light/20">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-luna-purple-light/10 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              <Sparkles className="w-4 h-4 mr-2" />
              🎁 Oferta Especial: 15% OFF no primeiro mês
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Transforme seu Bem-Estar
              <span className="block text-primary mt-2">
                com Inteligência Artificial
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
              O único app que combina ciclo menstrual, saúde emocional e bem-estar feminino com análises personalizadas por IA. Seja sua melhor versão todos os dias.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => window.location.href = 'https://lunaglow.com.br/signup'}
              >
                Comece Grátis Agora
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-6"
                onClick={() => window.location.href = '#pricing'}
              >
                Ver Planos Premium
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">100% Privado</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">500+ Mulheres</span>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={heroImage} 
                alt="Luna Glow App" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
            </div>
            
            {/* Floating Card */}
            <div className="absolute bottom-8 left-8 bg-background/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-primary/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Satisfação</p>
                  <p className="text-2xl font-bold">98%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
```

---

### src/components/landing/Features.tsx

```tsx
import { Card } from "@/components/ui/card";
import { Brain, Heart, TrendingUp, Sparkles } from "lucide-react";
import featureAI from "@/assets/feature-ai.jpg";
import featureJournal from "@/assets/feature-journal.jpg";
import featureTracking from "@/assets/feature-tracking.jpg";

const features = [
  {
    icon: Brain,
    title: "IA Personalizada",
    description: "Análises inteligentes baseadas no seu ciclo e humor",
    image: featureAI,
    benefits: ["Insights diários", "Previsões precisas", "Recomendações personalizadas"]
  },
  {
    icon: Heart,
    title: "Diário Emocional",
    description: "Registre suas emoções e descubra padrões",
    image: featureJournal,
    benefits: ["Reflexão guiada", "Histórico completo", "Análise de sentimentos"]
  },
  {
    icon: TrendingUp,
    title: "Tracking Completo",
    description: "Acompanhe ciclo, sintomas e bem-estar em um só lugar",
    image: featureTracking,
    benefits: ["Previsão do ciclo", "Lembretes inteligentes", "Gráficos detalhados"]
  }
];

export const Features = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Funcionalidades que Transformam
          </h2>
          <p className="text-lg text-muted-foreground">
            Tecnologia de ponta para o seu bem-estar feminino
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                  
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
```

---

### src/components/landing/ServicesHighlight.tsx

```tsx
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Heart, 
  Calendar, 
  Bot, 
  Brain,
  ShieldAlert,
  Shirt,
  Fingerprint
} from "lucide-react";

const services = [
  {
    icon: ShieldAlert,
    title: "SOS Feminino",
    description: "Suporte emergencial 24/7 com orientações para situações críticas de saúde feminina",
    badge: "Premium Plus",
    color: "from-red-500/10 to-pink-500/10"
  },
  {
    icon: Fingerprint,
    title: "Análises de Beleza",
    description: "IA analisa sua pele e cabelo para recomendar produtos e rotinas personalizadas",
    badge: "Premium",
    color: "from-purple-500/10 to-pink-500/10"
  },
  {
    icon: Shirt,
    title: "Closet Virtual",
    description: "Organize seu guarda-roupa digital e receba sugestões de looks baseadas no clima e ocasião",
    badge: "Premium Plus",
    color: "from-blue-500/10 to-cyan-500/10"
  },
  {
    icon: Brain,
    title: "Análise de Humor por IA",
    description: "Entenda padrões emocionais e receba insights profundos sobre seu bem-estar mental",
    badge: "Premium",
    color: "from-violet-500/10 to-purple-500/10"
  },
  {
    icon: Heart,
    title: "Coach de Relacionamentos",
    description: "Orientações personalizadas para melhorar comunicação e conexão emocional",
    badge: "Premium Plus",
    color: "from-pink-500/10 to-rose-500/10"
  },
  {
    icon: Calendar,
    title: "Planejamento Hormonal",
    description: "Planeje atividades importantes considerando as fases do seu ciclo para máxima produtividade",
    badge: "Premium",
    color: "from-emerald-500/10 to-teal-500/10"
  },
  {
    icon: Bot,
    title: "Assistente IA 24/7",
    description: "Chatbot inteligente pronto para responder suas dúvidas sobre saúde e bem-estar",
    badge: "Premium",
    color: "from-indigo-500/10 to-blue-500/10"
  },
  {
    icon: Sparkles,
    title: "Ritual Matinal Personalizado",
    description: "Rotina diária adaptada ao seu ciclo, humor e objetivos pessoais",
    badge: "Premium Plus",
    color: "from-amber-500/10 to-yellow-500/10"
  }
];

export const ServicesHighlight = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background via-luna-pink-light/5 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Recursos Premium
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Desbloqueie Todo o Potencial
          </h2>
          <p className="text-lg text-muted-foreground">
            Recursos exclusivos que vão transformar sua rotina de bem-estar
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card 
                key={index}
                className={`p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 bg-gradient-to-br ${service.color}`}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {service.badge}
                    </Badge>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-lg mb-2">{service.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-6">
            Todos esses recursos exclusivos estão disponíveis nos planos Premium e Premium Plus
          </p>
        </div>
      </div>
    </section>
  );
};
```

---

### src/components/landing/PlanCalculator.tsx

```tsx
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Heart, Crown, ArrowRight, ArrowLeft, RotateCcw } from "lucide-react";

type QuestionId = 'usage' | 'features' | 'tracking' | 'ai' | 'support' | 'privacy' | 'budget' | 'commitment' | 'wellness' | 'goals';

interface Question {
  id: QuestionId;
  question: string;
  options: {
    text: string;
    points: {
      free: number;
      premium: number;
      premiumPlus: number;
    };
  }[];
}

const questions: Question[] = [
  {
    id: 'usage',
    question: 'Com que frequência você pretende usar o app?',
    options: [
      { text: 'Ocasionalmente (1-2x por semana)', points: { free: 3, premium: 1, premiumPlus: 0 } },
      { text: 'Regularmente (3-5x por semana)', points: { free: 1, premium: 3, premiumPlus: 2 } },
      { text: 'Diariamente', points: { free: 0, premium: 2, premiumPlus: 4 } },
    ]
  },
  {
    id: 'features',
    question: 'Quais funcionalidades são mais importantes para você?',
    options: [
      { text: 'Apenas tracking de ciclo menstrual', points: { free: 4, premium: 1, premiumPlus: 0 } },
      { text: 'Tracking + análises de humor', points: { free: 1, premium: 3, premiumPlus: 2 } },
      { text: 'Tudo isso + recursos exclusivos de IA', points: { free: 0, premium: 2, premiumPlus: 4 } },
    ]
  },
  {
    id: 'tracking',
    question: 'O que você mais quer acompanhar?',
    options: [
      { text: 'Só o ciclo menstrual básico', points: { free: 4, premium: 1, premiumPlus: 0 } },
      { text: 'Ciclo + sintomas e humor', points: { free: 1, premium: 4, premiumPlus: 2 } },
      { text: 'Acompanhamento completo de saúde e bem-estar', points: { free: 0, premium: 2, premiumPlus: 4 } },
    ]
  },
  {
    id: 'ai',
    question: 'Qual a importância de análises por IA para você?',
    options: [
      { text: 'Não preciso de IA', points: { free: 4, premium: 0, premiumPlus: 0 } },
      { text: 'Seria interessante ter insights básicos', points: { free: 1, premium: 4, premiumPlus: 2 } },
      { text: 'Essencial! Quero análises profundas e personalizadas', points: { free: 0, premium: 2, premiumPlus: 4 } },
    ]
  },
  {
    id: 'support',
    question: 'Que tipo de suporte você valoriza?',
    options: [
      { text: 'FAQ e documentação são suficientes', points: { free: 4, premium: 1, premiumPlus: 0 } },
      { text: 'Suporte por email durante horário comercial', points: { free: 1, premium: 3, premiumPlus: 1 } },
      { text: 'Suporte prioritário 24/7 + SOS Feminino', points: { free: 0, premium: 1, premiumPlus: 4 } },
    ]
  },
  {
    id: 'privacy',
    question: 'Quão importantes são recursos de privacidade avançada?',
    options: [
      { text: 'Privacidade básica está ok', points: { free: 3, premium: 2, premiumPlus: 1 } },
      { text: 'Quero privacidade reforçada', points: { free: 1, premium: 3, premiumPlus: 2 } },
      { text: 'Privacidade máxima é essencial', points: { free: 0, premium: 2, premiumPlus: 4 } },
    ]
  },
  {
    id: 'budget',
    question: 'Qual seu orçamento mensal para bem-estar digital?',
    options: [
      { text: 'Prefiro gratuito', points: { free: 4, premium: 0, premiumPlus: 0 } },
      { text: 'Até R$ 30/mês', points: { free: 1, premium: 4, premiumPlus: 1 } },
      { text: 'Até R$ 60/mês para recursos completos', points: { free: 0, premium: 2, premiumPlus: 4 } },
    ]
  },
  {
    id: 'commitment',
    question: 'Por quanto tempo você planeja usar o app?',
    options: [
      { text: 'Só quero testar primeiro', points: { free: 4, premium: 2, premiumPlus: 1 } },
      { text: '3-6 meses', points: { free: 1, premium: 4, premiumPlus: 2 } },
      { text: 'Compromisso de longo prazo (1 ano+)', points: { free: 0, premium: 2, premiumPlus: 4 } },
    ]
  },
  {
    id: 'wellness',
    question: 'Você se interessa por recursos de beleza e estilo?',
    options: [
      { text: 'Não, só saúde básica', points: { free: 3, premium: 2, premiumPlus: 0 } },
      { text: 'Sim, análises de beleza seriam úteis', points: { free: 0, premium: 4, premiumPlus: 2 } },
      { text: 'Sim! Quero closet virtual e análises completas', points: { free: 0, premium: 1, premiumPlus: 4 } },
    ]
  },
  {
    id: 'goals',
    question: 'Qual seu principal objetivo com o Luna Glow?',
    options: [
      { text: 'Apenas não esquecer meu ciclo', points: { free: 4, premium: 1, premiumPlus: 0 } },
      { text: 'Melhorar autoconhecimento e bem-estar', points: { free: 1, premium: 4, premiumPlus: 3 } },
      { text: 'Transformação completa do meu estilo de vida', points: { free: 0, premium: 2, premiumPlus: 4 } },
    ]
  }
];

type PlanType = 'free' | 'premium' | 'premiumPlus';

const planResults = {
  free: {
    name: "Free",
    icon: Heart,
    color: "text-blue-600",
    description: "Perfeito para começar sua jornada de autoconhecimento",
    cta: "Começar Grátis"
  },
  premium: {
    name: "Premium",
    icon: Sparkles,
    color: "text-purple-600",
    description: "Para quem quer análises profundas e recursos avançados",
    cta: "Assinar Premium"
  },
  premiumPlus: {
    name: "Premium Plus",
    icon: Crown,
    color: "text-amber-600",
    description: "A experiência completa com todos os recursos exclusivos",
    cta: "Assinar Premium Plus"
  }
};

export const PlanCalculator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<QuestionId, number>>({} as Record<QuestionId, number>);
  const [result, setResult] = useState<PlanType | null>(null);

  const handleAnswer = (questionId: QuestionId, optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const calculateResult = () => {
    const scores = { free: 0, premium: 0, premiumPlus: 0 };
    
    Object.entries(answers).forEach(([questionId, optionIndex]) => {
      const question = questions.find(q => q.id === questionId);
      if (question && question.options[optionIndex]) {
        const points = question.options[optionIndex].points;
        scores.free += points.free;
        scores.premium += points.premium;
        scores.premiumPlus += points.premiumPlus;
      }
    });

    const maxScore = Math.max(scores.free, scores.premium, scores.premiumPlus);
    
    if (scores.premiumPlus === maxScore) return 'premiumPlus';
    if (scores.premium === maxScore) return 'premium';
    return 'free';
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      const calculatedResult = calculateResult();
      setResult(calculatedResult);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers({} as Record<QuestionId, number>);
    setResult(null);
  };

  const progress = ((currentStep + 1) / questions.length) * 100;
  const currentQuestion = questions[currentStep];
  const hasAnswer = answers[currentQuestion?.id] !== undefined;

  if (result) {
    const plan = planResults[result];
    const Icon = plan.icon;
    
    return (
      <section className="py-20 bg-gradient-to-b from-background to-luna-pink-light/10">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto p-8 text-center space-y-6">
            <Badge className="bg-primary/10 text-primary border-primary/20">
              Resultado da Análise
            </Badge>
            
            <div className="space-y-4">
              <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ${plan.color}`}>
                <Icon className="w-10 h-10" />
              </div>
              
              <h2 className="text-3xl font-bold">
                Plano {plan.name}
              </h2>
              
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                {plan.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button 
                size="lg"
                onClick={() => window.location.href = `https://lunaglow.com.br/signup?plan=${result}`}
              >
                {plan.cta}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={handleReset}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Refazer Teste
              </Button>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-background to-luna-pink-light/10">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Descubra Seu Plano Ideal
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Qual Plano é Perfeito Para Você?
          </h2>
          <p className="text-lg text-muted-foreground">
            Responda 10 perguntas rápidas e descubra qual plano se encaixa melhor nas suas necessidades
          </p>
        </div>

        <Card className="max-w-3xl mx-auto p-8">
          <div className="space-y-8">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Pergunta {currentStep + 1} de {questions.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Question */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-center">
                {currentQuestion.question}
              </h3>

              <RadioGroup
                value={answers[currentQuestion.id]?.toString()}
                onValueChange={(value) => handleAnswer(currentQuestion.id, parseInt(value))}
                className="space-y-4"
              >
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3 border-2 rounded-lg p-4 hover:border-primary/50 transition-colors cursor-pointer">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label 
                      htmlFor={`option-${index}`}
                      className="flex-1 cursor-pointer text-base"
                    >
                      {option.text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={!hasAnswer}
              >
                {currentStep === questions.length - 1 ? 'Ver Resultado' : 'Próxima'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};
```

---

### src/components/landing/Testimonials.tsx

```tsx
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Maria Silva",
    role: "Empresária, 32 anos",
    content: "O Luna Glow mudou completamente como eu entendo meu corpo. As análises de IA são incrivelmente precisas!",
    rating: 5,
    avatar: "/placeholder.svg"
  },
  {
    name: "Ana Costa",
    role: "Designer, 28 anos",
    content: "Nunca imaginei que um app pudesse me ajudar tanto com meu bem-estar emocional. Indispensável!",
    rating: 5,
    avatar: "/placeholder.svg"
  },
  {
    name: "Julia Santos",
    role: "Professora, 35 anos",
    content: "O recurso de SOS Feminino me salvou várias vezes. Vale muito a pena o Premium Plus!",
    rating: 5,
    avatar: "/placeholder.svg"
  }
];

export const Testimonials = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-luna-pink-light/10 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Histórias Reais de Transformação
          </h2>
          <p className="text-lg text-muted-foreground">
            Veja o que nossas usuárias estão dizendo
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 space-y-4 hover:shadow-xl transition-all duration-300">
              <div className="flex gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              
              <p className="text-muted-foreground italic">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center gap-3 pt-4">
                <Avatar>
                  <AvatarImage src={testimonial.avatar} />
                  <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
```

---

### src/components/landing/Pricing.tsx

```tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "R$ 0",
    features: [
      "Tracking de ciclo menstrual básico",
      "Calendário de fertilidade",
      "Lembretes de período",
      "Registro de sintomas básicos",
      "Histórico de 3 meses"
    ],
    cta: "Começar Grátis"
  },
  {
    name: "Premium",
    price: "R$ 29,90",
    originalPrice: "R$ 39,90",
    badge: "Mais Popular",
    popular: true,
    features: [
      "Tudo do Free +",
      "IA personalizada com insights diários",
      "Análises de humor e padrões emocionais",
      "Diário emocional ilimitado",
      "Análises de beleza",
      "Assistente IA 24/7",
      "Planejamento hormonal",
      "Histórico ilimitado",
      "Suporte prioritário"
    ],
    cta: "Assinar Premium"
  },
  {
    name: "Premium Plus",
    price: "R$ 49,90",
    originalPrice: "R$ 69,90",
    badge: "Melhor Custo-Benefício",
    highlight: true,
    features: [
      "Tudo do Premium +",
      "SOS Feminino 24/7",
      "Closet Virtual",
      "Coach de Relacionamentos",
      "Ritual Matinal Personalizado",
      "Análises avançadas de IA",
      "Consultoria mensal com especialista",
      "Comunidade exclusiva",
      "Acesso antecipado a novos recursos"
    ],
    cta: "Assinar Premium Plus"
  },
  {
    name: "Premium Plus Anual",
    price: "R$ 399",
    originalPrice: "R$ 598,80",
    badge: "2 Meses Grátis",
    highlight: true,
    features: [
      "Tudo do Premium Plus +",
      "Economize R$ 199,80 por ano",
      "Equivale a R$ 33,25/mês",
      "SOS Feminino 24/7",
      "Closet Virtual",
      "Coach de Relacionamentos",
      "Ritual Matinal Personalizado",
      "Análises avançadas de IA",
      "Consultoria mensal com especialista",
      "Comunidade exclusiva",
      "Acesso antecipado a novos recursos"
    ],
    cta: "Assinar Anual"
  }
];

export const Pricing = () => {
  return (
    <section id="pricing" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Escolha Seu Plano
          </h2>
          <p className="text-lg text-muted-foreground">
            Invista no seu bem-estar com transparência total
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index}
              className={`p-6 space-y-6 hover:shadow-2xl transition-all duration-300 ${
                plan.highlight ? 'border-primary border-2 relative overflow-hidden' : ''
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -mr-16 -mt-16" />
              )}
              
              <div className="space-y-2 relative">
                {plan.badge && (
                  <Badge className={`${
                    plan.popular ? 'bg-purple-500 hover:bg-purple-600' : 'bg-primary'
                  }`}>
                    {plan.badge}
                  </Badge>
                )}
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.name !== "Premium Plus Anual" && plan.name !== "Free" && (
                    <span className="text-muted-foreground">/mês</span>
                  )}
                  {plan.name === "Premium Plus Anual" && (
                    <span className="text-muted-foreground">/ano</span>
                  )}
                </div>
                {plan.originalPrice && (
                  <p className="text-sm text-muted-foreground line-through">
                    {plan.originalPrice}
                  </p>
                )}
              </div>

              <ul className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
                onClick={() => window.location.href = `https://lunaglow.com.br/signup?plan=${plan.name.toLowerCase().replace(' ', '-')}`}
              >
                {plan.cta}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
```

---

### src/components/landing/TrustSection.tsx

```tsx
import { Shield, Lock, CheckCircle, RefreshCw, FileCheck, Award } from "lucide-react";
import { Card } from "@/components/ui/card";

const trustBadges = [
  {
    icon: RefreshCw,
    title: "7 Dias de Garantia",
    description: "Não gostou? Devolvemos 100% do seu dinheiro, sem perguntas"
  },
  {
    icon: Lock,
    title: "Dados Criptografados",
    description: "Criptografia de ponta a ponta. Seus dados nunca são compartilhados"
  },
  {
    icon: Shield,
    title: "Conformidade LGPD",
    description: "Total conformidade com Lei Geral de Proteção de Dados"
  },
  {
    icon: FileCheck,
    title: "Certificado SSL",
    description: "Conexão segura e protegida em todas as suas interações"
  },
  {
    icon: Award,
    title: "Auditoria Regular",
    description: "Segurança testada e aprovada por especialistas independentes"
  },
  {
    icon: CheckCircle,
    title: "Pagamento Seguro",
    description: "Processamento via plataformas certificadas e reconhecidas"
  }
];

export const TrustSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Sua Confiança é Nossa Prioridade
          </h2>
          <p className="text-lg text-muted-foreground">
            Comprometidos com sua segurança, privacidade e satisfação
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {trustBadges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <Card 
                key={index}
                className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2"
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg">{badge.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {badge.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-luna-pink-light/30 border-2 border-primary/20 rounded-full px-6 py-3">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-semibold">
              Mais de 10.000 mulheres confiam no Luna Glow
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
```

---

### src/components/landing/FAQ.tsx

```tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Como funciona o período de teste gratuito?",
    answer: "Você pode usar todos os recursos básicos gratuitamente, sem limite de tempo. Para testar recursos Premium, oferecemos 7 dias grátis sem compromisso."
  },
  {
    question: "Posso cancelar a qualquer momento?",
    answer: "Sim! Você pode cancelar sua assinatura a qualquer momento, sem taxas ou burocracia. Seu acesso continua até o fim do período pago."
  },
  {
    question: "Meus dados estão seguros?",
    answer: "Absolutamente! Utilizamos criptografia de ponta a ponta e estamos em total conformidade com a LGPD. Seus dados nunca são compartilhados com terceiros."
  },
  {
    question: "Como funciona a garantia de 7 dias?",
    answer: "Se você não ficar satisfeita nos primeiros 7 dias, devolvemos 100% do seu dinheiro. É simples e sem perguntas."
  },
  {
    question: "Posso mudar de plano depois?",
    answer: "Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. O valor é ajustado proporcionalmente."
  },
  {
    question: "O que é o SOS Feminino?",
    answer: "É um recurso exclusivo do Premium Plus que oferece suporte emergencial 24/7 com orientações para situações críticas de saúde feminina."
  }
];

export const FAQ = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-luna-pink-light/5">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-lg text-muted-foreground">
            Tudo o que você precisa saber sobre o Luna Glow
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-background border-2 rounded-lg px-6"
              >
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-semibold">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
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
```

---

### src/components/landing/FinalCTA.tsx

```tsx
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

export const FinalCTA = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/10 via-luna-pink-light/20 to-luna-purple-light/10">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-block bg-primary/10 text-primary border-2 border-primary/20 rounded-full px-6 py-2 text-sm font-semibold">
            ⏰ Oferta por Tempo Limitado
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold">
            Comece Sua Transformação
            <span className="block text-primary mt-2">Hoje Mesmo</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Junte-se a milhares de mulheres que já transformaram seu bem-estar com Luna Glow
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg"
              className="text-lg px-8 py-6"
              onClick={() => window.location.href = 'https://lunaglow.com.br/signup'}
            >
              Começar Grátis Agora
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6"
              onClick={() => window.location.href = '#pricing'}
            >
              Ver Todos os Recursos
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 pt-12 max-w-3xl mx-auto">
            {[
              "7 dias de garantia",
              "Cancele quando quiser",
              "Suporte dedicado"
            ].map((benefit, index) => (
              <div key={index} className="flex items-center justify-center gap-2">
                <Check className="w-5 h-5 text-primary" />
                <span className="font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
```

---

### src/components/landing/ExitIntentPopup.tsx

```tsx
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, X } from "lucide-react";

export const ExitIntentPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        setIsOpen(true);
        setHasShown(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hasShown]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between mb-4">
            <Badge className="bg-primary/10 text-primary border-primary/20">
              <Sparkles className="w-4 h-4 mr-2" />
              Oferta Exclusiva
            </Badge>
          </div>
          <DialogTitle className="text-2xl font-bold">
            Espere! Não Vá Embora 🎁
          </DialogTitle>
          <DialogDescription className="text-base space-y-4 pt-4">
            <p className="text-foreground font-semibold text-lg">
              Ganhe 15% OFF no seu primeiro mês Premium!
            </p>
            <p>
              Use o cupom <span className="font-bold text-primary">PRIMEIRA15</span> e comece sua jornada de transformação com desconto especial.
            </p>
            <div className="bg-luna-pink-light/20 border-2 border-primary/20 rounded-lg p-4 mt-4">
              <p className="font-semibold text-foreground mb-2">
                O que você ganha:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>IA personalizada com insights diários</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Análises de beleza e bem-estar</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Assistente 24/7 para suas dúvidas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>7 dias de garantia total</span>
                </li>
              </ul>
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-3 pt-4">
          <Button
            size="lg"
            className="w-full"
            onClick={() => {
              window.location.href = 'https://lunaglow.com.br/signup?coupon=PRIMEIRA15';
              setIsOpen(false);
            }}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Resgatar 15% OFF Agora
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsOpen(false)}
            className="text-muted-foreground"
          >
            Não, prefiro pagar preço cheio
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
```

---

## 🎨 Verificar Design System

Antes de integrar, verifique se os seguintes tokens estão no arquivo `src/index.css` do projeto destino:

```css
:root {
  --luna-pink-light: /* cor HSL */;
  --luna-purple-light: /* cor HSL */;
  /* outros tokens de cor necessários */
}
```

Se não existirem, adicione-os na seção `:root`.

---

## 📸 Assets/Imagens

Copie as seguintes imagens da pasta `src/assets/`:
1. `hero-woman.jpg`
2. `feature-ai.jpg`
3. `feature-journal.jpg`
4. `feature-tracking.jpg`

---

## 🔗 Integração na Página

Depois de copiar todos os componentes, adicione-os na página desejada (ex: `src/pages/Index.tsx`):

```tsx
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { ServicesHighlight } from "@/components/landing/ServicesHighlight";
import { PlanCalculator } from "@/components/landing/PlanCalculator";
import { Pricing } from "@/components/landing/Pricing";
import { Testimonials } from "@/components/landing/Testimonials";
import { TrustSection } from "@/components/landing/TrustSection";
import { FAQ } from "@/components/landing/FAQ";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { ExitIntentPopup } from "@/components/landing/ExitIntentPopup";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <ServicesHighlight />
      <PlanCalculator />
      <Testimonials />
      <Pricing />
      <TrustSection />
      <FAQ />
      <FinalCTA />
      <ExitIntentPopup />
    </div>
  );
};

export default Index;
```

---

## ✅ Checklist Final

- [ ] Todos os componentes copiados
- [ ] Imagens copiadas para `src/assets/`
- [ ] Design tokens verificados em `src/index.css`
- [ ] Imports adicionados na página
- [ ] Componentes renderizados na ordem correta
- [ ] Testado no navegador

---

## 🚀 Publicação

Após integrar tudo:
1. Clique no botão **Publish** no Lovable
2. Configure o domínio customizado em **Settings → Domains**

---

## 💡 Suporte

Se tiver dúvidas durante a integração, verifique:
- Console do navegador para erros
- Imports corretos dos componentes
- Caminhos das imagens

**Boa sorte com a integração! 🌙✨**
