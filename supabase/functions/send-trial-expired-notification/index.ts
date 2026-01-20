import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

async function sendPushNotification(
  supabaseClient: any,
  userIds: string[],
  title: string,
  body: string
): Promise<{ success: boolean; sent: number; failed: number }> {
  try {
    const { data: subscriptions, error: fetchError } = await supabaseClient
      .from('push_subscriptions')
      .select('subscription_data, user_id')
      .in('user_id', userIds);

    if (fetchError || !subscriptions || subscriptions.length === 0) {
      console.log('[PUSH] No subscriptions found for users:', userIds);
      return { success: true, sent: 0, failed: 0 };
    }

    console.log(`[PUSH] Found ${subscriptions.length} subscriptions`);

    const notificationPayload = JSON.stringify({
      title,
      body,
      icon: '/pwa-192x192.png',
      badge: '/favicon.png',
      data: { url: '/pricing' },
      timestamp: Date.now()
    });

    let sent = 0;
    let failed = 0;

    for (const sub of subscriptions) {
      try {
        const subscriptionData = sub.subscription_data;
        
        if (!subscriptionData?.endpoint) {
          failed++;
          continue;
        }

        const response = await fetch(subscriptionData.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain;charset=UTF-8',
            'TTL': '86400',
            'Urgency': 'high',
          },
          body: notificationPayload
        });

        if (response.ok || response.status === 201) {
          sent++;
          console.log('[PUSH] Sent to:', sub.user_id);
        } else {
          failed++;
          if (response.status === 410 || response.status === 404) {
            await supabaseClient
              .from('push_subscriptions')
              .delete()
              .eq('user_id', sub.user_id);
          }
        }
      } catch (error) {
        failed++;
        console.error('[PUSH] Error:', error);
      }
    }

    return { success: true, sent, failed };
  } catch (error) {
    console.error('[PUSH] Error:', error);
    return { success: false, sent: 0, failed: 0 };
  }
}

