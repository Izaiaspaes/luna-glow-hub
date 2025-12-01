import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Gift, Sparkles, Crown, Check, ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NavLink } from "@/components/NavLink";

interface Question {
  id: string;
  weight: number;
}

export const PlanCalculator = () => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [showResult, setShowResult] = useState(false);

  const questions: Question[] = [
    { id: "aiRecommendations", weight: 10 },
    { id: "womenDiary", weight: 10 },
    { id: "sosFeminino", weight: 10 },
    { id: "lunaSense", weight: 15 },
    { id: "beautyAnalysis", weight: 15 },
    { id: "virtualCloset", weight: 15 },
    { id: "unlimitedPlans", weight: 10 },
    { id: "prioritySupport", weight: 5 },
  ];

  const calculateScore = () => {
    return questions.reduce((total, question) => {
      return total + (answers[question.id] ? question.weight : 0);
    }, 0);
  };

  const getSuggestedPlan = () => {
    const score = calculateScore();
    if (score >= 40) return "premium_plus";
    if (score >= 15) return "premium";
    return "free";
  };

  const handleAnswer = (questionId: string, value: boolean) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResult(true);
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
    setShowResult(false);
  };

  const progress = ((currentStep + 1) / questions.length) * 100;
  const currentQuestion = questions[currentStep];

  const planDetails = {
    free: {
      name: "Free",
      icon: Gift,
      color: "luna-blue",
      gradient: "from-luna-blue/20 to-transparent",
      price: t("planCalculator.plans.free.price"),
      features: [
        t("planCalculator.plans.free.feature1"),
        t("planCalculator.plans.free.feature2"),
        t("planCalculator.plans.free.feature3"),
      ],
    },
    premium: {
      name: "Premium",
      icon: Sparkles,
      color: "luna-purple",
      gradient: "from-luna-purple/20 to-transparent",
      price: t("planCalculator.plans.premium.price"),
      features: [
        t("planCalculator.plans.premium.feature1"),
        t("planCalculator.plans.premium.feature2"),
        t("planCalculator.plans.premium.feature3"),
        t("planCalculator.plans.premium.feature4"),
      ],
    },
    premium_plus: {
      name: "Premium Plus",
      icon: Crown,
      color: "luna-pink",
      gradient: "from-luna-pink/20 to-transparent",
      price: t("planCalculator.plans.premiumPlus.price"),
      features: [
        t("planCalculator.plans.premiumPlus.feature1"),
        t("planCalculator.plans.premiumPlus.feature2"),
        t("planCalculator.plans.premiumPlus.feature3"),
        t("planCalculator.plans.premiumPlus.feature4"),
        t("planCalculator.plans.premiumPlus.feature5"),
      ],
    },
  };

  if (showResult) {
    const suggestedPlan = getSuggestedPlan();
    const plan = planDetails[suggestedPlan];
    const Icon = plan.icon;

    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="p-8 md:p-12 border-2">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-4">
                  <Sparkles className="h-4 w-4" />
                  <span>{t("planCalculator.result.badge")}</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold mb-4">
                  {t("planCalculator.result.title")}
                </h3>
                <p className="text-muted-foreground text-lg">
                  {t("planCalculator.result.subtitle")}
                </p>
              </div>

              <Card className={`relative overflow-hidden border-2 border-primary bg-gradient-to-br ${plan.gradient}`}>
                <div className="absolute top-0 left-0 right-0 bg-gradient-colorful text-white text-sm font-bold py-2 text-center">
                  {t("planCalculator.result.recommended")}
                </div>
                <div className="p-8 pt-16">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className={`p-3 rounded-xl bg-${plan.color}`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="text-3xl font-bold">{plan.name}</h4>
                  </div>
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-primary">{plan.price}</div>
                    {plan.price !== t("planCalculator.plans.free.price") && (
                      <div className="text-muted-foreground">{t("planCalculator.perMonth")}</div>
                    )}
                  </div>
                  <div className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-luna-green mt-0.5 flex-shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <NavLink to="/auth" className="flex-1">
                      <Button variant="colorful" size="lg" className="w-full">
                        {t("planCalculator.result.cta")}
                      </Button>
                    </NavLink>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleReset}
                      className="flex-1"
                    >
                      {t("planCalculator.result.restart")}
                    </Button>
                  </div>
                </div>
              </Card>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              <span>{t("planCalculator.badge")}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t("planCalculator.title")}{" "}
              <span className="bg-gradient-colorful bg-clip-text text-transparent">
                {t("planCalculator.titleHighlight")}
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              {t("planCalculator.subtitle")}
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                {t("planCalculator.question")} {currentStep + 1} {t("planCalculator.of")} {questions.length}
              </span>
              <span className="text-sm font-medium text-primary">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Card */}
          <Card className="p-8 md:p-12 border-2 animate-fade-in">
            <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              {t(`planCalculator.questions.${currentQuestion.id}`)}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <Button
                variant={answers[currentQuestion.id] === true ? "colorful" : "outline"}
                size="lg"
                onClick={() => handleAnswer(currentQuestion.id, true)}
                className="h-20 text-lg"
              >
                {t("planCalculator.yes")}
              </Button>
              <Button
                variant={answers[currentQuestion.id] === false ? "colorful" : "outline"}
                size="lg"
                onClick={() => handleAnswer(currentQuestion.id, false)}
                className="h-20 text-lg"
              >
                {t("planCalculator.no")}
              </Button>
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t("planCalculator.back")}
              </Button>
              <Button
                variant="default"
                onClick={handleNext}
                disabled={answers[currentQuestion.id] === undefined}
                className="flex-1"
              >
                {currentStep === questions.length - 1
                  ? t("planCalculator.finish")
                  : t("planCalculator.next")}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
