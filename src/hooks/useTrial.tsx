import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface TrialStatus {
  isTrialActive: boolean;
  trialEndsAt: Date | null;
  trialStartedAt: Date | null;
  trialType: 'automatic' | 'manual' | null;
  daysRemaining: number;
  hasHadTrial: boolean;
}

export function useTrial() {
  const { user, userProfile } = useAuth();
  const [trialStatus, setTrialStatus] = useState<TrialStatus>({
    isTrialActive: false,
    trialEndsAt: null,
    trialStartedAt: null,
    trialType: null,
    daysRemaining: 0,
    hasHadTrial: false,
  });
  const [loading, setLoading] = useState(true);

  const checkTrialStatus = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('trial_started_at, trial_ends_at, trial_type, subscription_plan')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      const now = new Date();
      const trialEndsAt = profile?.trial_ends_at ? new Date(profile.trial_ends_at) : null;
      const trialStartedAt = profile?.trial_started_at ? new Date(profile.trial_started_at) : null;
      const isTrialActive = trialEndsAt ? trialEndsAt > now : false;
      
      let daysRemaining = 0;
      if (trialEndsAt && isTrialActive) {
        daysRemaining = Math.ceil((trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      }

      setTrialStatus({
        isTrialActive,
        trialEndsAt,
        trialStartedAt,
        trialType: profile?.trial_type as 'automatic' | 'manual' | null,
        daysRemaining,
        hasHadTrial: trialStartedAt !== null,
      });
    } catch (error) {
      console.error('Error checking trial status:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    checkTrialStatus();
  }, [checkTrialStatus]);

  // Check if user has premium access (either paid or trial)
  const hasPremiumAccess = useCallback(() => {
    const isPaidPremium = userProfile?.subscription_plan === 'premium' || 
                          userProfile?.subscription_plan === 'premium_plus';
    return isPaidPremium || trialStatus.isTrialActive;
  }, [userProfile, trialStatus.isTrialActive]);

  // Activate trial for current user (manual activation)
  const activateTrial = useCallback(async (days: number = 7) => {
    if (!user) return false;

    try {
      const { data, error } = await supabase.rpc('activate_trial', {
        p_user_id: user.id,
        p_days: days,
        p_type: 'manual'
      });

      if (error) throw error;

      // Log the trial activation
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + days);

      await supabase.from('trial_logs').insert({
        user_id: user.id,
        trial_type: 'manual',
        duration_days: days,
        ends_at: trialEndsAt.toISOString(),
      });

      await checkTrialStatus();
      return true;
    } catch (error) {
      console.error('Error activating trial:', error);
      return false;
    }
  }, [user, checkTrialStatus]);

  return {
    ...trialStatus,
    loading,
    hasPremiumAccess,
    activateTrial,
    refreshTrialStatus: checkTrialStatus,
  };
}