function firstWordFromName(name?: string | null): string | null {
  const n = (name ?? "").trim();
  if (!n) return null;
  return n.split(/\s+/)[0] || null;
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

  const e = (opts.email ?? "").trim();
  if (e && e.includes("@")) {
    const local = e.split("@")[0]?.trim();
    if (local) {
      const token = local.split(/[._-]+/).filter(Boolean)[0] ?? local;
      const cleaned = token.replace(/[0-9]+/g, "").trim();
      const base = cleaned || token;
      if (base) return base.charAt(0).toUpperCase() + base.slice(1);
    }
  }

  return "Luna";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("[TRIAL-EXPIRED] Starting expired trial check...");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Find users whose trial expired today (within the last 24 hours)
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    // Get users whose trial ended between yesterday and today (to catch all recently expired)
    const yesterday = new Date(startOfToday);
    yesterday.setDate(yesterday.getDate() - 1);

    const { data: expiredTrials, error: trialsError } = await supabaseClient
      .from("profiles")
      .select("user_id, full_name, trial_ends_at, subscription_plan")
      .gte("trial_ends_at", yesterday.toISOString())
      .lte("trial_ends_at", endOfToday.toISOString())
      .eq("subscription_plan", "free");

    if (trialsError) {
      console.error("[TRIAL-EXPIRED] Error fetching trials:", trialsError);
      throw trialsError;
    }

    // Filter to only include trials that have actually expired (trial_ends_at < now)
    const actuallyExpired = (expiredTrials || []).filter(profile => {
      const trialEnd = new Date(profile.trial_ends_at);
      return trialEnd < now;
    });

    console.log("[TRIAL-EXPIRED] Found", actuallyExpired.length, "expired trials");

    if (actuallyExpired.length === 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: "No expired trials found",
        emailsSent: 0,
        pushSent: 0
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Check which users have already received an expired notification
    const userIds = actuallyExpired.map(p => p.user_id);
    const { data: existingLogs } = await supabaseClient
      .from("email_logs")
      .select("user_id")
      .in("user_id", userIds)
      .eq("email_type", "trial_expired_notification");

    const alreadyNotified = new Set((existingLogs || []).map(l => l.user_id));
    const usersToNotify = actuallyExpired.filter(p => !alreadyNotified.has(p.user_id));

    console.log("[TRIAL-EXPIRED]", usersToNotify.length, "users to notify (not yet notified)");

    if (usersToNotify.length === 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: "All expired trial users already notified",
        emailsSent: 0,
        pushSent: 0
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    let emailsSent = 0;
    let pushSent = 0;
    const errors: string[] = [];
    const userIdsForPush: string[] = [];

    for (const profile of usersToNotify) {
      try {
        const { data: userData, error: userError } = await supabaseClient.auth.admin.getUserById(profile.user_id);
        
        if (userError || !userData?.user?.email) {
          console.log("[TRIAL-EXPIRED] Skipping user without email:", profile.user_id);
          continue;
        }

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

        console.log("[TRIAL-EXPIRED] Processing user:", profile.user_id, "Name:", userName);

        userIdsForPush.push(profile.user_id);

        const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f4ff;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: linear-gradient(135deg, #6b7280, #374151); padding: 35px; border-radius: 20px 20px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 26px;">😢 Seu Trial Premium expirou</h1>
            </div>
            
            <div style="background: white; padding: 40px; border-radius: 0 0 20px 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.1);">
              <p style="font-size: 18px; color: #374151; line-height: 1.6;">
                Olá, <strong>${userName}</strong>! 🌸
              </p>
              
              <p style="font-size: 16px; color: #6b7280; line-height: 1.6;">
                Seu período de trial Premium <strong>chegou ao fim</strong>. Os recursos exclusivos que você estava aproveitando foram desativados.
              </p>
              
              <div style="background: linear-gradient(135deg, #fee2e2, #fecaca); padding: 25px; border-radius: 15px; margin: 30px 0; border-left: 4px solid #ef4444;">
                <h2 style="color: #991b1b; margin: 0 0 15px 0; font-size: 18px;">❌ Recursos desativados:</h2>
                <ul style="list-style: none; padding: 0; margin: 0; color: #374151;">
                  <li style="padding: 8px 0; font-size: 15px;">🚫 Planos de bem-estar ilimitados com IA</li>
                  <li style="padding: 8px 0; font-size: 15px;">🚫 Diário da Mulher com análise inteligente</li>
                  <li style="padding: 8px 0; font-size: 15px;">🚫 Previsão de sintomas personalizados</li>
                  <li style="padding: 8px 0; font-size: 15px;">🚫 Luna Sense - sua assistente de bem-estar</li>
                  <li style="padding: 8px 0; font-size: 15px;">🚫 Análise de Beleza com IA</li>
                  <li style="padding: 8px 0; font-size: 15px;">🚫 Armário Virtual com sugestões de looks</li>
                </ul>
              </div>
              
              <div style="background: linear-gradient(135deg, #dbeafe, #bfdbfe); padding: 25px; border-radius: 15px; margin: 30px 0; border-left: 4px solid #3b82f6;">
                <h2 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">💜 Ainda dá tempo!</h2>
                <p style="font-size: 16px; color: #374151; margin: 0;">
                  Você pode <strong>reativar todos esses recursos agora</strong> assinando o Premium. 
                  Continue sua jornada de autocuidado com todas as ferramentas que você já conhece e ama!
                </p>
              </div>
              
              <div style="text-align: center; margin: 35px 0;">
                <a href="https://lunaglow.com.br/pricing" 
                   style="display: inline-block; background: linear-gradient(135deg, #ec4899, #8b5cf6); color: white; padding: 16px 40px; border-radius: 30px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);">
                  Reativar Premium agora →
                </a>
              </div>
              
              <p style="font-size: 14px; color: #9ca3af; line-height: 1.6; text-align: center;">
                A partir de <strong>R$ 19,90/mês</strong> - menos que um café por dia para cuidar de você! ☕💜
              </p>
              
              <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 25px;">
                <p style="font-size: 13px; color: #9ca3af; text-align: center; line-height: 1.5;">
                  Sentiu falta de alguma coisa? Responda este email e nos conte como podemos melhorar!
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

        const emailSubject = `😢 ${userName}, seu Trial Premium expirou - Reative agora!`;
        const emailResult = await sendEmailWithZeptoMail(userEmail, userName, emailSubject, emailHtml);

        await supabaseClient.from("email_logs").insert({
          user_id: profile.user_id,
          email_to: userEmail,
          email_type: "trial_expired_notification",
          subject: emailSubject,
          status: emailResult.success ? "sent" : "failed",
          error_message: emailResult.error || null,
          metadata: { 
            trial_ends_at: profile.trial_ends_at
          }
        });

        if (!emailResult.success) {
          console.error("[TRIAL-EXPIRED] Email error for", userEmail, ":", emailResult.error);
          errors.push(`${userEmail}: ${emailResult.error}`);
        } else {
          emailsSent++;
          console.log("[TRIAL-EXPIRED] Notification sent to:", userEmail);
        }

        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (userError: any) {
        console.error("[TRIAL-EXPIRED] Error processing user:", profile.user_id, userError);
        errors.push(`${profile.user_id}: ${userError.message}`);
      }
    }

    // Send push notifications
    if (userIdsForPush.length > 0) {
      const pushResult = await sendPushNotification(
        supabaseClient,
        userIdsForPush,
        "😢 Seu Trial Premium expirou",
        "Os recursos exclusivos foram desativados. Assine agora para continuar cuidando de você!"
      );
      pushSent = pushResult.sent;

      await supabaseClient.from("email_logs").insert({
        email_type: "push_trial_expired",
        email_to: userIdsForPush.join(", "),
        subject: "Trial Expired Push",
        status: pushResult.sent > 0 ? "sent" : "no_subscriptions",
        metadata: { 
          push_sent: pushResult.sent,
          push_failed: pushResult.failed,
          total_users: userIdsForPush.length
        }
      });
    }

    console.log("[TRIAL-EXPIRED] Completed. Emails sent:", emailsSent, "Push sent:", pushSent, "Errors:", errors.length);

    return new Response(JSON.stringify({ 
      success: true, 
      emailsSent,
      pushSent,
      totalExpired: usersToNotify.length,
      errors: errors.length > 0 ? errors : undefined
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("[TRIAL-EXPIRED] Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
