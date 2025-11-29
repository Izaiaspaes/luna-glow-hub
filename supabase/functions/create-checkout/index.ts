import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    logStep("Function started");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      logStep("ERROR: No authorization header", { headers: Object.fromEntries(req.headers.entries()) });
      throw new Error("No authorization header provided");
    }
    
    const token = authHeader.replace("Bearer ", "");
    logStep("Attempting to get user with token");
    const { data, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError) {
      logStep("ERROR: Failed to get user", { error: userError });
      throw new Error(`Failed to get user: ${userError.message}`);
    }
    
    const user = data.user;
    if (!user?.email) {
      logStep("ERROR: User not authenticated or no email", { user: user });
      throw new Error("User not authenticated or email not available");
    }
    logStep("User authenticated", { userId: user.id, email: user.email });

    const { priceId, coupon_code } = await req.json();
    if (!priceId) throw new Error("Price ID is required");
    logStep("Request data received", { priceId, hasCoupon: !!coupon_code });

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", { apiVersion: "2025-08-27.basil" });
    
    // Validate coupon if provided
    let stripeCouponId = undefined;
    if (coupon_code) {
      logStep("Validating coupon", { code: coupon_code });
      
      const { data: coupon, error: couponError } = await supabaseClient
        .from('discount_coupons')
        .select('*')
        .eq('code', coupon_code.toUpperCase())
        .eq('is_active', true)
        .single();

      if (couponError || !coupon) {
        logStep("ERROR: Invalid coupon", { error: couponError });
        throw new Error("Cupom inválido ou expirado");
      }

      // Check coupon validity
      const now = new Date();
      const validFrom = new Date(coupon.valid_from);
      const validUntil = new Date(coupon.valid_until);
      
      if (now < validFrom || now > validUntil) {
        logStep("ERROR: Coupon expired", { validFrom, validUntil, now });
        throw new Error("Cupom expirado");
      }
      
      if (coupon.current_uses >= coupon.max_uses) {
        logStep("ERROR: Coupon max uses reached", { current: coupon.current_uses, max: coupon.max_uses });
        throw new Error("Cupom atingiu o limite de usos");
      }

      // Create or retrieve Stripe coupon
      try {
        const existingCoupon = await stripe.coupons.retrieve(coupon_code.toUpperCase());
        stripeCouponId = existingCoupon.id;
        logStep("Existing Stripe coupon found", { couponId: stripeCouponId });
      } catch {
        logStep("Creating new Stripe coupon");
        const stripeCoupon = await stripe.coupons.create({
          id: coupon_code.toUpperCase(),
          [coupon.discount_type === 'percentage' ? 'percent_off' : 'amount_off']: 
            coupon.discount_type === 'percentage' 
              ? coupon.discount_value 
              : Math.round(coupon.discount_value * 100),
          currency: coupon.discount_type === 'fixed_amount' ? 'brl' : undefined,
          duration: 'once',
        });
        stripeCouponId = stripeCoupon.id;
        logStep("Stripe coupon created", { couponId: stripeCouponId });
      }

      // Increment coupon usage
      await supabaseClient
        .from('discount_coupons')
        .update({ current_uses: coupon.current_uses + 1 })
        .eq('id', coupon.id);
      logStep("Coupon usage incremented");
    }
    
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing customer found", { customerId });
    } else {
      logStep("Creating new customer");
    }

    const origin = req.headers.get("origin") || "http://localhost:8080";
    
    // Explicitly set payment method types to card only
    // This avoids errors when no default payment methods are configured in Stripe
    const paymentMethodTypes: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] = ["card"];
    logStep("Creating checkout session", { paymentMethodTypes });
    
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      payment_method_types: paymentMethodTypes,
      discounts: stripeCouponId ? [{ coupon: stripeCouponId }] : undefined,
      success_url: `${origin}/pricing/success`,
      cancel_url: `${origin}/pricing?canceled=true`,
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-checkout", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
