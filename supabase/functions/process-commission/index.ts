import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[PROCESS-COMMISSION] ${step}${detailsStr}`);
};

const COMMISSION_RATE = 0.50; // 50% de comissão
const ELIGIBILITY_DAYS = 30; // 30 dias de carência

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
    const { action, referral_id, payment_amount, currency = "BRL", user_id } = await req.json();
    logStep("Processing commission action", { action, referral_id, payment_amount, user_id });

    if (action === "register_commission") {
      // Registrar nova comissão quando indicada assina
      if (!referral_id || !payment_amount) {
        throw new Error("Missing referral_id or payment_amount");
      }

      // Buscar informações do referral
      const { data: referral, error: refError } = await supabaseAdmin
        .from("referrals")
        .select("*")
        .eq("id", referral_id)
        .single();

      if (refError || !referral) {
        throw new Error("Referral not found");
      }

      const commissionAmount = Number(payment_amount) * COMMISSION_RATE;
      const eligibleAt = new Date();
      eligibleAt.setDate(eligibleAt.getDate() + ELIGIBILITY_DAYS);

      // Criar transação de comissão
      const { data: transaction, error: transError } = await supabaseAdmin
        .from("commission_transactions")
        .insert({
          user_id: referral.referrer_user_id,
          referral_id: referral_id,
          referred_user_id: referral.referred_user_id,
          amount: commissionAmount,
          currency: currency,
          status: "pending",
          payment_amount: payment_amount,
          commission_rate: COMMISSION_RATE,
          eligible_at: eligibleAt.toISOString(),
        })
        .select()
        .single();

      if (transError) throw transError;

      // Atualizar saldo pendente do usuário
      const { data: existingBalance } = await supabaseAdmin
        .from("user_commission_balance")
        .select("*")
        .eq("user_id", referral.referrer_user_id)
        .single();

      if (existingBalance) {
        await supabaseAdmin
          .from("user_commission_balance")
          .update({
            pending_balance: Number(existingBalance.pending_balance) + commissionAmount,
          })
          .eq("user_id", referral.referrer_user_id);
      } else {
        await supabaseAdmin
          .from("user_commission_balance")
          .insert({
            user_id: referral.referrer_user_id,
            pending_balance: commissionAmount,
            available_balance: 0,
            total_earned: 0,
            total_withdrawn: 0,
          });
      }

      // Atualizar status do referral
      await supabaseAdmin
        .from("referrals")
        .update({
          status: "subscribed",
          referred_subscribed_at: new Date().toISOString(),
          reward_eligible_at: eligibleAt.toISOString(),
        })
        .eq("id", referral_id);

      logStep("Commission registered", { 
        transactionId: transaction.id, 
        amount: commissionAmount,
        eligibleAt: eligibleAt.toISOString()
      });

      return new Response(JSON.stringify({ 
        success: true, 
        transaction,
        commission_amount: commissionAmount 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });

    } else if (action === "process_eligible_commissions") {
      // Processar comissões que já passaram os 30 dias
      const now = new Date().toISOString();

      // Buscar comissões pendentes que já são elegíveis
      const { data: eligibleCommissions, error: fetchError } = await supabaseAdmin
        .from("commission_transactions")
        .select("*")
        .eq("status", "pending")
        .lte("eligible_at", now);

      if (fetchError) throw fetchError;

      logStep("Found eligible commissions", { count: eligibleCommissions?.length || 0 });

      if (!eligibleCommissions || eligibleCommissions.length === 0) {
        return new Response(JSON.stringify({ success: true, processed: 0 }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      let processedCount = 0;

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
            await supabaseAdmin
              .from("referrals")
              .update({ status: "expired" })
              .eq("id", commission.referral_id);

            logStep("Commission cancelled - referred user unsubscribed", { commissionId: commission.id });
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
          await supabaseAdmin
            .from("referrals")
            .update({ status: "eligible" })
            .eq("id", commission.referral_id);

          logStep("Commission made available", { 
            commissionId: commission.id, 
            amount: commission.amount 
          });

          processedCount++;
        } catch (err) {
          logStep("Error processing commission", { 
            commissionId: commission.id, 
            error: err instanceof Error ? err.message : String(err) 
          });
        }
      }

      return new Response(JSON.stringify({ success: true, processed: processedCount }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });

    } else if (action === "get_balance") {
      // Obter saldo do usuário
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) {
        return new Response(JSON.stringify({ error: "Missing authorization" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        });
      }

      const token = authHeader.replace("Bearer ", "");
      const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
      
      if (authError || !user) {
        return new Response(JSON.stringify({ error: "Invalid token" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        });
      }

      const { data: balance } = await supabaseAdmin
        .from("user_commission_balance")
        .select("*")
        .eq("user_id", user.id)
        .single();

      const { data: transactions } = await supabaseAdmin
        .from("commission_transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      const { data: withdrawals } = await supabaseAdmin
        .from("withdrawal_requests")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      return new Response(JSON.stringify({
        success: true,
        balance: balance || {
          available_balance: 0,
          pending_balance: 0,
          total_earned: 0,
          total_withdrawn: 0,
        },
        transactions: transactions || [],
        withdrawals: withdrawals || [],
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });

    } else if (action === "request_withdrawal") {
      // Solicitar saque
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) {
        return new Response(JSON.stringify({ error: "Missing authorization" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        });
      }

      const token = authHeader.replace("Bearer ", "");
      const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
      
      if (authError || !user) {
        return new Response(JSON.stringify({ error: "Invalid token" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        });
      }

      const body = await req.json().catch(() => ({}));
      const { amount, pix_key, pix_key_type, account_holder_name } = body;

      if (!amount || !pix_key || !pix_key_type) {
        return new Response(JSON.stringify({ error: "Missing required fields" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }

      // Verificar saldo disponível
      const { data: balance } = await supabaseAdmin
        .from("user_commission_balance")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!balance || Number(balance.available_balance) < Number(amount)) {
        return new Response(JSON.stringify({ error: "Insufficient balance" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }

      // Verificar se já tem solicitação pendente
      const { data: pendingWithdrawal } = await supabaseAdmin
        .from("withdrawal_requests")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "pending")
        .single();

      if (pendingWithdrawal) {
        return new Response(JSON.stringify({ error: "You already have a pending withdrawal request" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }

      // Criar solicitação de saque
      const { data: withdrawal, error: withdrawalError } = await supabaseAdmin
        .from("withdrawal_requests")
        .insert({
          user_id: user.id,
          amount: amount,
          pix_key: pix_key,
          pix_key_type: pix_key_type,
          account_holder_name: account_holder_name,
          status: "pending",
        })
        .select()
        .single();

      if (withdrawalError) throw withdrawalError;

      // Reservar o saldo (mover para "em processamento")
      await supabaseAdmin
        .from("user_commission_balance")
        .update({
          available_balance: Number(balance.available_balance) - Number(amount),
        })
        .eq("user_id", user.id);

      // Criar notificação para admin
      await supabaseAdmin
        .from("admin_notifications")
        .insert({
          title: "Nova solicitação de saque",
          message: `Uma usuária solicitou saque de R$ ${Number(amount).toFixed(2)}`,
          type: "withdrawal_request",
          severity: "info",
          related_user_id: user.id,
          metadata: { withdrawal_id: withdrawal.id, amount: amount },
        });

      logStep("Withdrawal requested", { withdrawalId: withdrawal.id, amount });

      return new Response(JSON.stringify({ success: true, withdrawal }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    throw new Error("Invalid action");

  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
