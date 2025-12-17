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
      .select("user_id, full_name, last_accessed_at")
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
        const { data: onboarding } = await supabaseClient
          .from("user_onboarding_data")
          .select("preferred_name, full_name")
          .eq("user_id", profile.user_id)
          .maybeSingle();

        // Priority: preferred_name > onboarding.full_name first word > profile.full_name first word
        let userName = "Querida";
        if (onboarding?.preferred_name) {
          userName = onboarding.preferred_name;
        } else if (onboarding?.full_name) {
          userName = onboarding.full_name.split(" ")[0];
        } else if (profile.full_name) {
          userName = profile.full_name.split(" ")[0];
        }
        
        console.log("[INACTIVITY-REMINDERS] User:", profile.user_id, "Name:", userName);
        const userEmail = userData.user.email;

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
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f4ff;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: linear-gradient(135deg, #ec4899, #8b5cf6); padding: 35px; border-radius: 20px 20px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 26px;">💜 Sentimos sua falta, ${userName}!</h1>
            </div>
            
            <div style="background: white; padding: 40px; border-radius: 0 0 20px 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.1);">
              <p style="font-size: 18px; color: #374151; line-height: 1.6;">
                Olá, <strong>${userName}</strong>! 🌸
              </p>
              
              <p style="font-size: 16px; color: #6b7280; line-height: 1.6;">
                Já faz <strong>${daysSinceAccess} dias</strong> desde sua última visita ao Luna. Sabemos que a vida pode ser corrida, mas registrar seus dados diariamente ajuda a IA a te conhecer melhor e oferecer recomendações cada vez mais personalizadas!
              </p>
              
              <div style="background: linear-gradient(135deg, #fdf2f8, #f3e8ff); padding: 25px; border-radius: 15px; margin: 30px 0;">
                <h2 style="color: #7c3aed; margin: 0 0 15px 0; font-size: 18px;">✨ O que você pode registrar hoje:</h2>
                <ul style="list-style: none; padding: 0; margin: 0; color: #374151;">
                  <li style="padding: 8px 0; font-size: 15px;">🌙 Como foi seu sono?</li>
                  <li style="padding: 8px 0; font-size: 15px;">💭 Como está seu humor?</li>
                  <li style="padding: 8px 0; font-size: 15px;">⚡ Qual seu nível de energia?</li>
                  <li style="padding: 8px 0; font-size: 15px;">🩸 Atualizações do seu ciclo</li>
                  <li style="padding: 8px 0; font-size: 15px;">📔 Escrever no seu diário</li>
                </ul>
              </div>
              
              <p style="font-size: 15px; color: #6b7280; line-height: 1.6; font-style: italic;">
                "Cada registro que você faz ajuda a Luna a entender melhor seu corpo e mente, oferecendo insights únicos para seu bem-estar." 💜
              </p>
              
              <div style="text-align: center; margin: 35px 0;">
                <a href="https://lunaglow.com.br/dashboard" 
                   style="display: inline-block; background: linear-gradient(135deg, #ec4899, #8b5cf6); color: white; padding: 16px 40px; border-radius: 30px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);">
                  Voltar para o Luna →
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

        const emailSubject = `💜 ${userName}, sentimos sua falta no Luna!`;
        const emailResult = await sendEmailWithZeptoMail(userEmail, userName, emailSubject, emailHtml);

        // Log email to database
        await supabaseClient.from("email_logs").insert({
          user_id: profile.user_id,
          email_to: userEmail,
          email_type: "inactivity_reminder_2days",
          subject: emailSubject,
          status: emailResult.success ? "sent" : "failed",
          error_message: emailResult.error || null,
          metadata: { days_inactive: daysSinceAccess }
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
