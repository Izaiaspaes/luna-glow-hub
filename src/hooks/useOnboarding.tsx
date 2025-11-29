import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface OnboardingData {
  id?: string;
  user_id?: string;
  
  // Dados básicos
  full_name?: string;
  preferred_name?: string;
  social_name?: string;
  age?: number;
  profession?: string;
  current_city?: string;
  current_country?: string;
  
  // Dados de nascimento
  birth_date?: string;
  birth_time?: string;
  birth_city?: string;
  birth_country?: string;
  birth_coordinates?: any;
  
  // Aparência física
  weight?: number;
  height?: number;
  body_shapes?: string[];
  skin_tone?: string;
  skin_types?: string[];
  eye_color?: string;
  hair_color?: string;
  hair_type?: string;
  hair_length?: string;
  nail_preference?: string;
  
  // Gostos pessoais
  favorite_color?: string;
  hobbies?: string[];
  personal_interests?: string;
  self_love_notes?: string;
  
  // Cuidados pessoais
  current_care_routines?: string[];
  care_improvement_goals?: string[];
  
  // Campos da vida
  most_explored_life_area?: string;
  life_area_to_improve?: string;
  main_app_goal?: string;
  
  // Preferências gerais
  work_routine_type?: string;
  content_preferences?: string[];
  notification_frequency?: string;
  
  completed_at?: string;
}

export function useOnboarding() {
  const { user } = useAuth();
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (user) {
      loadOnboardingData();
    } else {
      setOnboardingData(null);
      setLoading(false);
      setHasCompletedOnboarding(false);
    }
    
    // Cleanup auto-save timer on unmount
    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
    };
  }, [user]);

  const loadOnboardingData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("user_onboarding_data")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      
      setOnboardingData(data);
      setHasCompletedOnboarding(!!data?.completed_at);
    } catch (error) {
      console.error("Error loading onboarding data:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveOnboardingData = async (data: Partial<OnboardingData>, markComplete = false) => {
    if (!user) return { error: new Error("No user") };

    try {
      const updateData = {
        ...data,
        user_id: user.id,
        ...(markComplete && { completed_at: new Date().toISOString() }),
      };

      const { data: savedData, error } = await supabase
        .from("user_onboarding_data")
        .upsert(updateData, { onConflict: 'user_id' })
        .select()
        .single();

      if (error) throw error;

      setOnboardingData(savedData);
      if (markComplete) {
        setHasCompletedOnboarding(true);
      }

      return { data: savedData, error: null };
    } catch (error: any) {
      console.error("Error saving onboarding data:", error);
      toast.error("Erro ao salvar dados: " + error.message);
      return { data: null, error };
    }
  };

  // Auto-save function with debounce
  const autoSaveOnboardingData = (data: Partial<OnboardingData>) => {
    if (!user) return;

    // Clear existing timer
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }

    // Set new timer for auto-save (3 seconds after last change)
    const timer = setTimeout(async () => {
      try {
        const updateData = {
          ...data,
          user_id: user.id,
        };

        await supabase
          .from("user_onboarding_data")
          .upsert(updateData, { onConflict: 'user_id' });

        console.log("Auto-save completed");
      } catch (error) {
        console.error("Auto-save error:", error);
      }
    }, 3000);

    setAutoSaveTimer(timer);
  };

  return {
    onboardingData,
    loading,
    hasCompletedOnboarding,
    saveOnboardingData,
    autoSaveOnboardingData,
    refreshOnboardingData: loadOnboardingData,
  };
}
