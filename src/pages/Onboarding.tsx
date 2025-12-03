import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useOnboarding, OnboardingData } from "@/hooks/useOnboarding";
import { OnboardingStep1 } from "@/components/onboarding/OnboardingStep1";
import { OnboardingStep2 } from "@/components/onboarding/OnboardingStep2";
import { OnboardingStep3 } from "@/components/onboarding/OnboardingStep3";
import { OnboardingStep4 } from "@/components/onboarding/OnboardingStep4";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export default function Onboarding() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { onboardingData, saveOnboardingData, autoSaveOnboardingData } = useOnboarding();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>(onboardingData || {});
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // If user is already logged in and has completed onboarding, redirect to dashboard
  useEffect(() => {
    if (user) {
      // User is logged in, skip step 1 and go to step 2
      setCurrentStep(2);
    }
  }, [user]);

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleStep1Next = async (stepData: Partial<OnboardingData> & { email?: string; password?: string }) => {
    const { email, password, ...profileData } = stepData;
    
    // If user is not logged in, create account
    if (!user && email && password) {
      setLoading(true);
      setAuthError(null);
      
      try {
        const redirectUrl = `${window.location.origin}/onboarding`;
        
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              full_name: profileData.full_name,
              preferred_name: profileData.preferred_name,
            }
          }
        });

        if (error) {
          if (error.message.includes("already registered")) {
            setAuthError(t('onboarding.form.emailAlreadyRegistered'));
          } else if (error.message.includes("invalid")) {
            setAuthError(t('onboarding.form.invalidCredentials'));
          } else {
            setAuthError(error.message);
          }
          setLoading(false);
          return;
        }

        if (data.user) {
          // Save profile data
          const updatedData = { ...formData, ...profileData };
          setFormData(updatedData);
          await saveOnboardingData(updatedData, false);
          
          toast.success(t('onboarding.form.accountCreated'));
          setCurrentStep(2);
        }
      } catch (err) {
        setAuthError(t('onboarding.form.accountCreationError'));
      }
      
      setLoading(false);
    } else {
      // User is already logged in, just save profile data
      const updatedData = { ...formData, ...profileData };
      setFormData(updatedData);
      await saveOnboardingData(updatedData, false);
      setCurrentStep(2);
    }
  };

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
    // Don't go back to step 1 if user is logged in
    if (currentStep > 1) {
      if (currentStep === 2 && user) {
        // Can't go back to step 1 if already logged in
        return;
      }
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async (stepData: Partial<OnboardingData>) => {
    setLoading(true);
    const finalData = { ...formData, ...stepData };
    
    const { error } = await saveOnboardingData(finalData, true);
    
    if (!error) {
      toast.success("Cadastro concluído com sucesso!");
      navigate("/onboarding/success");
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-8 space-y-4">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              {currentStep === 1 ? "Bem-vinda à Luna!" : "Personalize sua experiência"}
            </h1>
            <p className="text-muted-foreground">
              {currentStep === 1 
                ? "Crie sua conta e comece sua jornada de bem-estar"
                : "Vamos conhecer você melhor para personalizar sua experiência"
              }
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
                onNext={handleStep1Next}
                onAutoSave={handleAutoSave}
                isLoading={loading}
                authError={authError}
              />
            )}
            {currentStep === 2 && (
              <OnboardingStep2 
                data={formData} 
                onNext={handleNext} 
                onBack={user ? undefined : handleBack}
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
    </div>
  );
}
