import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface SubscriptionStatus {
  subscribed: boolean;
  product_id: string | null;
  subscription_end: string | null;
}

interface UserProfile {
  subscription_plan: string | null;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminChecked, setAdminChecked] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const checkSubscription = async () => {
    if (!session) {
      setSubscriptionStatus({ subscribed: false, product_id: null, subscription_end: null });
      setUserProfile(null);
      return;
    }

    try {
      // Check Stripe subscription
      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) throw error;
      setSubscriptionStatus(data);

      // Also get user profile subscription_plan
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('subscription_plan')
        .eq('user_id', session.user.id)
        .single();

      if (!profileError && profileData) {
        setUserProfile(profileData);
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
      setSubscriptionStatus({ subscribed: false, product_id: null, subscription_end: null });
    }
  };

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Check if user is admin
          setTimeout(async () => {
            const { data } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', session.user.id)
              .eq('role', 'admin');
            
            setIsAdmin(!!data && data.length > 0);
            setAdminChecked(true);
            
            // Check subscription status
            checkSubscription();
          }, 0);
        } else {
          setIsAdmin(false);
          setAdminChecked(true);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Check if user is admin
        const { data } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .eq('role', 'admin');

        setIsAdmin(!!data && data.length > 0);
        
        // Check subscription status
        setTimeout(() => checkSubscription(), 0);
      } else {
        setIsAdmin(false);
      }

      setAdminChecked(true);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    return { error, data };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    user,
    session,
    loading,
    isAdmin,
    adminChecked,
    subscriptionStatus,
    userProfile,
    checkSubscription,
    signUp,
    signIn,
    signOut,
  };
}
