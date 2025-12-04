import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[PROCESS-REFERRAL] ${step}${detailsStr}`);
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

  try {
    // Extract and verify the authenticated user from JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      logStep("ERROR: Missing authorization header");
      return new Response(JSON.stringify({ error: "Missing authorization header" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user: authUser }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !authUser) {
      logStep("ERROR: Invalid or expired token", { error: authError?.message });
      return new Response(JSON.stringify({ error: "Invalid or expired token" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    logStep("User authenticated", { authUserId: authUser.id });

    const { action, referral_code, user_id, email } = await req.json();
    logStep("Processing referral action", { action, referral_code, user_id });

    // Validate that the user_id in the request matches the authenticated user
    if (user_id && user_id !== authUser.id) {
      logStep("ERROR: User ID mismatch - potential unauthorized access attempt", { 
        requestedUserId: user_id, 
        authenticatedUserId: authUser.id 
      });
      return new Response(JSON.stringify({ error: "Unauthorized: User ID mismatch" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 403,
      });
    }

    // Use the authenticated user's ID for all operations
    const validatedUserId = authUser.id;

    if (action === "register_referral") {
      // When a user signs up with a referral code
      if (!referral_code) {
        throw new Error("Missing referral_code");
      }

      // Find the referrer by code
      const { data: referrerCodeData, error: codeError } = await supabaseAdmin
        .from("user_referral_codes")
        .select("*")
        .eq("referral_code", referral_code.toUpperCase())
        .single();

      if (codeError || !referrerCodeData) {
        logStep("Invalid referral code", { referral_code });
        return new Response(JSON.stringify({ success: false, error: "Invalid referral code" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }

      // Don't allow self-referral
      if (referrerCodeData.user_id === validatedUserId) {
        logStep("Self-referral attempted");
        return new Response(JSON.stringify({ success: false, error: "Cannot refer yourself" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }

      // Check if already referred
      const { data: existingReferral } = await supabaseAdmin
        .from("referrals")
        .select("id")
        .eq("referred_user_id", validatedUserId)
        .single();

      if (existingReferral) {
        logStep("User already referred");
        return new Response(JSON.stringify({ success: false, error: "User already referred" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }

      // Create referral record
      const { error: insertError } = await supabaseAdmin
        .from("referrals")
        .insert({
          referrer_user_id: referrerCodeData.user_id,
          referred_user_id: validatedUserId,
          referral_code: referral_code.toUpperCase(),
          referred_email: email || authUser.email,
          status: "signed_up",
        });

      if (insertError) throw insertError;

      // Update referrer's stats
      await supabaseAdmin
        .from("user_referral_codes")
        .update({ 
          total_referrals: referrerCodeData.total_referrals + 1,
          updated_at: new Date().toISOString()
        })
        .eq("user_id", referrerCodeData.user_id);

      logStep("Referral registered successfully");
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });

    } else if (action === "mark_subscribed") {
      // When referred user subscribes
      const now = new Date();
      const eligibleDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

      const { error: updateError } = await supabaseAdmin
        .from("referrals")
        .update({
          status: "subscribed",
          referred_subscribed_at: now.toISOString(),
          reward_eligible_at: eligibleDate.toISOString(),
        })
        .eq("referred_user_id", validatedUserId)
        .eq("status", "signed_up");

      if (updateError) throw updateError;

      logStep("Referral marked as subscribed", { user_id: validatedUserId, eligible_at: eligibleDate });
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });

    } else if (action === "get_referral_code") {
      // Get or generate user's referral code
      // Check if user already has a code
      const { data: existingCode } = await supabaseAdmin
        .from("user_referral_codes")
        .select("*")
        .eq("user_id", validatedUserId)
        .single();

      if (existingCode) {
        logStep("Returning existing code", { code: existingCode.referral_code });
        return new Response(JSON.stringify({ success: true, data: existingCode }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      // Generate new code
      const { data: newCode, error: genError } = await supabaseAdmin
        .rpc("generate_referral_code");

      if (genError) throw genError;

      const { data: insertedCode, error: insertError } = await supabaseAdmin
        .from("user_referral_codes")
        .insert({
          user_id: validatedUserId,
          referral_code: newCode,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      logStep("Generated new code", { code: newCode });
      return new Response(JSON.stringify({ success: true, data: insertedCode }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });

    } else if (action === "get_referrals") {
      // Get user's referrals list
      const { data: referrals, error } = await supabaseAdmin
        .from("referrals")
        .select("*")
        .eq("referrer_user_id", validatedUserId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      logStep("Returning referrals", { count: referrals?.length });
      return new Response(JSON.stringify({ success: true, data: referrals }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    throw new Error("Invalid action");

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
