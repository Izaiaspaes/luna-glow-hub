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

interface SubscriptionConfirmationRequest {
  userId: string;
  planType: "premium" | "premium_plus";
  billingPeriod: "monthly" | "yearly";
}

const getPlanBenefits = (planType: string, language: string = "pt") => {
  const benefits = {
    premium: {
      pt: [
        "✨ Planos de bem-estar ilimitados",
        "🧠 Recomendações personalizadas com IA",
        "📔 Diário da Mulher com análise de IA",
        "🆘 SOS Feminino - suporte em momentos difíceis",
        "📊 Previsões inteligentes de sintomas",
        "🔒 Modo Privacidade Ultra"
      ],
      en: [
        "✨ Unlimited wellness plans",
        "🧠 AI-powered personalized recommendations",
        "📔 Women's Journal with AI analysis",
        "🆘 SOS Feminino - support in difficult moments",
        "📊 Smart symptom predictions",
        "🔒 Ultra Privacy Mode"
      ],
      es: [
        "✨ Planes de bienestar ilimitados",
        "🧠 Recomendaciones personalizadas con IA",
        "📔 Diario de la Mujer con análisis de IA",
        "🆘 SOS Femenino - apoyo en momentos difíciles",
        "📊 Predicciones inteligentes de síntomas",
        "🔒 Modo Privacidad Ultra"
      ]
    },
    premium_plus: {
      pt: [
        "✨ Todos os benefícios do Premium",
        "💬 Luna Sense - Assistente de IA conversacional",
        "💄 Análise de Beleza com IA",
        "👗 Meu Closet Virtual com sugestões de looks",
        "🎯 Suporte prioritário",
        "🌟 Acesso antecipado a novos recursos"
      ],
      en: [
        "✨ All Premium benefits",
        "💬 Luna Sense - Conversational AI assistant",
        "💄 AI Beauty Analysis",
        "👗 My Virtual Closet with outfit suggestions",
        "🎯 Priority support",
        "🌟 Early access to new features"
      ],
      es: [
        "✨ Todos los beneficios Premium",
        "💬 Luna Sense - Asistente de IA conversacional",
        "💄 Análisis de Belleza con IA",
        "👗 Mi Closet Virtual con sugerencias de looks",
        "🎯 Soporte prioritario",
        "🌟 Acceso anticipado a nuevas funciones"
      ]
    }
  };

  return benefits[planType as keyof typeof benefits]?.[language as keyof typeof benefits.premium] || benefits.premium.pt;
};

const getPlanName = (planType: string, language: string = "pt") => {
  const names = {
    premium: { pt: "Premium", en: "Premium", es: "Premium" },
    premium_plus: { pt: "Premium Plus", en: "Premium Plus", es: "Premium Plus" }
  };
  return names[planType as keyof typeof names]?.[language as keyof typeof names.premium] || "Premium";
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

    const { userId, planType, billingPeriod }: SubscriptionConfirmationRequest = await req.json();
    console.log("[SUBSCRIPTION-CONFIRMATION] Processing for user:", userId, "plan:", planType);

    // Fetch user data
    const { data: userData, error: userError } = await supabaseClient.auth.admin.getUserById(userId);
    if (userError || !userData?.user?.email) {
      throw new Error("User not found or email not available");
    }

    // Fetch user profile for name
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("full_name")
      .eq("user_id", userId)
      .single();

    // Fetch onboarding data for preferred name
    const { data: onboarding } = await supabaseClient
      .from("user_onboarding_data")
      .select("preferred_name")
      .eq("user_id", userId)
      .single();

    const userName = onboarding?.preferred_name || profile?.full_name || "Luna User";
    const userEmail = userData.user.email;
    const language = "pt"; // Default to Portuguese
    
    const benefits = getPlanBenefits(planType, language);
    const planName = getPlanName(planType, language);

    const benefitsList = benefits.map(b => `<li style="padding: 8px 0; font-size: 16px;">${b}</li>`).join("");

    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f4ff;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: linear-gradient(135deg, #ec4899, #8b5cf6, #f97316); padding: 40px; border-radius: 20px 20px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Bem-vinda ao Luna ${planName}!</h1>
        </div>
        
        <div style="background: white; padding: 40px; border-radius: 0 0 20px 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.1);">
          <p style="font-size: 18px; color: #374151; line-height: 1.6;">
            Olá, <strong>${userName}</strong>! 💜
          </p>
          
          <p style="font-size: 16px; color: #6b7280; line-height: 1.6;">
            Sua assinatura ${planName} foi confirmada com sucesso! Agora você tem acesso a todos os recursos exclusivos para cuidar do seu bem-estar de forma personalizada.
          </p>
          
          <div style="background: linear-gradient(135deg, #fdf2f8, #f3e8ff); padding: 25px; border-radius: 15px; margin: 30px 0;">
            <h2 style="color: #7c3aed; margin: 0 0 15px 0; font-size: 20px;">🌟 Seus benefícios desbloqueados:</h2>
            <ul style="list-style: none; padding: 0; margin: 0; color: #374151;">
              ${benefitsList}
            </ul>
          </div>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="https://lunaglow.com.br/dashboard" 
               style="display: inline-block; background: linear-gradient(135deg, #ec4899, #8b5cf6); color: white; padding: 16px 40px; border-radius: 30px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);">
              Acessar meu Dashboard →
            </a>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 25px; margin-top: 30px;">
            <p style="font-size: 14px; color: #9ca3af; text-align: center; line-height: 1.6;">
              Dúvidas? Entre em contato conosco:<br>
              <a href="mailto:suporte@lunaglow.com.br" style="color: #8b5cf6;">suporte@lunaglow.com.br</a>
            </p>
          </div>
        </div>
        
        <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 20px;">
          © 2024 Luna - Seu bem-estar em primeiro lugar 💜
        </p>
      </div>
    </body>
    </html>
    `;

    const emailSubject = `🎉 Bem-vinda ao Luna ${planName}! Sua assinatura foi confirmada`;
    const emailResult = await sendEmailWithZeptoMail(userEmail, userName, emailSubject, emailHtml);

    if (!emailResult.success) {
      console.error("[SUBSCRIPTION-CONFIRMATION] Email error:", emailResult.error);
      throw new Error(emailResult.error);
    }

    console.log("[SUBSCRIPTION-CONFIRMATION] Email sent successfully to:", userEmail);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("[SUBSCRIPTION-CONFIRMATION] Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
