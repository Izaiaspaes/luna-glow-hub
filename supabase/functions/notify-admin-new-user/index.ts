import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const ZEPTOMAIL_API_TOKEN = Deno.env.get("ZEPTOMAIL_API_TOKEN");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NewUserNotification {
  userId: string;
  userEmail: string;
  userName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, userEmail, userName }: NewUserNotification = await req.json();

    console.log(`Notifying admins about new user: ${userEmail}`);

    if (!ZEPTOMAIL_API_TOKEN) {
      console.error("ZEPTOMAIL_API_TOKEN is not configured");
      throw new Error("Email service not configured");
    }

    // Create Supabase client with service role to fetch admin emails
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get all admin users
    const { data: adminRoles, error: rolesError } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin");

    if (rolesError) {
      console.error("Error fetching admin roles:", rolesError);
      throw new Error("Failed to fetch admin users");
    }

    if (!adminRoles || adminRoles.length === 0) {
      console.log("No admin users found to notify");
      return new Response(
        JSON.stringify({ message: "No admin users to notify" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Get admin emails from auth.users
    const adminUserIds = adminRoles.map((role) => role.user_id);
    
    // Fetch profiles to get full names and emails
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("user_id, full_name")
      .in("user_id", adminUserIds);

    if (profilesError) {
      console.error("Error fetching admin profiles:", profilesError);
    }

    // Get admin emails from auth.users using admin API
    const { data: { users: adminUsers }, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error("Error fetching admin users:", usersError);
      throw new Error("Failed to fetch admin emails");
    }

    const adminEmails = adminUsers
      .filter((user) => adminUserIds.includes(user.id))
      .map((user) => user.email)
      .filter((email): email is string => !!email);

    if (adminEmails.length === 0) {
      console.log("No admin emails found");
      return new Response(
        JSON.stringify({ message: "No admin emails found" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`Sending notification to ${adminEmails.length} admin(s)`);

    const displayName = userName || userEmail.split("@")[0];

    // Send email to all admins
    const emailPromises = adminEmails.map(async (adminEmail) => {
      const emailResponse = await fetch("https://api.zeptomail.com/v1.1/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Zoho-enczapikey ${ZEPTOMAIL_API_TOKEN}`,
        },
        body: JSON.stringify({
          from: {
            address: "noreply@lunaglow.com.br",
            name: "Luna - Notificações"
          },
          to: [
            {
              email_address: {
                address: adminEmail,
                name: ""
              }
            }
          ],
          subject: "🎉 Novo Usuário Cadastrado - Luna",
          htmlbody: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #D946EF 0%, #EC4899 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                  <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Novo Cadastro!</h1>
                </div>
                
                <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
                  <h2 style="color: #D946EF; margin-top: 0;">Uma nova usuária se cadastrou na Luna!</h2>
                  
                  <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 25px 0;">
                    <h3 style="margin-top: 0; color: #1f2937; font-size: 18px;">Informações do Cadastro</h3>
                    <p style="margin: 10px 0; font-size: 16px;"><strong>Nome:</strong> ${displayName}</p>
                    <p style="margin: 10px 0; font-size: 16px;"><strong>Email:</strong> ${userEmail}</p>
                    <p style="margin: 10px 0; font-size: 16px;"><strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR', { 
                      day: '2-digit', 
                      month: 'long', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                  </div>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="https://luna-app.lovable.app/admin" style="background: linear-gradient(135deg, #D946EF 0%, #EC4899 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 16px;">
                      Ver no Painel Administrativo
                    </a>
                  </div>
                  
                  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                  
                  <p style="font-size: 12px; color: #9ca3af; text-align: center; margin-top: 20px;">
                    © ${new Date().getFullYear()} Luna. Todos os direitos reservados.<br>
                    Você está recebendo este email porque é administrador da plataforma Luna.
                  </p>
                </div>
              </body>
            </html>
          `,
        }),
      });

      if (!emailResponse.ok) {
        const errorText = await emailResponse.text();
        console.error(`Failed to send email to ${adminEmail}:`, errorText);
        throw new Error(`Failed to send email: ${errorText}`);
      }

      return emailResponse.json();
    });

    const results = await Promise.all(emailPromises);
    console.log(`Successfully sent ${results.length} notification email(s)`);

    return new Response(
      JSON.stringify({ 
        message: "Admin notifications sent successfully",
        emailsSent: results.length 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in notify-admin-new-user function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
