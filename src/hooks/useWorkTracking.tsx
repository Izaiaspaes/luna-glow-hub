import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface WorkTrackingData {
  id?: string;
  user_id?: string;
  work_date: string;
  routine_type: 'fixed' | 'variable' | 'shift';
  hours_worked: number;
  shift_type?: 'day' | 'night' | 'mixed' | 'off';
  workload_level: 'light' | 'moderate' | 'heavy' | 'exhausting';
  mood_impact_level: 'low' | 'medium' | 'high' | 'very_high';
  daily_message?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

// Automatic classification logic
export const calculateWorkloadMetrics = (
  hoursWorked: number,
  shiftType?: 'day' | 'night' | 'mixed' | 'off'
): {
  workloadLevel: 'light' | 'moderate' | 'heavy' | 'exhausting';
  moodImpactLevel: 'low' | 'medium' | 'high' | 'very_high';
  dailyMessage: string;
} => {
  let workloadLevel: 'light' | 'moderate' | 'heavy' | 'exhausting';
  let moodImpactLevel: 'low' | 'medium' | 'high' | 'very_high';
  let dailyMessage: string;

  // Base classification by hours
  if (hoursWorked <= 6) {
    workloadLevel = 'light';
    moodImpactLevel = 'low';
    dailyMessage = "Hoje sua carga de trabalho foi leve. Que tal aproveitar e fazer algo que você ama, só por você? 💜";
  } else if (hoursWorked <= 8) {
    workloadLevel = 'moderate';
    moodImpactLevel = 'medium';
    dailyMessage = "Você teve um dia de trabalho moderado. Lembre-se de um pequeno ritual de autocuidado (banho mais demorado, skincare, chá, respiração).";
  } else if (hoursWorked <= 12) {
    workloadLevel = 'heavy';
    moodImpactLevel = 'high';
    dailyMessage = "Dia puxado, hein? Sua carga de trabalho foi alta hoje. Seu corpo e seu humor podem sentir isso. Sugestão: desacelera antes de dormir, evite telas e faça algo relaxante.";
  } else {
    workloadLevel = 'exhausting';
    moodImpactLevel = 'very_high';
    dailyMessage = "Plantão/carga exaustiva detectada. Seu humor pode oscilar mais depois de dias assim. Priorize descanso, hidratação e gentileza consigo mesma. Você não precisa render 100% em tudo após um dia assim.";
  }

  // Add weight for night/mixed shifts
  if (shiftType === 'night' || shiftType === 'mixed') {
    if (moodImpactLevel === 'low') moodImpactLevel = 'medium';
    else if (moodImpactLevel === 'medium') moodImpactLevel = 'high';
    else if (moodImpactLevel === 'high') moodImpactLevel = 'very_high';

    if (workloadLevel === 'light') workloadLevel = 'moderate';
    else if (workloadLevel === 'moderate') workloadLevel = 'heavy';
  }

  return { workloadLevel, moodImpactLevel, dailyMessage };
};

export function useWorkTracking(selectedDate?: Date) {
  const { user } = useAuth();
  const [workData, setWorkData] = useState<WorkTrackingData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadWorkData();
    } else {
      setWorkData([]);
      setLoading(false);
    }
  }, [user, selectedDate?.toISOString().split('T')[0]]);

  const loadWorkData = async () => {
    if (!user) return;

    try {
      let query = supabase
        .from("work_tracking")
        .select("*")
        .eq("user_id", user.id)
        .order("work_date", { ascending: false });

      if (selectedDate) {
        const dateStr = selectedDate.toISOString().split('T')[0];
        query = query.eq("work_date", dateStr);
      }

      const { data, error } = await query;

      if (error) throw error;
      setWorkData((data || []) as WorkTrackingData[]);
    } catch (error) {
      console.error("Error loading work data:", error);
      toast.error("Erro ao carregar dados de trabalho");
    } finally {
      setLoading(false);
    }
  };

  const saveWorkData = async (data: Partial<WorkTrackingData>) => {
    if (!user) return { error: new Error("No user") };

    try {
      // Calculate automatic metrics
      const metrics = calculateWorkloadMetrics(
        data.hours_worked || 0,
        data.shift_type
      );

      const updateData = {
        ...data,
        user_id: user.id,
        workload_level: metrics.workloadLevel,
        mood_impact_level: metrics.moodImpactLevel,
        daily_message: metrics.dailyMessage,
      };

      const { data: savedData, error } = await supabase
        .from("work_tracking")
        .upsert(updateData as any, { onConflict: 'user_id,work_date' })
        .select()
        .single();

      if (error) throw error;

      await loadWorkData();
      toast.success("Dados de trabalho salvos com sucesso!");
      return { data: savedData, error: null };
    } catch (error: any) {
      console.error("Error saving work data:", error);
      toast.error("Erro ao salvar dados: " + error.message);
      return { data: null, error };
    }
  };

  const getWeeklySummary = async () => {
    if (!user) return null;

    try {
      const today = new Date();
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);

      const { data, error } = await supabase
        .from("work_tracking")
        .select("*")
        .eq("user_id", user.id)
        .gte("work_date", weekAgo.toISOString().split('T')[0])
        .lte("work_date", today.toISOString().split('T')[0]);

      if (error) throw error;

      if (!data || data.length === 0) return null;

      const totalHours = data.reduce((sum, day) => sum + Number(day.hours_worked), 0);
      const avgHours = totalHours / data.length;

      const workloadDistribution = {
        light: data.filter(d => d.workload_level === 'light').length,
        moderate: data.filter(d => d.workload_level === 'moderate').length,
        heavy: data.filter(d => d.workload_level === 'heavy').length,
        exhausting: data.filter(d => d.workload_level === 'exhausting').length,
      };

      return {
        totalHours: totalHours.toFixed(1),
        avgHours: avgHours.toFixed(1),
        workloadDistribution,
        totalDays: data.length,
      };
    } catch (error) {
      console.error("Error getting weekly summary:", error);
      return null;
    }
  };

  return {
    workData,
    loading,
    saveWorkData,
    refreshWorkData: loadWorkData,
    getWeeklySummary,
  };
}
