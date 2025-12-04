import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface ReferralCode {
  id: string;
  user_id: string;
  referral_code: string;
  total_referrals: number;
  successful_referrals: number;
  rewards_earned: number;
  created_at: string;
}

interface Referral {
  id: string;
  referrer_user_id: string;
  referred_user_id: string | null;
  referral_code: string;
  referred_email: string | null;
  status: string;
  referred_subscribed_at: string | null;
  reward_eligible_at: string | null;
  reward_applied: boolean;
  reward_applied_at: string | null;
  created_at: string;
}

export const useReferral = () => {
  const { user } = useAuth();
  const [referralCode, setReferralCode] = useState<ReferralCode | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReferralCode = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error: fnError } = await supabase.functions.invoke("process-referral", {
        body: { action: "get_referral_code", user_id: user.id },
      });

      if (fnError) throw fnError;
      if (data.success) {
        setReferralCode(data.data);
      }
    } catch (err) {
      console.error("Error fetching referral code:", err);
      setError("Failed to load referral code");
    }
  }, [user]);

  const fetchReferrals = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error: fnError } = await supabase.functions.invoke("process-referral", {
        body: { action: "get_referrals", user_id: user.id },
      });

      if (fnError) throw fnError;
      if (data.success) {
        setReferrals(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching referrals:", err);
      setError("Failed to load referrals");
    }
  }, [user]);

  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      await Promise.all([fetchReferralCode(), fetchReferrals()]);
      setIsLoading(false);
    };

    loadData();
  }, [user, fetchReferralCode, fetchReferrals]);

  const getReferralLink = () => {
    if (!referralCode) return "";
    const baseUrl = window.location.origin;
    return `${baseUrl}/onboarding?ref=${referralCode.referral_code}`;
  };

  const copyReferralLink = async () => {
    const link = getReferralLink();
    if (link) {
      await navigator.clipboard.writeText(link);
      return true;
    }
    return false;
  };

  const getStats = () => {
    const pending = referrals.filter(r => r.status === "signed_up" || r.status === "subscribed").length;
    const completed = referrals.filter(r => r.status === "eligible" || r.status === "rewarded").length;
    const rewarded = referrals.filter(r => r.status === "rewarded").length;

    return {
      total: referralCode?.total_referrals || 0,
      pending,
      completed,
      rewarded,
    };
  };

  return {
    referralCode,
    referrals,
    isLoading,
    error,
    getReferralLink,
    copyReferralLink,
    getStats,
    refresh: () => Promise.all([fetchReferralCode(), fetchReferrals()]),
  };
};
