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

function firstWordFromName(name?: string | null): string | null {
  const n = (name ?? "").trim();
  if (!n) return null;
  return n.split(/\s+/)[0] || null;
}

function nameFromEmail(email?: string | null): string | null {
  const e = (email ?? "").trim();
  if (!e || !e.includes("@")) return null;
  const local = e.split("@")[0]?.trim();
  if (!local) return null;

  const token = local.split(/[._-]+/).filter(Boolean)[0] ?? local;
  const cleaned = token.replace(/[0-9]+/g, "").trim();
  const base = cleaned || token;

  if (!base) return null;
  return base.charAt(0).toUpperCase() + base.slice(1);
}

function resolveUserName(opts: {
  preferredName?: string | null;
  fullName?: string | null;
  profileName?: string | null;
  email?: string | null;
}): string {
  const preferred = (opts.preferredName ?? "").trim();
  if (preferred) return preferred;

  const fromFull = firstWordFromName(opts.fullName);
  if (fromFull) return fromFull;

  const fromProfile = firstWordFromName(opts.profileName);
  if (fromProfile) return fromProfile;

  const fromEmail = nameFromEmail(opts.email);
  if (fromEmail) return fromEmail;

  return "Luna";
}

// Contextual message templates based on user data
function getContextualMessage(daysSinceAccess: number, userName: string): { subject: string; headline: string; content: string; features: string[] } {
  const now = new Date();
  const hour = now.getHours();
  const dayOfWeek = now.getDay(); // 0 = Sunday
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  
  // Variety of message templates
  const templates = [
    {
      subject: `✨ ${userName}, descobrimos algo novo para você!`,
      headline: `Novidades te esperando, ${userName}!`,
      content: `Enquanto você esteve fora, a Luna evoluiu! Temos novos recursos de IA prontos para te ajudar com análise de beleza, sugestões de looks e muito mais.`,
      features: [
        '💄 Análise de Beleza com IA - descubra suas melhores cores',
        '👗 Armário Virtual - organize seus looks e receba sugestões',
        '🔮 Previsões de sintomas baseadas no seu ciclo',
        '📔 Diário com insights automáticos da IA'
      ]
    },
    {
      subject: `💄 ${userName}, seu look do ${isWeekend ? 'fim de semana' : 'dia'} te espera!`,
      headline: `Que tal um look incrível, ${userName}?`,
      content: `${isWeekend ? 'O fim de semana chegou!' : 'Um novo dia, novas possibilidades!'} Use o Armário Virtual para criar combinações perfeitas e a Análise de Beleza para descobrir as cores que mais combinam com você.`,
      features: [
        '👗 Monte o look perfeito no Armário Virtual',
        '💅 Descubra cores de esmalte que combinam com sua pele',
        '💄 Sugestões de maquiagem personalizadas',
        '🌟 Dicas de estilo para sua fase do ciclo'
      ]
    },
    {
      subject: `🧘 ${userName}, hora de cuidar de você!`,
      headline: `Seu momento de autocuidado, ${userName}!`,
      content: `Você sabia que registrar como você se sente por apenas 2 minutos pode transformar seu autoconhecimento? A Luna analisa seus padrões e te dá insights poderosos.`,
      features: [
        '🧘 Planos de bem-estar personalizados com IA',
        '💆 Sugestões de autocuidado para sua fase',
        '🩺 Análise de Saúde com descrição de sintomas',
        '⚡ Rastreamento de energia e produtividade'
      ]
    },
    {
      subject: `🌙 ${userName}, como anda seu sono e energia?`,
      headline: `Vamos melhorar seu descanso, ${userName}!`,
      content: `Dormir bem é essencial para se sentir incrível! A Luna pode te ajudar a identificar padrões de sono e dar dicas para noites mais restauradoras.`,
      features: [
        '🌙 Rastreamento de qualidade do sono',
        '⚡ Análise de níveis de energia',
        '💭 Correlação entre humor e descanso',
        '📊 Insights sobre seus padrões de sono'
      ]
    },
    {
      subject: `💕 ${userName}, seu parceiro pode te entender melhor!`,
      headline: `Conexão mais profunda, ${userName}!`,
      content: `Sabia que você pode compartilhar informações do seu ciclo de forma discreta com seu parceiro? O Luna a Dois ajuda a criar mais compreensão e conexão no relacionamento.`,
      features: [
        '💕 Luna a Dois - compartilhe com seu parceiro',
        '🔔 Alertas automáticos sobre mudanças de fase',
        '💬 Dicas de comunicação personalizadas',
        '🔒 Controle total sobre o que compartilhar'
      ]
    },
    {
      subject: `📔 ${userName}, sua história merece ser contada!`,
      headline: `Seu diário te espera, ${userName}!`,
      content: `O Diário da Mulher é mais que um espaço para escrever - a IA analisa seus textos e descobre padrões que você nem imaginava. É autoconhecimento em outro nível!`,
      features: [
        '📔 Diário com análise inteligente',
        '🎙️ Grave por voz se preferir',
        '🔍 Padrões emocionais identificados pela IA',
        '💡 Sugestões baseadas no que você escreve'
      ]
    }
  ];
  
  // Select template based on hash of userName + day for consistency
  const index = (userName.charCodeAt(0) + dayOfWeek) % templates.length;
  return templates[index];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("[INACTIVITY-REMINDERS] Starting inactivity check...");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Find users who haven't accessed in more than 2 days
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const { data: inactiveProfiles, error: profilesError } = await supabaseClient
      .from("profiles")
      .select("user_id, full_name, last_accessed_at, subscription_plan")
      .lt("last_accessed_at", twoDaysAgo.toISOString())
      .not("last_accessed_at", "is", null);

    if (profilesError) {
      console.error("[INACTIVITY-REMINDERS] Error fetching profiles:", profilesError);
      throw profilesError;
    }

    console.log("[INACTIVITY-REMINDERS] Found", inactiveProfiles?.length || 0, "inactive users");

    if (!inactiveProfiles || inactiveProfiles.length === 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: "No inactive users found",
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
          console.log("[INACTIVITY-REMINDERS] Skipping user without email:", profile.user_id);
          continue;
        }

        // Get preferred name from onboarding
        const userEmail = userData.user.email;

        const { data: onboarding } = await supabaseClient
          .from("user_onboarding_data")
          .select("preferred_name, full_name")
          .eq("user_id", profile.user_id)
          .maybeSingle();

        const userName = resolveUserName({
          preferredName: onboarding?.preferred_name,
          fullName: onboarding?.full_name,
          profileName: profile.full_name,
          email: userEmail,
        });

        console.log("[INACTIVITY-REMINDERS] User:", profile.user_id, "Name:", userName);

        // Calculate days since last access
        const lastAccess = new Date(profile.last_accessed_at);
        const daysSinceAccess = Math.floor((Date.now() - lastAccess.getTime()) / (1000 * 60 * 60 * 24));
        
        // Get contextual message
        const message = getContextualMessage(daysSinceAccess, userName);
        const isPremium = profile.subscription_plan && profile.subscription_plan !== 'free';

        const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f4ff;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: linear-gradient(135deg, #ec4899, #8b5cf6); padding: 35px; border-radius: 20px 20px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 26px;">💜 ${message.headline}</h1>
            </div>
            
            <div style="background: white; padding: 40px; border-radius: 0 0 20px 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.1);">
              <p style="font-size: 18px; color: #374151; line-height: 1.6;">
                Olá, <strong>${userName}</strong>! 🌸
              </p>
              
              <p style="font-size: 16px; color: #6b7280; line-height: 1.6;">
                ${message.content}
              </p>
              
              <div style="background: linear-gradient(135deg, #fdf2f8, #f3e8ff); padding: 25px; border-radius: 15px; margin: 30px 0;">
                <h2 style="color: #7c3aed; margin: 0 0 15px 0; font-size: 18px;">✨ Explore hoje:</h2>
                <ul style="list-style: none; padding: 0; margin: 0; color: #374151;">
                  ${message.features.map(f => `<li style="padding: 8px 0; font-size: 15px;">${f}</li>`).join('')}
                </ul>
              </div>
              
              ${isPremium ? `
              <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); padding: 20px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #f59e0b;">
                <p style="font-size: 15px; color: #92400e; margin: 0;">
                  👑 <strong>Lembrete:</strong> Você tem acesso Premium! Aproveite todos os recursos exclusivos que estão disponíveis para você.
                </p>
              </div>
              ` : ''}
              
              <p style="font-size: 15px; color: #6b7280; line-height: 1.6; font-style: italic;">
                "Cada momento dedicado a você mesma é um investimento no seu bem-estar." 💜
              </p>
              
              <div style="text-align: center; margin: 35px 0;">
                <a href="https://lunaglow.com.br/dashboard" 
                   style="display: inline-block; background: linear-gradient(135deg, #ec4899, #8b5cf6); color: white; padding: 16px 40px; border-radius: 30px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);">
                  Explorar agora →
                </a>
              </div>
              
              <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 25px;">
                <p style="font-size: 13px; color: #9ca3af; text-align: center; line-height: 1.5;">
                  Se você não deseja mais receber esses lembretes, pode desativá-los nas configurações de notificação do seu perfil.
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

        const emailResult = await sendEmailWithZeptoMail(userEmail, userName, message.subject, emailHtml);

        // Log email to database
        await supabaseClient.from("email_logs").insert({
          user_id: profile.user_id,
          email_to: userEmail,
          email_type: "inactivity_reminder_contextual",
          subject: message.subject,
          status: emailResult.success ? "sent" : "failed",
          error_message: emailResult.error || null,
          metadata: { days_inactive: daysSinceAccess, template_headline: message.headline }
        });

        if (!emailResult.success) {
          console.error("[INACTIVITY-REMINDERS] Email error for", userEmail, ":", emailResult.error);
          errors.push(`${userEmail}: ${emailResult.error}`);
        } else {
          emailsSent++;
          console.log("[INACTIVITY-REMINDERS] Reminder sent to:", userEmail);
        }

        // Delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 600));

      } catch (userError: any) {
        console.error("[INACTIVITY-REMINDERS] Error processing user:", profile.user_id, userError);
        errors.push(`${profile.user_id}: ${userError.message}`);
      }
    }

    console.log("[INACTIVITY-REMINDERS] Completed. Emails sent:", emailsSent, "Errors:", errors.length);

    return new Response(JSON.stringify({ 
      success: true, 
      emailsSent,
      totalInactive: inactiveProfiles.length,
      errors: errors.length > 0 ? errors : undefined
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("[INACTIVITY-REMINDERS] Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
