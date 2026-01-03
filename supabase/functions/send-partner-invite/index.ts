import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ZEPTOMAIL_API_TOKEN = Deno.env.get("ZEPTOMAIL_API_TOKEN");
const ZOHO_EMAIL = Deno.env.get("ZOHO_EMAIL");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PartnerInviteRequest {
  partnerEmail: string;
  ownerName: string;
  inviteToken: string;
}

const logEmail = async (
  supabase: any,
  email: string,
  subject: string,
  status: string,
  errorMessage?: string,
  extraMetadata?: Record<string, unknown>
) => {
  try {
    await supabase.from("email_logs").insert({
      email_to: email,
      email_type: "partner_invite",
      subject,
      status,
      error_message: errorMessage?.trim() ? errorMessage : null,
      metadata: { source: "send-partner-invite", provider: "zeptomail", ...(extraMetadata ?? {}) },
    });
  } catch (logError) {
    console.error("Error logging email:", logError);
  }
};

const handler = async (req: Request): Promise<Response> => {
  console.log("=== send-partner-invite function started ===");
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

  let logEmailTo = "unknown";
  let logSubject = "Convite Luna a Dois";

  try {
    const body = await req.json();
    console.log("Request body:", JSON.stringify(body));

    const { partnerEmail, ownerName, inviteToken }: PartnerInviteRequest = body;

    logEmailTo = partnerEmail || "unknown";
    logSubject = `${ownerName} convidou você para o Luna a Dois 💜`;

    console.log(`Partner email: ${partnerEmail}, Owner: ${ownerName}`);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!partnerEmail || !emailRegex.test(partnerEmail)) {
      console.error("Invalid email:", partnerEmail);
      await logEmail(supabase, partnerEmail || "unknown", logSubject, "failed", "Invalid email address");
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!ZEPTOMAIL_API_TOKEN) {
      console.error("ZEPTOMAIL_API_TOKEN not configured");
      await logEmail(supabase, partnerEmail, logSubject, "failed", "ZEPTOMAIL_API_TOKEN not configured");
      throw new Error("Email service not configured");
    }

    const fromEmail = ZOHO_EMAIL || "noreply@lunaglow.com.br";
    console.log(`Using sender email: ${fromEmail}`);

    const acceptUrl = `https://lunaglow.com.br/partner-invite?token=${inviteToken}`;
    console.log("Accept URL:", acceptUrl);

    const subject = `${ownerName} convidou você para o Luna a Dois 💜`;

    const htmlBody = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #D946EF 0%, #EC4899 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">💜 Luna a Dois</h1>
          </div>

          <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #D946EF; margin-top: 0;">Você recebeu um convite especial!</h2>

            <p style="font-size: 16px; color: #4b5563;">
              <strong>${ownerName}</strong> convidou você para acompanhar o ciclo dela através do <strong>Luna a Dois</strong>.
            </p>

            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="margin-top: 0; color: #1f2937; font-size: 18px;">O que é o Luna a Dois?</h3>
              <p style="margin: 0; font-size: 14px; color: #6b7280; line-height: 1.8;">
                É uma funcionalidade que permite que parceiros(as) acompanhem o ciclo menstrual de forma educativa e respeitosa,
                recebendo dicas de apoio emocional e aprendendo sobre as diferentes fases do ciclo.
              </p>
            </div>

            <p style="font-size: 16px; color: #4b5563;">
              <strong>Você terá acesso a:</strong>
            </p>

            <ul style="font-size: 16px; color: #4b5563; padding-left: 20px;">
              <li style="margin-bottom: 10px;">📅 Visualização do ciclo atual e próximas fases</li>
              <li style="margin-bottom: 10px;">📚 Conteúdo educativo sobre cada fase do ciclo</li>
              <li style="margin-bottom: 10px;">💡 Dicas de apoio emocional personalizadas</li>
              <li style="margin-bottom: 10px;">🔔 Notificações de mudanças importantes</li>
            </ul>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${acceptUrl}" style="background: linear-gradient(135deg, #D946EF 0%, #EC4899 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 16px;">
                Aceitar Convite
              </a>
            </div>

            <p style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 25px;">
              Se você não conhece ${ownerName} ou não deseja aceitar, pode ignorar este e-mail com segurança.
            </p>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

            <p style="font-size: 12px; color: #9ca3af; text-align: center; margin-top: 20px;">
              © ${new Date().getFullYear()} Luna. Todos os direitos reservados.<br>
              Sua plataforma de bem-estar, comunidade e lifestyle feminina.
            </p>
          </div>
        </body>
      </html>
    `;

    // ZeptoMail API v1.1 - REST call
    const zeptoPayload = {
      from: {
        address: fromEmail,
        name: "Luna"
      },
      to: [
        {
          email_address: {
            address: partnerEmail,
            name: partnerEmail.split("@")[0]
          }
        }
      ],
      subject: subject,
      htmlbody: htmlBody
    };

    console.log("Sending email via ZeptoMail API...");
    console.log("Payload:", JSON.stringify({ ...zeptoPayload, htmlbody: "[HTML content]" }));

    const zeptoResponse = await fetch("https://api.zeptomail.com/v1.1/email", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": ZEPTOMAIL_API_TOKEN
      },
      body: JSON.stringify(zeptoPayload)
    });

    const responseText = await zeptoResponse.text();
    console.log(`ZeptoMail response status: ${zeptoResponse.status}`);
    console.log(`ZeptoMail response body: ${responseText}`);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { raw: responseText };
    }

    if (!zeptoResponse.ok) {
      const errorMsg = responseData?.message || responseData?.error || `HTTP ${zeptoResponse.status}`;
      console.error("ZeptoMail error:", errorMsg);
      await logEmail(supabase, partnerEmail, subject, "failed", errorMsg, {
        zeptomail_status: zeptoResponse.status,
        zeptomail_response: responseData
      });
      throw new Error(`ZeptoMail error: ${errorMsg}`);
    }

    console.log("Partner invite email sent successfully via ZeptoMail!");
    await logEmail(supabase, partnerEmail, subject, "sent", undefined, {
      zeptomail_request_id: responseData?.request_id,
      zeptomail_data: responseData?.data
    });

    return new Response(JSON.stringify({ success: true, data: responseData }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    const message = error?.message ? String(error.message) : String(error);
    console.error("Error in send-partner-invite function:", error);

    await logEmail(supabase, logEmailTo, logSubject, "failed", message, {
      stage: "catch",
    });

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
