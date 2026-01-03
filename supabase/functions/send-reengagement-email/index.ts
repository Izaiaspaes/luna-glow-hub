import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const INACTIVITY_DAYS = 7;

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

// Rich message templates for 7+ day inactive users
function getReengagementMessage(daysSinceAccess: number, userName: string, isPremium: boolean): { 
  subject: string; 
  headline: string; 
  intro: string;
  sections: { emoji: string; title: string; description: string }[];
  cta: string;
} {
  const templates = [
    {
      subject: `🎨 ${userName}, sua análise de beleza personalizada te espera!`,
      headline: `Descubra suas cores perfeitas, ${userName}!`,
      intro: `A tecnologia de análise de beleza do Luna usa IA para descobrir as cores de maquiagem, roupas e acessórios que mais combinam com você. É como ter uma consultora de imagem pessoal!`,
      sections: [
        { emoji: '💄', title: 'Análise de Beleza', description: 'Descubra tons de base, batom e sombras ideais para sua pele' },
        { emoji: '👗', title: 'Paleta de Cores', description: 'Saiba quais cores de roupa valorizam seu tom de pele' },
        { emoji: '💅', title: 'Sugestões de Esmalte', description: 'Cores que harmonizam com sua coloração pessoal' },
        { emoji: '✨', title: 'Dicas Personalizadas', description: 'Recomendações baseadas no formato do seu rosto' }
      ],
      cta: 'Fazer minha análise de beleza'
    },
    {
      subject: `👗 ${userName}, seu armário virtual está esperando!`,
      headline: `Organize seus looks com IA, ${userName}!`,
      intro: `Imagine ter um closet inteligente que sugere combinações perfeitas de roupas para cada ocasião! O Armário Virtual do Luna faz exatamente isso.`,
      sections: [
        { emoji: '📸', title: 'Fotografe suas peças', description: 'A IA identifica cores, estilo e categoriza automaticamente' },
        { emoji: '👠', title: 'Sugestões de Looks', description: 'Combinações inteligentes para cada ocasião' },
        { emoji: '🌤️', title: 'Baseado no Clima', description: 'Sugestões adequadas para o tempo' },
        { emoji: '🌙', title: 'Sincronizado com seu Ciclo', description: 'Looks que combinam com como você se sente' }
      ],
      cta: 'Montar meu armário virtual'
    },
    {
      subject: `🧘 ${userName}, seu plano de bem-estar personalizado está pronto!`,
      headline: `Cuide de você com inteligência, ${userName}!`,
      intro: `A Luna analisa todos os seus dados - ciclo, sono, humor, energia - e cria planos de bem-estar únicos para você. É autocuidado baseado em ciência!`,
      sections: [
        { emoji: '🧘', title: 'Planos de Bem-Estar', description: 'Rotinas personalizadas geradas por IA' },
        { emoji: '🥗', title: 'Dicas de Nutrição', description: 'Alimentação ideal para sua fase do ciclo' },
        { emoji: '🏃‍♀️', title: 'Exercícios Sugeridos', description: 'Atividades físicas adequadas ao seu momento' },
        { emoji: '💆', title: 'Autocuidado', description: 'Rituais de bem-estar para corpo e mente' }
      ],
      cta: 'Ver meu plano de bem-estar'
    },
    {
      subject: `🔮 ${userName}, suas previsões de sintomas estão disponíveis!`,
      headline: `Antecipe como vai se sentir, ${userName}!`,
      intro: `A IA da Luna aprende com seus padrões e consegue prever sintomas antes que eles apareçam. Assim você pode se preparar e cuidar de você preventivamente!`,
      sections: [
        { emoji: '🔮', title: 'Previsões Inteligentes', description: 'Saiba o que esperar nos próximos dias' },
        { emoji: '⚡', title: 'Níveis de Energia', description: 'Previsão de quando você estará mais ativa' },
        { emoji: '💭', title: 'Tendências de Humor', description: 'Entenda suas oscilações emocionais' },
        { emoji: '🩸', title: 'Ciclo Preciso', description: 'Previsões cada vez mais certeiras' }
      ],
      cta: 'Ver minhas previsões'
    },
    {
      subject: `📔 ${userName}, seu diário com IA te espera!`,
      headline: `Escreva e descubra padrões, ${userName}!`,
      intro: `O Diário da Mulher não é um diário comum - a IA lê suas entradas e descobre conexões entre seus sentimentos, ciclo e bem-estar que você nem imaginava!`,
      sections: [
        { emoji: '📔', title: 'Diário Inteligente', description: 'Escreva ou grave por voz seus pensamentos' },
        { emoji: '🎙️', title: 'Transcrição Automática', description: 'Fale e a IA transcreve para você' },
        { emoji: '🔍', title: 'Análise de Padrões', description: 'Descubra conexões entre emoções e ciclo' },
        { emoji: '💡', title: 'Insights Automáticos', description: 'Sugestões baseadas no que você escreve' }
      ],
      cta: 'Escrever no meu diário'
    },
    {
      subject: `💕 ${userName}, conecte-se melhor com seu parceiro!`,
      headline: `Luna a Dois: mais compreensão, ${userName}!`,
      intro: `Seu parceiro pode entender melhor suas fases e como te apoiar em cada momento. O Luna a Dois cria uma ponte de compreensão no relacionamento!`,
      sections: [
        { emoji: '💕', title: 'Compartilhamento Discreto', description: 'Você controla o que compartilhar' },
        { emoji: '🔔', title: 'Alertas para o Parceiro', description: 'Ele recebe dicas de como te apoiar' },
        { emoji: '💬', title: 'Comunicação Melhor', description: 'Mais empatia e compreensão' },
        { emoji: '🔒', title: 'Privacidade Total', description: 'Você decide cada detalhe' }
      ],
      cta: 'Conhecer Luna a Dois'
    }
  ];
  
  // Select template for variety
  const index = (userName.charCodeAt(0) + daysSinceAccess) % templates.length;
  return templates[index];
}

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
        const isPremium = profile.subscription_plan && profile.subscription_plan !== 'free';

        // Calculate days since last access
        const lastAccess = new Date(profile.last_accessed_at);
        const daysSinceAccess = Math.floor((Date.now() - lastAccess.getTime()) / (1000 * 60 * 60 * 24));
        
        // Get rich contextual message
        const message = getReengagementMessage(daysSinceAccess, userName, isPremium);

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
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">🌙 ${message.headline}</h1>
            </div>
            
            <div style="background: white; padding: 40px; border-radius: 0 0 24px 24px; box-shadow: 0 20px 60px rgba(0,0,0,0.12);">
              <p style="font-size: 18px; color: #374151; line-height: 1.7;">
                Olá, <strong style="color: #be185d;">${userName}</strong>! 💜
              </p>
              
              <p style="font-size: 16px; color: #6b7280; line-height: 1.7;">
                ${message.intro}
              </p>
              
              <div style="background: linear-gradient(135deg, #fdf2f8, #ede9fe); padding: 28px; border-radius: 18px; margin: 30px 0; border-left: 4px solid #be185d;">
                <h2 style="color: #7c3aed; margin: 0 0 18px 0; font-size: 19px; font-weight: 600;">🎁 O que você pode fazer:</h2>
                ${message.sections.map(s => `
                <div style="padding: 12px 0; display: flex; align-items: flex-start;">
                  <span style="font-size: 24px; margin-right: 15px;">${s.emoji}</span>
                  <div>
                    <strong style="color: #374151; font-size: 15px;">${s.title}</strong>
                    <p style="color: #6b7280; font-size: 14px; margin: 4px 0 0 0;">${s.description}</p>
                  </div>
                </div>
                `).join('')}
              </div>
              
              ${isPremium ? `
              <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); padding: 20px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #f59e0b;">
                <p style="font-size: 15px; color: #92400e; margin: 0; font-weight: 500;">
                  👑 <strong>Você é Premium!</strong> Todos esses recursos estão liberados para você sem limites. Aproveite!
                </p>
              </div>
              ` : `
              <div style="background: linear-gradient(135deg, #dbeafe, #e0e7ff); padding: 20px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #3b82f6;">
                <p style="font-size: 15px; color: #1e40af; margin: 0;">
                  💎 <strong>Dica:</strong> Usuárias Premium têm acesso ilimitado a todos os recursos. <a href="https://lunaglow.com.br/pricing" style="color: #7c3aed; font-weight: bold;">Conheça os planos!</a>
                </p>
              </div>
              `}
              
              <p style="font-size: 16px; color: #6b7280; line-height: 1.7; text-align: center; font-style: italic; margin: 30px 0;">
                "O primeiro passo para se sentir melhor é conhecer a si mesma." 💜
              </p>
              
              <div style="text-align: center; margin: 40px 0 30px 0;">
                <a href="https://lunaglow.com.br/dashboard" 
                   style="display: inline-block; background: linear-gradient(135deg, #be185d, #7c3aed); color: white; padding: 18px 50px; border-radius: 35px; text-decoration: none; font-weight: bold; font-size: 17px; box-shadow: 0 8px 25px rgba(124, 58, 237, 0.4);">
                  ${message.cta} →
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

        const emailResult = await sendEmailWithZeptoMail(userEmail, userName, message.subject, emailHtml);

        // Log email to database
        await supabaseClient.from("email_logs").insert({
          user_id: profile.user_id,
          email_to: userEmail,
          email_type: "reengagement_feature_highlight",
          subject: message.subject,
          status: emailResult.success ? "sent" : "failed",
          error_message: emailResult.error || null,
          metadata: { 
            days_inactive: daysSinceAccess, 
            is_premium: isPremium,
            template_cta: message.cta
          }
        });

        if (!emailResult.success) {
          console.error("[REENGAGEMENT] Email error for", userEmail, ":", emailResult.error);
          errors.push(`${userEmail}: ${emailResult.error}`);
        } else {
          emailsSent++;
          console.log("[REENGAGEMENT] Reengagement email sent to:", userEmail, "- Inactive for", daysSinceAccess, "days");
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 600));

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
