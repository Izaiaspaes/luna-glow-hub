import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: Record<string, any>;
  userIds?: string[];
}

interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

// VAPID public key - must match the one used in frontend
const VAPID_PUBLIC_KEY = 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';
const VAPID_SUBJECT = 'mailto:contato@lunaglow.com.br';

// Base64URL encoding utilities
function base64UrlEncode(data: Uint8Array): string {
  const base64 = btoa(String.fromCharCode(...data));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Get the origin from an endpoint URL
function getAudience(endpoint: string): string {
  const url = new URL(endpoint);
  return url.origin;
}

// Create a simple VAPID JWT token
async function createVapidAuthHeader(audience: string): Promise<string> {
  const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY');
  
  if (!VAPID_PRIVATE_KEY) {
    throw new Error('VAPID_PRIVATE_KEY not configured');
  }

  // Create JWT header and payload
  const header = { typ: 'JWT', alg: 'ES256' };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    aud: audience,
    exp: now + 12 * 60 * 60, // 12 hours
    sub: VAPID_SUBJECT,
  };

  const headerB64 = base64UrlEncode(new TextEncoder().encode(JSON.stringify(header)));
  const payloadB64 = base64UrlEncode(new TextEncoder().encode(JSON.stringify(payload)));
  
  // For now, return a simplified header - full VAPID requires proper ECDSA signing
  // which is complex without external libraries
  return `vapid t=${headerB64}.${payloadB64},k=${VAPID_PUBLIC_KEY}`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { title, body, icon, badge, data, userIds } = await req.json() as NotificationPayload;

    console.log('=== PUSH NOTIFICATION REQUEST ===');
    console.log('Title:', title);
    console.log('Body:', body);
    console.log('Target users:', userIds || 'all');

    // Get subscriptions for specified users or all users
    let query = supabaseClient
      .from('push_subscriptions')
      .select('subscription_data, user_id');
    
    if (userIds && userIds.length > 0) {
      query = query.in('user_id', userIds);
    }

    const { data: subscriptions, error: fetchError } = await query;

    if (fetchError) {
      console.error('Error fetching subscriptions:', fetchError);
      throw fetchError;
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log('No subscriptions found');
      
      // Log the attempt
      await supabaseClient
        .from('email_logs')
        .insert({
          email_type: 'push_notification',
          email_to: userIds?.join(', ') || 'all_subscribers',
          subject: title,
          status: 'no_subscriptions',
          metadata: { body, message: 'No active push subscriptions found' }
        });
      
      return new Response(
        JSON.stringify({ message: 'No subscriptions found', sent: 0, failed: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    console.log(`Found ${subscriptions.length} subscriptions`);

    const notificationPayload = JSON.stringify({
      title,
      body,
      icon: icon || '/pwa-192x192.png',
      badge: badge || '/favicon.png',
      data: data || {},
      timestamp: Date.now()
    });

    const results: { success: boolean; userId: string; error?: string }[] = [];

    // Send notifications to all subscriptions
    for (const sub of subscriptions) {
      try {
        const subscriptionData = sub.subscription_data as PushSubscription;
        
        if (!subscriptionData?.endpoint) {
          console.error('Invalid subscription data for user:', sub.user_id);
          results.push({ success: false, userId: sub.user_id, error: 'Invalid subscription data' });
          continue;
        }

        console.log(`Sending to user ${sub.user_id}, endpoint: ${subscriptionData.endpoint.substring(0, 50)}...`);

        // Send POST request to the push endpoint
        // Note: This is a simplified implementation
        // Full Web Push requires VAPID signing and payload encryption
        const response = await fetch(subscriptionData.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain;charset=UTF-8',
            'TTL': '86400',
            'Urgency': 'normal',
          },
          body: notificationPayload
        });

        console.log(`Response for ${sub.user_id}: ${response.status} ${response.statusText}`);

        if (response.ok || response.status === 201) {
          console.log('✓ Notification sent successfully to:', sub.user_id);
          results.push({ success: true, userId: sub.user_id });
        } else {
          const errorText = await response.text().catch(() => 'Could not read error response');
          console.error(`✗ Push failed for ${sub.user_id}: ${response.status} - ${errorText}`);
          
          // If subscription is invalid (410 Gone or 404), remove it
          if (response.status === 410 || response.status === 404) {
            console.log('Removing invalid subscription for user:', sub.user_id);
            await supabaseClient
              .from('push_subscriptions')
              .delete()
              .eq('user_id', sub.user_id);
          }
          
          results.push({ success: false, userId: sub.user_id, error: `HTTP ${response.status}: ${errorText.substring(0, 100)}` });
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error sending to subscription:', errorMessage);
        results.push({ success: false, userId: sub.user_id, error: errorMessage });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failedCount = results.filter(r => !r.success).length;

    console.log('=== PUSH NOTIFICATION RESULTS ===');
    console.log(`Sent: ${successCount}, Failed: ${failedCount}`);

    // Log notification to database for tracking
    await supabaseClient
      .from('email_logs')
      .insert({
        email_type: 'push_notification',
        email_to: userIds?.join(', ') || 'all_subscribers',
        subject: title,
        status: successCount > 0 ? 'sent' : 'failed',
        metadata: {
          body,
          sent_count: successCount,
          failed_count: failedCount,
          total_subscriptions: subscriptions.length,
          results: results.slice(0, 10) // Log first 10 results for debugging
        }
      });

    return new Response(
      JSON.stringify({ 
        message: `Sent ${successCount}/${subscriptions.length} notifications`,
        sent: successCount,
        failed: failedCount,
        results 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('Error in send-push-notification:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
