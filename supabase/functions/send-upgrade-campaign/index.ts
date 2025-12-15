import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

    console.log("Starting upgrade campaign for free users...");

    // Get all active free users with their onboarding data
    const { data: freeUsers, error: usersError } = await supabaseClient
      .from("profiles")
      .select(`
        user_id,
        full_name,
        subscription_plan,
        is_active
      `)
      .eq("subscription_plan", "free")
      .eq("is_active", true);

    if (usersError) {
      console.error("Error fetching free users:", usersError);
      throw usersError;
    }

    console.log(`Found ${freeUsers?.length || 0} free users to contact`);

    const results = {
      emailsSent: 0,
      emailsFailed: 0,
      pushSent: 0,
      pushFailed: 0,
      errors: [] as string[],
    };

    for (const profile of freeUsers || []) {
      // Get user email from auth
      const { data: authUser } = await supabaseClient.auth.admin.getUserById(profile.user_id);
      if (!authUser?.user?.email) {
        console.log(`No email found for user ${profile.user_id}`);
        continue;
      }

      const userEmail = authUser.user.email;

      // Get preferred name from onboarding data
      const { data: onboardingData } = await supabaseClient
        .from("user_onboarding_data")
        .select("preferred_name, full_name")
        .eq("user_id", profile.user_id)
        .single();

      const userName = onboardingData?.preferred_name || 
                       onboardingData?.full_name || 
                       profile.full_name || 
                       userEmail.split("@")[0];

      // Send upgrade email
      const emailSubject = `🌟 ${userName}, descubra o poder completo do Luna!`;
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f4fc;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(138, 43, 226, 0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #8B5CF6 0%, #D946EF 50%, #F97316 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">
                🌙 Luna Premium
              </h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">
                Eleve seu autocuidado ao próximo nível
              </p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #1f2937; margin: 0 0 20px; font-size: 22px;">
                Olá, ${userName}! 💜
              </h2>
              
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                Você está aproveitando o Luna, mas sabia que existe um mundo de funcionalidades 
                esperando por você? Com os planos <strong>Premium</strong> e <strong>Premium Plus</strong>, 
                você terá acesso a ferramentas exclusivas de IA que transformam seu bem-estar.
              </p>

              <!-- Premium Features -->
              <div style="background: linear-gradient(135deg, #f3e8ff 0%, #fce7f3 100%); border-radius: 12px; padding: 25px; margin-bottom: 25px;">
                <h3 style="color: #7c3aed; margin: 0 0 15px; font-size: 18px;">
                  ✨ Plano Premium - R$ 19,90/mês
                </h3>
                <ul style="color: #4b5563; padding-left: 20px; margin: 0; line-height: 1.8;">
                  <li><strong>Planos de Bem-Estar Ilimitados</strong> - IA cria rotinas personalizadas</li>
                  <li><strong>Diário da Mulher com IA</strong> - Análise inteligente do seu diário</li>
                  <li><strong>SOS Feminino</strong> - Suporte imediato em momentos difíceis</li>
                  <li><strong>Previsões de Sintomas</strong> - Antecipe TPM, cólicas e mais</li>
                </ul>
              </div>

              <!-- Premium Plus Features -->
              <div style="background: linear-gradient(135deg, #fef3c7 0%, #fce7f3 100%); border-radius: 12px; padding: 25px; margin-bottom: 30px;">
                <h3 style="color: #d946ef; margin: 0 0 15px; font-size: 18px;">
                  👑 Plano Premium Plus - R$ 29,90/mês
                </h3>
                <p style="color: #6b7280; margin: 0 0 10px; font-size: 14px;">Tudo do Premium, mais:</p>
                <ul style="color: #4b5563; padding-left: 20px; margin: 0; line-height: 1.8;">
                  <li><strong>Luna Sense</strong> - Sua assistente de IA pessoal 24/7</li>
                  <li><strong>Análise de Beleza com IA</strong> - Recomendações personalizadas de estilo</li>
                  <li><strong>Meu Closet Virtual</strong> - Organize roupas e receba sugestões de looks</li>
                </ul>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin-bottom: 30px;">
                <a href="https://lunaglow.com.br/pricing" 
                   style="display: inline-block; background: linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 30px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);">
                  Ver Planos e Preços →
                </a>
              </div>

              <!-- Testimonial -->
              <div style="background-color: #faf5ff; border-left: 4px solid #8B5CF6; padding: 20px; border-radius: 0 8px 8px 0; margin-bottom: 25px;">
                <p style="color: #4b5563; font-style: italic; margin: 0 0 10px; font-size: 15px;">
                  "O Luna Premium mudou minha rotina! A IA realmente entende meu ciclo e me ajuda a me preparar para cada fase."
                </p>
                <p style="color: #8B5CF6; margin: 0; font-weight: 600; font-size: 14px;">
                  — Maria, 28 anos
                </p>
              </div>

              <p style="color: #6b7280; font-size: 14px; text-align: center; margin: 0;">
                Experimente 7 dias e cancele quando quiser!
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f3f4f6; padding: 25px 30px; text-align: center;">
              <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                Luna - Seu bem-estar feminino inteligente<br>
                <a href="https://lunaglow.com.br" style="color: #8B5CF6;">lunaglow.com.br</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `;

      try {
        const { error: emailError } = await resend.emails.send({
          from: "Luna <contato@lunaglow.com.br>",
          to: [userEmail],
          subject: emailSubject,
          html: emailHtml,
        });

        // Log email
        await supabaseClient.from("email_logs").insert({
          user_id: profile.user_id,
          email_to: userEmail,
          email_type: "upgrade_campaign",
          subject: emailSubject,
          status: emailError ? "failed" : "sent",
          error_message: emailError?.message || null,
          metadata: { current_plan: "free" }
        });

        if (emailError) {
          console.error(`Email failed for ${userEmail}:`, emailError);
          results.emailsFailed++;
          results.errors.push(`Email to ${userEmail}: ${emailError.message}`);
        } else {
          console.log(`Email sent to ${userEmail}`);
          results.emailsSent++;
        }
      } catch (emailErr) {
        console.error(`Email error for ${userEmail}:`, emailErr);
        results.emailsFailed++;
      }

      // Send push notification if user has subscription
      const { data: pushSubs } = await supabaseClient
        .from("push_subscriptions")
        .select("subscription_data")
        .eq("user_id", profile.user_id);

      if (pushSubs && pushSubs.length > 0) {
        for (const sub of pushSubs) {
          try {
            const subscription = sub.subscription_data as any;
            const vapidPublicKey = Deno.env.get("VAPID_PUBLIC_KEY");
            const vapidPrivateKey = Deno.env.get("VAPID_PRIVATE_KEY");

            if (!vapidPublicKey || !vapidPrivateKey) {
              console.log("VAPID keys not configured, skipping push");
              continue;
            }

            const pushPayload = JSON.stringify({
              title: "🌟 Descubra o Luna Premium!",
              body: `${userName}, desbloqueie IA personalizada, previsões de sintomas e muito mais!`,
              icon: "/pwa-192x192.png",
              badge: "/pwa-192x192.png",
              data: { url: "/pricing" }
            });

            const response = await fetch(subscription.endpoint, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "TTL": "86400",
              },
              body: pushPayload,
            });

            if (response.ok) {
              console.log(`Push sent to user ${profile.user_id}`);
              results.pushSent++;
            } else {
              console.error(`Push failed for user ${profile.user_id}:`, response.status);
              results.pushFailed++;
            }
          } catch (pushErr) {
            console.error(`Push error:`, pushErr);
            results.pushFailed++;
          }
        }
      }
    }

    console.log("Upgrade campaign completed:", results);

    return new Response(JSON.stringify({
      success: true,
      message: "Upgrade campaign completed",
      results
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Error in upgrade campaign:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
