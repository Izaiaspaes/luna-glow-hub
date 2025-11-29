import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const ZEPTOMAIL_API_TOKEN = Deno.env.get("ZEPTOMAIL_API_TOKEN");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NewsletterConfirmationRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: NewsletterConfirmationRequest = await req.json();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    if (!ZEPTOMAIL_API_TOKEN) {
      console.error("ZEPTOMAIL_API_TOKEN is not configured");
      throw new Error("Email service not configured");
    }

    const emailResponse = await fetch("https://api.zeptomail.com/v1.1/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Zoho-enczapikey ${ZEPTOMAIL_API_TOKEN}`,
      },
      body: JSON.stringify({
        from: {
          address: "noreply@lunaglow.com.br",
          name: "Luna"
        },
        to: [
          {
            email_address: {
              address: email,
              name: ""
            }
          }
        ],
        subject: "Bem-vinda à Newsletter Luna! ✨",
        htmlbody: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #D946EF 0%, #EC4899 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px;">💜 Luna</h1>
              </div>
              
              <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
                <h2 style="color: #D946EF; margin-top: 0;">Bem-vinda à comunidade Luna!</h2>
                
                <p style="font-size: 16px; color: #4b5563;">
                  Obrigada por se inscrever na nossa newsletter! 🎉
                </p>
                
                <p style="font-size: 16px; color: #4b5563;">
                  A partir de agora, você receberá em primeira mão:
                </p>
                
                <ul style="font-size: 16px; color: #4b5563; padding-left: 20px;">
                  <li style="margin-bottom: 10px;">📚 Artigos exclusivos sobre saúde feminina</li>
                  <li style="margin-bottom: 10px;">💡 Dicas práticas de bem-estar e autocuidado</li>
                  <li style="margin-bottom: 10px;">🌸 Conteúdo sobre ciclo menstrual e equilíbrio hormonal</li>
                  <li style="margin-bottom: 10px;">✨ Novidades sobre recursos e funcionalidades do Luna</li>
                </ul>
                
                <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 25px 0;">
                  <p style="margin: 0; font-size: 14px; color: #6b7280;">
                    <strong>💡 Dica:</strong> Enquanto você espera nosso próximo artigo, que tal conhecer a plataforma Luna? 
                    Você pode rastrear seu ciclo, humor, sono e energia, e receber planos de bem-estar personalizados com IA.
                  </p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="https://luna-app.lovable.app" style="background: linear-gradient(135deg, #D946EF 0%, #EC4899 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
                    Conhecer o Luna
                  </a>
                </div>
                
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                
                <p style="font-size: 14px; color: #6b7280; text-align: center;">
                  Não quer mais receber nossas newsletters? 
                  <a href="#" style="color: #D946EF; text-decoration: none;">Cancelar inscrição</a>
                </p>
                
                <p style="font-size: 12px; color: #9ca3af; text-align: center; margin-top: 20px;">
                  © ${new Date().getFullYear()} Luna. Todos os direitos reservados.<br>
                  Sua plataforma de bem-estar, comunidade e lifestyle feminina.
                </p>
              </div>
            </body>
          </html>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("ZeptoMail API error:", errorText);
      throw new Error(`Failed to send email: ${errorText}`);
    }

    const emailData = await emailResponse.json();
    console.log("Newsletter confirmation email sent successfully via ZeptoMail:", emailData);

    return new Response(JSON.stringify(emailData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-newsletter-confirmation function:", error);
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
