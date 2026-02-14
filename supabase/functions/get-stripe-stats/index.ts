import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Verify admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) throw new Error("Not authenticated");

    const { data: roles } = await supabaseClient
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin");

    if (!roles || roles.length === 0) throw new Error("Not authorized");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY not set");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Get active subscriptions
    const activeSubscriptions = await stripe.subscriptions.list({
      status: "active",
      limit: 100,
    });

    let premiumMonthly = 0;
    let premiumYearly = 0;
    let premiumPlusMonthly = 0;
    let premiumPlusYearly = 0;

    // Known product IDs
    const premiumMonthlyProducts = ["prod_TU4LGK6XvlFPPV"];
    const premiumYearlyProducts = ["prod_TU4LclTaY8G9Y4"];
    const premiumPlusMonthlyProducts = ["prod_Twp9boefTAyYo1"];
    const premiumPlusYearlyProducts = ["prod_Twp94r0yxoNmRg"];

    for (const sub of activeSubscriptions.data) {
      const productId = sub.items.data[0]?.price?.product as string;
      if (premiumMonthlyProducts.includes(productId)) premiumMonthly++;
      else if (premiumYearlyProducts.includes(productId)) premiumYearly++;
      else if (premiumPlusMonthlyProducts.includes(productId)) premiumPlusMonthly++;
      else if (premiumPlusYearlyProducts.includes(productId)) premiumPlusYearly++;
    }

    // If there are more than 100, paginate
    let hasMore = activeSubscriptions.has_more;
    let lastId = activeSubscriptions.data.length > 0
      ? activeSubscriptions.data[activeSubscriptions.data.length - 1].id
      : undefined;

    while (hasMore && lastId) {
      const more = await stripe.subscriptions.list({
        status: "active",
        limit: 100,
        starting_after: lastId,
      });
      for (const sub of more.data) {
        const productId = sub.items.data[0]?.price?.product as string;
        if (premiumMonthlyProducts.includes(productId)) premiumMonthly++;
        else if (premiumYearlyProducts.includes(productId)) premiumYearly++;
        else if (premiumPlusMonthlyProducts.includes(productId)) premiumPlusMonthly++;
        else if (premiumPlusYearlyProducts.includes(productId)) premiumPlusYearly++;
      }
      hasMore = more.has_more;
      lastId = more.data.length > 0 ? more.data[more.data.length - 1].id : undefined;
    }

    const totalActive = premiumMonthly + premiumYearly + premiumPlusMonthly + premiumPlusYearly;

    return new Response(JSON.stringify({
      total_active: totalActive,
      premium_monthly: premiumMonthly,
      premium_yearly: premiumYearly,
      premium_plus_monthly: premiumPlusMonthly,
      premium_plus_yearly: premiumPlusYearly,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
