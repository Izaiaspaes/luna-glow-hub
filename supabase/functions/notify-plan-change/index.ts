import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

interface NotifyPlanChangeRequest {
  userId: string;
  newPlan: string;
  oldPlan: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Authenticate the request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user: adminUser }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !adminUser) {
      throw new Error("Unauthorized");
    }

    const { userId, newPlan, oldPlan } = await req.json() as NotifyPlanChangeRequest;

    console.log("Notifying plan change for user:", userId, "from", oldPlan, "to", newPlan);

    // Get user email from auth.users
    const { data: userData, error: userError } = await supabaseClient.auth.admin.getUserById(userId);
    
    if (userError || !userData?.user?.email) {
      console.error("Error fetching user:", userError);
      throw new Error("User not found");
    }

    const userEmail = userData.user.email;

    // Get user profile for name
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("full_name")
      .eq("user_id", userId)
      .single();

    const userName = profile?.full_name || userEmail.split("@")[0];

    // Translate plan names
    const planNames: Record<string, string> = {
      free: "Free",
      premium: "✨ Premium",
      premium_plus: "💎 Premium Plus",
    };

    const oldPlanName = planNames[oldPlan] || oldPlan;
    const newPlanName = planNames[newPlan] || newPlan;

    // Send email notification
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Luna <contato.luna@topdigitais.net>",
        to: [userEmail],
        subject: "Seu plano Luna foi atualizado! 🎉",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #FF6B9D 0%, #C084FC 50%, #60A5FA 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .header h1 { color: white; margin: 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .plan-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #C084FC; }
                .button { display: inline-block; background: linear-gradient(135deg, #FF6B9D, #C084FC); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🎉 Plano Atualizado!</h1>
                </div>
                <div class="content">
                  <p>Olá <strong>${userName}</strong>,</p>
                  
                  <p>Temos uma ótima notícia! Seu plano Luna foi atualizado:</p>
                  
                  <div class="plan-box">
                    <p style="margin: 0;"><strong>Plano Anterior:</strong> ${oldPlanName}</p>
                    <p style="margin: 10px 0 0 0;"><strong>Novo Plano:</strong> ${newPlanName}</p>
                  </div>
                  
                  <p>Agora você tem acesso a todas as funcionalidades exclusivas do seu novo plano!</p>
                  
                  <p>Entre no app para explorar tudo o que está disponível para você:</p>
                  
                  <div style="text-align: center;">
                    <a href="https://luna-app.lovable.app/dashboard" class="button">Acessar Dashboard</a>
                  </div>
                  
                  <p style="margin-top: 30px;">Se você tiver alguma dúvida, estamos sempre à disposição!</p>
                  
                  <p>Com carinho,<br><strong>Equipe Luna</strong> 💜</p>
                </div>
                
                <div class="footer">
                  <p>Luna - Sua jornada de bem-estar personalizada</p>
                  <p>Suporte: suporte@topdigitais.net | WhatsApp: +55 11 96369-7488</p>
                </div>
              </div>
            </body>
          </html>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("Resend API error:", errorText);
      throw new Error(`Failed to send email: ${errorText}`);
    }

    const emailData = await emailResponse.json();
    console.log("Email sent successfully:", emailData);

    return new Response(
      JSON.stringify({ success: true, emailId: emailData.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in notify-plan-change function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});