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
  const { user, session } = useAuth();
  const [referralCode, setReferralCode] = useState<ReferralCode | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReferralCode = useCallback(async () => {
    // Check both user and session to ensure valid authentication
    if (!user || !session?.access_token) {
      setReferralCode(null);
      return;
    }

    try {
      const { data, error: fnError } = await supabase.functions.invoke("process-referral", {
        body: { action: "get_referral_code", user_id: user.id },
      });

      if (fnError) {
        // Handle 401 errors gracefully (user logged out)
        if (fnError.message?.includes('401') || fnError.message?.includes('Invalid')) {
          setReferralCode(null);
          return;
        }
        throw fnError;
      }
      if (data?.success) {
        setReferralCode(data.data);
      } else if (data?.error) {
        // Handle business logic errors gracefully
        console.warn("Referral code fetch returned error:", data.error);
        setReferralCode(null);
      }
    } catch (err) {
      console.error("Error fetching referral code:", err);
      setError("Failed to load referral code");
    }
  }, [user, session]);

  const fetchReferrals = useCallback(async () => {
    // Check both user and session to ensure valid authentication
    if (!user || !session?.access_token) {
      setReferrals([]);
      return;
    }

    try {
      const { data, error: fnError } = await supabase.functions.invoke("process-referral", {
        body: { action: "get_referrals", user_id: user.id },
      });

      if (fnError) {
        // Handle 401 errors gracefully (user logged out)
        if (fnError.message?.includes('401') || fnError.message?.includes('Invalid')) {
          setReferrals([]);
          return;
        }
        throw fnError;
      }
      if (data?.success) {
        setReferrals(data.data || []);
      } else if (data?.error) {
        // Handle business logic errors gracefully
        console.warn("Referrals fetch returned error:", data.error);
        setReferrals([]);
      }
    } catch (err) {
      console.error("Error fetching referrals:", err);
      setError("Failed to load referrals");
    }
  }, [user, session]);

  useEffect(() => {
    const loadData = async () => {
      // Clear data and stop loading if no valid session
      if (!user || !session?.access_token) {
        setReferralCode(null);
        setReferrals([]);
        setIsLoading(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      await Promise.all([fetchReferralCode(), fetchReferrals()]);
      setIsLoading(false);
    };

    loadData();
  }, [user, session, fetchReferralCode, fetchReferrals]);

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
