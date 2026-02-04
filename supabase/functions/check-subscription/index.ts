import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    logStep("Authenticating user with token");
    
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      logStep("No customer found, updating unsubscribed state");
      return new Response(JSON.stringify({ subscribed: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });
    const hasActiveSub = subscriptions.data.length > 0;
    let productId = null;
    let subscriptionEnd = null;

    if (hasActiveSub) {
      const subscription = subscriptions.data[0];
      subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
      logStep("Active subscription found", { subscriptionId: subscription.id, endDate: subscriptionEnd });
      productId = subscription.items.data[0].price.product as string;
      logStep("Determined subscription tier", { productId });

      // Check if this user was referred and register commission
      const { data: referral } = await supabaseClient
        .from("referrals")
        .select("*")
        .eq("referred_user_id", user.id)
        .eq("status", "signed_up")
        .single();

      if (referral) {
        logStep("User was referred, registering commission", { referralId: referral.id });
        
        // Get the price amount from Stripe
        const priceId = subscription.items.data[0].price.id;
        const price = await stripe.prices.retrieve(priceId);
        const paymentAmount = (price.unit_amount || 0) / 100; // Convert from cents
        
        const COMMISSION_RATE = 0.50;
        const ELIGIBILITY_DAYS = 30;
        const commissionAmount = paymentAmount * COMMISSION_RATE;
        const eligibleAt = new Date();
        eligibleAt.setDate(eligibleAt.getDate() + ELIGIBILITY_DAYS);

        // Create commission transaction
        await supabaseClient
          .from("commission_transactions")
          .insert({
            user_id: referral.referrer_user_id,
            referral_id: referral.id,
            referred_user_id: user.id,
            amount: commissionAmount,
            currency: price.currency?.toUpperCase() || "BRL",
            status: "pending",
            payment_amount: paymentAmount,
            commission_rate: COMMISSION_RATE,
            eligible_at: eligibleAt.toISOString(),
          });

        // Update or create balance for referrer
        const { data: existingBalance } = await supabaseClient
          .from("user_commission_balance")
          .select("*")
          .eq("user_id", referral.referrer_user_id)
          .single();

        if (existingBalance) {
          await supabaseClient
            .from("user_commission_balance")
            .update({
              pending_balance: Number(existingBalance.pending_balance) + commissionAmount,
            })
            .eq("user_id", referral.referrer_user_id);
        } else {
          await supabaseClient
            .from("user_commission_balance")
            .insert({
              user_id: referral.referrer_user_id,
              pending_balance: commissionAmount,
              available_balance: 0,
              total_earned: 0,
              total_withdrawn: 0,
            });
        }

        // Update referral status
        await supabaseClient
          .from("referrals")
          .update({
            status: "subscribed",
            referred_subscribed_at: new Date().toISOString(),
            reward_eligible_at: eligibleAt.toISOString(),
          })
          .eq("id", referral.id);

        logStep("Commission registered successfully", { 
          commissionAmount,
          eligibleAt: eligibleAt.toISOString()
        });
      }
    } else {
      logStep("No active subscription found");
    }

    return new Response(JSON.stringify({
      subscribed: hasActiveSub,
      product_id: productId,
      subscription_end: subscriptionEnd
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-subscription", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
