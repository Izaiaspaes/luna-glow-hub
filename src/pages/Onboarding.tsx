import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboarding, OnboardingData } from "@/hooks/useOnboarding";
import { OnboardingStep1 } from "@/components/onboarding/OnboardingStep1";
import { OnboardingStep2 } from "@/components/onboarding/OnboardingStep2";
import { OnboardingStep3 } from "@/components/onboarding/OnboardingStep3";
import { OnboardingStep4 } from "@/components/onboarding/OnboardingStep4";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export default function Onboarding() {
  const navigate = useNavigate();
  const { onboardingData, saveOnboardingData, autoSaveOnboardingData } = useOnboarding();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>(onboardingData || {});
  const [loading, setLoading] = useState(false);

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = async (stepData: Partial<OnboardingData>) => {
    const updatedData = { ...formData, ...stepData };
    setFormData(updatedData);
    
    // Save progress
    await saveOnboardingData(updatedData, false);
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleAutoSave = (stepData: Partial<OnboardingData>) => {
    const updatedData = { ...formData, ...stepData };
    setFormData(updatedData);
    autoSaveOnboardingData(updatedData);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async (stepData: Partial<OnboardingData>) => {
    setLoading(true);
    const finalData = { ...formData, ...stepData };
    
    const { error } = await saveOnboardingData(finalData, true);
    
    if (!error) {
      toast.success("Cadastro concluído com sucesso!");
      navigate("/dashboard");
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-8 space-y-4">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Bem-vinda!</h1>
            <p className="text-muted-foreground">
              Vamos conhecer você melhor para personalizar sua experiência
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Etapa {currentStep} de {totalSteps}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            {currentStep === 1 && (
              <OnboardingStep1 
                data={formData} 
                onNext={handleNext}
                onAutoSave={handleAutoSave}
              />
            )}
            {currentStep === 2 && (
              <OnboardingStep2 
                data={formData} 
                onNext={handleNext} 
                onBack={handleBack}
                onAutoSave={handleAutoSave}
              />
            )}
            {currentStep === 3 && (
              <OnboardingStep3 
                data={formData} 
                onNext={handleNext} 
                onBack={handleBack}
                onAutoSave={handleAutoSave}
              />
            )}
            {currentStep === 4 && (
              <OnboardingStep4
                data={formData}
                onComplete={handleComplete}
                onBack={handleBack}
                loading={loading}
                onAutoSave={handleAutoSave}
              />
            )}
          </CardContent>
        </Card>
      </div>
      
      <WhatsAppButton />
    </div>
  );
}
