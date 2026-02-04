import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CommissionSettings {
  commission_rate: number;
  eligibility_days: number;
  is_active: boolean;
}

export const useCommissionSettings = () => {
  const [settings, setSettings] = useState<CommissionSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from("commission_settings")
          .select("commission_rate, eligibility_days, is_active")
          .eq("is_active", true)
          .single();

        if (error) {
          console.error("Error fetching commission settings:", error);
          // Default fallback
          setSettings({
            commission_rate: 50,
            eligibility_days: 30,
            is_active: true,
          });
        } else {
          setSettings(data);
        }
      } catch (err) {
        console.error("Error:", err);
        setSettings({
          commission_rate: 50,
          eligibility_days: 30,
          is_active: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return {
    commissionRate: settings?.commission_rate ?? 50,
    eligibilityDays: settings?.eligibility_days ?? 30,
    isActive: settings?.is_active ?? true,
    isLoading,
  };
};
