import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ZeptoMail email sending function
async function sendEmailWithZeptoMail(
  to: string,
  toName: string,
  subject: string,
  htmlBody: string
): Promise<{ success: boolean; error?: string }> {
  const zeptoMailToken = Deno.env.get("ZEPTOMAIL_API_TOKEN");
  
  if (!zeptoMailToken) {
    return { success: false, error: "ZEPTOMAIL_API_TOKEN not configured" };
  }

  try {
    const response = await fetch("https://api.zeptomail.com/v1.1/email", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": zeptoMailToken,
      },
      body: JSON.stringify({
        from: { address: "contato@lunaglow.com.br", name: "Luna" },
        to: [{ email_address: { address: to, name: toName } }],
        subject: subject,
        htmlbody: htmlBody,
      }),
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      console.error("[ZEPTOMAIL] Error response:", responseData);
      return { success: false, error: responseData.message || responseData.error || `HTTP ${response.status}` };
    }

    console.log("[ZEPTOMAIL] Email sent successfully to:", to);
    return { success: true };
  } catch (error: any) {
    console.error("[ZEPTOMAIL] Error:", error);
    return { success: false, error: error.message };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { emailLogId } = await req.json();
    
    if (!emailLogId) {
      return new Response(JSON.stringify({ error: "emailLogId is required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    console.log("[RESEND-EMAIL] Starting resend for email log ID:", emailLogId);

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get the original email log
    const { data: emailLog, error: logError } = await supabaseClient
      .from("email_logs")
      .select("*")
      .eq("id", emailLogId)
      .single();

    if (logError || !emailLog) {
      console.error("[RESEND-EMAIL] Email log not found:", logError);
      return new Response(JSON.stringify({ error: "Email log not found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404,
      });
    }

    console.log("[RESEND-EMAIL] Found email log:", emailLog.email_type, "to:", emailLog.email_to);

    // Get user name for personalization
    let userName = "Querida";
    if (emailLog.user_id) {
      const { data: onboarding } = await supabaseClient
        .from("user_onboarding_data")
        .select("preferred_name")
        .eq("user_id", emailLog.user_id)
        .single();
      
      if (onboarding?.preferred_name) {
        userName = onboarding.preferred_name;
      } else {
        const { data: profile } = await supabaseClient
          .from("profiles")
          .select("full_name")
          .eq("user_id", emailLog.user_id)
          .single();
        if (profile?.full_name) {
          userName = profile.full_name;
        }
      }
    }

    // Generate email HTML based on type
    let emailHtml = "";
    let emailSubject = emailLog.subject;

    switch (emailLog.email_type) {
      case "reengagement":
      case "reengagement_7days":
        emailHtml = generateReengagementEmail(userName, emailLog.metadata?.days_inactive || 7, emailLog.metadata?.is_premium);
        break;
      
      case "subscription_confirmation":
        emailHtml = generateSubscriptionConfirmationEmail(userName, emailLog.metadata?.plan_type || "premium");
        break;
      
      case "upgrade_campaign":
        emailHtml = generateUpgradeCampaignEmail(userName);
        break;
      
      case "inactivity_reminder":
        emailHtml = generateInactivityReminderEmail(userName, emailLog.metadata?.days_inactive || 2);
        break;
      
      default:
        // Generic fallback email
        emailHtml = generateGenericResendEmail(userName, emailLog.subject);
    }

    // Send the email
    const emailResult = await sendEmailWithZeptoMail(
      emailLog.email_to,
      userName,
      emailSubject,
      emailHtml
    );

    // Log the resend attempt
    await supabaseClient.from("email_logs").insert({
      user_id: emailLog.user_id,
      email_to: emailLog.email_to,
      email_type: `${emailLog.email_type}_resend`,
      subject: `[Reenvio] ${emailSubject}`,
      status: emailResult.success ? "sent" : "failed",
      error_message: emailResult.error || null,
      metadata: { 
        original_log_id: emailLogId,
        resend_at: new Date().toISOString()
      }
    });

    if (!emailResult.success) {
      console.error("[RESEND-EMAIL] Failed to resend:", emailResult.error);
      return new Response(JSON.stringify({ 
        success: false, 
        error: emailResult.error 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    console.log("[RESEND-EMAIL] Email resent successfully to:", emailLog.email_to);

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Email reenviado com sucesso para ${emailLog.email_to}`
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error: any) {
    console.error("[RESEND-EMAIL] Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

// Email template generators
function generateReengagementEmail(userName: string, daysInactive: number, isPremium: boolean): string {
  return `
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
        <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin-top: 12px;">Já se passaram ${daysInactive} dias desde sua última visita</p>
      </div>
      
      <div style="background: white; padding: 40px; border-radius: 0 0 24px 24px; box-shadow: 0 20px 60px rgba(0,0,0,0.12);">
        <p style="font-size: 18px; color: #374151; line-height: 1.7;">
          Olá, <strong style="color: #be185d;">${userName}</strong>! 💜
        </p>
        
        <p style="font-size: 16px; color: #6b7280; line-height: 1.7;">
          Sabemos que a vida pode ser agitada, mas seu bem-estar merece atenção especial. A Luna está aqui para te ajudar a cuidar de você mesma!
        </p>
        
        <div style="text-align: center; margin: 40px 0 30px 0;">
          <a href="https://lunaglow.com.br/dashboard" 
             style="display: inline-block; background: linear-gradient(135deg, #be185d, #7c3aed); color: white; padding: 18px 50px; border-radius: 35px; text-decoration: none; font-weight: bold; font-size: 17px; box-shadow: 0 8px 25px rgba(124, 58, 237, 0.4);">
            Retomar meu bem-estar →
          </a>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 25px;">
        <p style="color: #9ca3af; font-size: 12px;">
          © 2024 Luna - Cuidando do seu bem-estar 💜
        </p>
      </div>
    </div>
  </body>
  </html>
  `;
}

function generateSubscriptionConfirmationEmail(userName: string, planType: string): string {
  const planName = planType === "premium_plus" ? "Premium Plus" : "Premium";
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #fef7ff;">
    <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
      <div style="background: linear-gradient(135deg, #be185d, #7c3aed); padding: 40px; border-radius: 24px 24px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Bem-vinda ao Luna ${planName}!</h1>
      </div>
      
      <div style="background: white; padding: 40px; border-radius: 0 0 24px 24px;">
        <p style="font-size: 18px; color: #374151;">
          Olá, <strong style="color: #be185d;">${userName}</strong>! 💜
        </p>
        
        <p style="font-size: 16px; color: #6b7280;">
          Sua assinatura ${planName} está ativa! Agora você tem acesso a todos os recursos exclusivos.
        </p>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="https://lunaglow.com.br/dashboard" 
             style="display: inline-block; background: linear-gradient(135deg, #be185d, #7c3aed); color: white; padding: 18px 50px; border-radius: 35px; text-decoration: none; font-weight: bold;">
            Acessar meu Dashboard →
          </a>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
}

function generateUpgradeCampaignEmail(userName: string): string {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #fef7ff;">
    <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
      <div style="background: linear-gradient(135deg, #be185d, #7c3aed); padding: 40px; border-radius: 24px 24px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">✨ Desbloqueie todo o potencial da Luna!</h1>
      </div>
      
      <div style="background: white; padding: 40px; border-radius: 0 0 24px 24px;">
        <p style="font-size: 18px; color: #374151;">
          Olá, <strong style="color: #be185d;">${userName}</strong>! 💜
        </p>
        
        <p style="font-size: 16px; color: #6b7280;">
          Você está aproveitando a Luna, mas sabia que pode ter uma experiência ainda mais completa com o plano Premium?
        </p>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="https://lunaglow.com.br/pricing" 
             style="display: inline-block; background: linear-gradient(135deg, #be185d, #7c3aed); color: white; padding: 18px 50px; border-radius: 35px; text-decoration: none; font-weight: bold;">
            Ver planos Premium →
          </a>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
}

function generateInactivityReminderEmail(userName: string, daysInactive: number): string {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #fef7ff;">
    <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
      <div style="background: linear-gradient(135deg, #be185d, #7c3aed); padding: 40px; border-radius: 24px 24px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">💜 ${userName}, sentimos sua falta!</h1>
      </div>
      
      <div style="background: white; padding: 40px; border-radius: 0 0 24px 24px;">
        <p style="font-size: 18px; color: #374151;">
          Olá, <strong style="color: #be185d;">${userName}</strong>! 💜
        </p>
        
        <p style="font-size: 16px; color: #6b7280;">
          Já faz ${daysInactive} dias que você não nos visita. Que tal registrar como você está se sentindo hoje?
        </p>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="https://lunaglow.com.br/dashboard" 
             style="display: inline-block; background: linear-gradient(135deg, #be185d, #7c3aed); color: white; padding: 18px 50px; border-radius: 35px; text-decoration: none; font-weight: bold;">
            Acessar meu Dashboard →
          </a>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
}

function generateGenericResendEmail(userName: string, subject: string): string {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #fef7ff;">
    <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
      <div style="background: linear-gradient(135deg, #be185d, #7c3aed); padding: 40px; border-radius: 24px 24px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🌙 Luna</h1>
      </div>
      
      <div style="background: white; padding: 40px; border-radius: 0 0 24px 24px;">
        <p style="font-size: 18px; color: #374151;">
          Olá, <strong style="color: #be185d;">${userName}</strong>! 💜
        </p>
        
        <p style="font-size: 16px; color: #6b7280;">
          Este é um reenvio da nossa comunicação anterior: "${subject}"
        </p>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="https://lunaglow.com.br/dashboard" 
             style="display: inline-block; background: linear-gradient(135deg, #be185d, #7c3aed); color: white; padding: 18px 50px; border-radius: 35px; text-decoration: none; font-weight: bold;">
            Acessar Luna →
          </a>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
}
