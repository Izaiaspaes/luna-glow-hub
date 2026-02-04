import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-COMMISSION-ELIGIBILITY] ${step}${detailsStr}`);
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
    logStep("Starting commission eligibility check");

    const now = new Date().toISOString();

    // Buscar comissões pendentes que já passaram a data de elegibilidade
    const { data: eligibleCommissions, error: fetchError } = await supabaseAdmin
      .from("commission_transactions")
      .select("*")
      .eq("status", "pending")
      .lte("eligible_at", now);

    if (fetchError) throw fetchError;

    logStep("Found eligible commissions", { count: eligibleCommissions?.length || 0 });

    if (!eligibleCommissions || eligibleCommissions.length === 0) {
      return new Response(JSON.stringify({ success: true, processed: 0, cancelled: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    let processedCount = 0;
    let cancelledCount = 0;

    for (const commission of eligibleCommissions) {
      try {
        // Verificar se a indicada ainda está assinante
        const { data: referredProfile } = await supabaseAdmin
          .from("profiles")
          .select("subscription_plan")
          .eq("user_id", commission.referred_user_id)
          .single();

        if (!referredProfile || referredProfile.subscription_plan === "free") {
          // Indicada cancelou, comissão não é válida
          await supabaseAdmin
            .from("commission_transactions")
            .update({ status: "cancelled" })
            .eq("id", commission.id);

          // Remover do saldo pendente
          const { data: balance } = await supabaseAdmin
            .from("user_commission_balance")
            .select("*")
            .eq("user_id", commission.user_id)
            .single();

          if (balance) {
            await supabaseAdmin
              .from("user_commission_balance")
              .update({
                pending_balance: Math.max(0, Number(balance.pending_balance) - Number(commission.amount)),
              })
              .eq("user_id", commission.user_id);
          }

          // Atualizar referral como expirado
          if (commission.referral_id) {
            await supabaseAdmin
              .from("referrals")
              .update({ status: "expired" })
              .eq("id", commission.referral_id);
          }

          logStep("Commission cancelled - referred user unsubscribed", { commissionId: commission.id });
          cancelledCount++;
          continue;
        }

        // Mover de pendente para disponível
        await supabaseAdmin
          .from("commission_transactions")
          .update({
            status: "available",
            available_at: now,
          })
          .eq("id", commission.id);

        // Atualizar saldo do usuário
        const { data: balance } = await supabaseAdmin
          .from("user_commission_balance")
          .select("*")
          .eq("user_id", commission.user_id)
          .single();

        if (balance) {
          await supabaseAdmin
            .from("user_commission_balance")
            .update({
              pending_balance: Math.max(0, Number(balance.pending_balance) - Number(commission.amount)),
              available_balance: Number(balance.available_balance) + Number(commission.amount),
              total_earned: Number(balance.total_earned) + Number(commission.amount),
            })
            .eq("user_id", commission.user_id);
        }

        // Atualizar referral como elegível
        if (commission.referral_id) {
          await supabaseAdmin
            .from("referrals")
            .update({ status: "eligible" })
            .eq("id", commission.referral_id);
        }

        logStep("Commission made available", { 
          commissionId: commission.id, 
          amount: commission.amount,
          userId: commission.user_id
        });

        processedCount++;
      } catch (err) {
        logStep("Error processing commission", { 
          commissionId: commission.id, 
          error: err instanceof Error ? err.message : String(err) 
        });
      }
    }

    logStep("Completed processing", { processed: processedCount, cancelled: cancelledCount });

    return new Response(JSON.stringify({ 
      success: true, 
      processed: processedCount,
      cancelled: cancelledCount
    }), {
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
