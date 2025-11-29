import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "@/hooks/use-toast";

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  preferred_name?: string | null;
  avatar_url: string | null;
  phone: string | null;
  theme: string | null;
  subscription_plan: string | null;
  privacy_mode: boolean | null;
  encryption_enabled: boolean | null;
  tour_completed: boolean | null;
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (profileError) throw profileError;

      // Fetch preferred_name from onboarding data
      const { data: onboardingData } = await supabase
        .from("user_onboarding_data")
        .select("preferred_name")
        .eq("user_id", user.id)
        .maybeSingle();

      setProfile({
        ...profileData,
        preferred_name: onboardingData?.preferred_name || null,
      });
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error("No user") };

    try {
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      toast({
        title: "Perfil atualizado",
        description: "Suas alterações foram salvas com sucesso.",
      });

      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  return {
    profile,
    loading,
    updateProfile,
    refreshProfile: loadProfile,
  };
}
