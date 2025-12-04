import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-REFERRAL-REWARDS] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2025-08-27.basil",
  });

  try {
    logStep("Starting referral rewards check");

    // Find referrals that are eligible for reward (30 days passed and referred user still subscribed)
    const now = new Date().toISOString();
    
    const { data: eligibleReferrals, error: fetchError } = await supabaseAdmin
      .from("referrals")
      .select(`
        *,
        referrer:referrer_user_id (
          id,
          email:user_id
        )
      `)
      .eq("status", "subscribed")
      .lte("reward_eligible_at", now)
      .eq("reward_applied", false);

    if (fetchError) throw fetchError;

    logStep("Found eligible referrals", { count: eligibleReferrals?.length || 0 });

    if (!eligibleReferrals || eligibleReferrals.length === 0) {
      return new Response(JSON.stringify({ success: true, processed: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    let processedCount = 0;

    for (const referral of eligibleReferrals) {
      try {
        // Check if referred user still has active subscription
        const { data: referredProfile } = await supabaseAdmin
          .from("profiles")
          .select("subscription_plan")
          .eq("user_id", referral.referred_user_id)
          .single();

        if (!referredProfile || referredProfile.subscription_plan === "free") {
          // Referred user no longer subscribed, mark as expired
          await supabaseAdmin
            .from("referrals")
            .update({ status: "expired" })
            .eq("id", referral.id);
          
          logStep("Referral expired - referred user unsubscribed", { referralId: referral.id });
          continue;
        }

        // Get referrer's email from auth.users
        const { data: { user: referrerUser } } = await supabaseAdmin.auth.admin.getUserById(
          referral.referrer_user_id
        );

        if (!referrerUser?.email) {
          logStep("Could not find referrer email", { referrerId: referral.referrer_user_id });
          continue;
        }

        // Find or create Stripe customer for referrer
        const customers = await stripe.customers.list({ 
          email: referrerUser.email, 
          limit: 1 
        });

        if (customers.data.length === 0) {
          logStep("Referrer not a Stripe customer yet", { email: referrerUser.email });
          continue;
        }

        const customerId = customers.data[0].id;

        // Check if referrer has an active subscription
        const subscriptions = await stripe.subscriptions.list({
          customer: customerId,
          status: "active",
          limit: 1,
        });

        if (subscriptions.data.length === 0) {
          logStep("Referrer has no active subscription", { customerId });
          continue;
        }

        const subscription = subscriptions.data[0];

        // Create a 10% discount coupon for the referrer
        const coupon = await stripe.coupons.create({
          percent_off: 10,
          duration: "once",
          name: `Referral Reward - 10% off`,
          metadata: {
            referral_id: referral.id,
            referrer_user_id: referral.referrer_user_id,
          },
        });

        // Apply the coupon to the next invoice
        await stripe.subscriptions.update(subscription.id, {
          coupon: coupon.id,
        });

        // Update referral record
        await supabaseAdmin
          .from("referrals")
          .update({
            status: "rewarded",
            reward_applied: true,
            reward_applied_at: new Date().toISOString(),
            stripe_coupon_id: coupon.id,
          })
          .eq("id", referral.id);

        // Update referrer's stats - fetch current values first
        const { data: currentStats } = await supabaseAdmin
          .from("user_referral_codes")
          .select("successful_referrals, rewards_earned")
          .eq("user_id", referral.referrer_user_id)
          .single();

        if (currentStats) {
          await supabaseAdmin
            .from("user_referral_codes")
            .update({
              successful_referrals: currentStats.successful_referrals + 1,
              rewards_earned: currentStats.rewards_earned + 1,
            })
            .eq("user_id", referral.referrer_user_id);
        }


        logStep("Applied reward successfully", { 
          referralId: referral.id, 
          couponId: coupon.id,
          referrerEmail: referrerUser.email
        });

        processedCount++;

      } catch (err) {
        logStep("Error processing referral", { 
          referralId: referral.id, 
          error: err instanceof Error ? err.message : String(err) 
        });
      }
    }

    logStep("Completed processing", { processedCount });

    return new Response(JSON.stringify({ success: true, processed: processedCount }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
