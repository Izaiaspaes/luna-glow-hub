import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const INACTIVITY_DAYS = 7;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("[REENGAGEMENT] Starting reengagement check for users inactive 7+ days...");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Find users who haven't accessed in more than 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - INACTIVITY_DAYS);

    // Also exclude users who were already contacted (within last 7 days) - to avoid spam
    const { data: inactiveProfiles, error: profilesError } = await supabaseClient
      .from("profiles")
      .select("user_id, full_name, last_accessed_at, subscription_plan")
      .lt("last_accessed_at", sevenDaysAgo.toISOString())
      .eq("is_active", true)
      .not("last_accessed_at", "is", null);

    if (profilesError) {
      console.error("[REENGAGEMENT] Error fetching profiles:", profilesError);
      throw profilesError;
    }

    console.log("[REENGAGEMENT] Found", inactiveProfiles?.length || 0, "users inactive for 7+ days");

    if (!inactiveProfiles || inactiveProfiles.length === 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: "No users inactive for 7+ days found",
        emailsSent: 0 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    let emailsSent = 0;
    const errors: string[] = [];

    for (const profile of inactiveProfiles) {
      try {
        // Get user email
        const { data: userData, error: userError } = await supabaseClient.auth.admin.getUserById(profile.user_id);
        
        if (userError || !userData?.user?.email) {
          console.log("[REENGAGEMENT] Skipping user without email:", profile.user_id);
          continue;
        }

        // Get preferred name from onboarding
        const { data: onboarding } = await supabaseClient
          .from("user_onboarding_data")
          .select("preferred_name")
          .eq("user_id", profile.user_id)
          .single();

        const userName = onboarding?.preferred_name || profile.full_name || "Querida";
        const userEmail = userData.user.email;
        const isPremium = profile.subscription_plan && profile.subscription_plan !== 'free';

        // Calculate days since last access
        const lastAccess = new Date(profile.last_accessed_at);
        const daysSinceAccess = Math.floor((Date.now() - lastAccess.getTime()) / (1000 * 60 * 60 * 24));

        const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #fef7ff;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: linear-gradient(135deg, #be185d, #7c3aed, #6366f1); padding: 40px; border-radius: 24px 24px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">🌙 ${userName}, voltamos a pensar em você!</h1>
              <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin-top: 12px;">Já se passaram ${daysSinceAccess} dias desde sua última visita</p>
            </div>
            
            <div style="background: white; padding: 40px; border-radius: 0 0 24px 24px; box-shadow: 0 20px 60px rgba(0,0,0,0.12);">
              <p style="font-size: 18px; color: #374151; line-height: 1.7;">
                Olá, <strong style="color: #be185d;">${userName}</strong>! 💜
              </p>
              
              <p style="font-size: 16px; color: #6b7280; line-height: 1.7;">
                Sabemos que a vida pode ser agitada, mas seu bem-estar merece atenção especial. A Luna está aqui para te ajudar a cuidar de você mesma, e quanto mais você registra, mais personalizadas ficam as recomendações!
              </p>
              
              <div style="background: linear-gradient(135deg, #fdf2f8, #ede9fe); padding: 28px; border-radius: 18px; margin: 30px 0; border-left: 4px solid #be185d;">
                <h2 style="color: #7c3aed; margin: 0 0 18px 0; font-size: 19px; font-weight: 600;">🎁 O que você está perdendo:</h2>
                <ul style="list-style: none; padding: 0; margin: 0; color: #374151;">
                  <li style="padding: 10px 0; font-size: 15px; display: flex; align-items: center;">
                    <span style="margin-right: 12px; font-size: 20px;">📊</span>
                    <span>Análises inteligentes do seu ciclo e humor</span>
                  </li>
                  <li style="padding: 10px 0; font-size: 15px; display: flex; align-items: center;">
                    <span style="margin-right: 12px; font-size: 20px;">🧘</span>
                    <span>Planos de bem-estar personalizados com IA</span>
                  </li>
                  <li style="padding: 10px 0; font-size: 15px; display: flex; align-items: center;">
                    <span style="margin-right: 12px; font-size: 20px;">📔</span>
                    <span>Diário feminino com insights automáticos</span>
                  </li>
                  <li style="padding: 10px 0; font-size: 15px; display: flex; align-items: center;">
                    <span style="margin-right: 12px; font-size: 20px;">🔮</span>
                    <span>Previsões de sintomas e recomendações preventivas</span>
                  </li>
                  ${isPremium ? `
                  <li style="padding: 10px 0; font-size: 15px; display: flex; align-items: center;">
                    <span style="margin-right: 12px; font-size: 20px;">✨</span>
                    <span><strong>Seus recursos Premium estão te esperando!</strong></span>
                  </li>
                  ` : ''}
                </ul>
              </div>
              
              <div style="background: #fef3c7; padding: 20px; border-radius: 12px; margin: 25px 0;">
                <p style="font-size: 15px; color: #92400e; margin: 0; font-weight: 500;">
                  💡 <strong>Dica:</strong> Apenas 2 minutos por dia registrando como você se sente pode transformar seu autoconhecimento!
                </p>
              </div>
              
              <p style="font-size: 16px; color: #6b7280; line-height: 1.7; text-align: center; font-style: italic; margin: 30px 0;">
                "Você merece se sentir bem consigo mesma. Volte quando estiver pronta - estaremos aqui!" 💜
              </p>
              
              <div style="text-align: center; margin: 40px 0 30px 0;">
                <a href="https://lunaglow.com.br/dashboard" 
                   style="display: inline-block; background: linear-gradient(135deg, #be185d, #7c3aed); color: white; padding: 18px 50px; border-radius: 35px; text-decoration: none; font-weight: bold; font-size: 17px; box-shadow: 0 8px 25px rgba(124, 58, 237, 0.4); transition: transform 0.2s;">
                  Retomar meu bem-estar →
                </a>
              </div>
              
              <div style="border-top: 1px solid #e5e7eb; padding-top: 25px; margin-top: 30px; text-align: center;">
                <p style="font-size: 13px; color: #9ca3af; line-height: 1.6;">
                  Se você não deseja mais receber esses lembretes, pode desativá-los nas <a href="https://lunaglow.com.br/dashboard" style="color: #7c3aed;">configurações de notificação</a> do seu perfil.
                </p>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 25px;">
              <p style="color: #9ca3af; font-size: 12px;">
                © 2024 Luna - Cuidando do seu bem-estar 💜
              </p>
              <p style="color: #9ca3af; font-size: 11px; margin-top: 8px;">
                <a href="mailto:suporte@lunaglow.com.br" style="color: #9ca3af;">suporte@lunaglow.com.br</a>
              </p>
            </div>
          </div>
        </body>
        </html>
        `;

        const { error: emailError } = await resend.emails.send({
          from: "Luna <contato@lunaglow.com.br>",
          to: [userEmail],
          subject: `🌙 ${userName}, estamos com saudades! Seu bem-estar te espera`,
          html: emailHtml,
        });

        if (emailError) {
          console.error("[REENGAGEMENT] Email error for", userEmail, ":", emailError);
          errors.push(`${userEmail}: ${emailError.message}`);
        } else {
          emailsSent++;
          console.log("[REENGAGEMENT] Reengagement email sent to:", userEmail, "- Inactive for", daysSinceAccess, "days");
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 150));

      } catch (userError: any) {
        console.error("[REENGAGEMENT] Error processing user:", profile.user_id, userError);
        errors.push(`${profile.user_id}: ${userError.message}`);
      }
    }

    console.log("[REENGAGEMENT] Completed. Emails sent:", emailsSent, "Errors:", errors.length);

    return new Response(JSON.stringify({ 
      success: true, 
      emailsSent,
      totalInactive: inactiveProfiles.length,
      inactivityDays: INACTIVITY_DAYS,
      errors: errors.length > 0 ? errors : undefined
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("[REENGAGEMENT] Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
