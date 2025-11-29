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

// VAPID keys - in production, store these securely
const VAPID_PUBLIC_KEY = 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY') || 'p1NnRJDMZVJp-2vO-tXXQEqvbsYcSYMM_vWZ-5N7Khs';

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

    console.log('Sending push notification:', { title, body, userIds });

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
      return new Response(
        JSON.stringify({ message: 'No subscriptions found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    console.log(`Found ${subscriptions.length} subscriptions`);

    // Send notifications to all subscriptions using Web Push
    const notificationPromises = subscriptions.map(async (sub) => {
      try {
        const subscriptionData = sub.subscription_data as any;
        
        const payload = JSON.stringify({
          title,
          body,
          icon: icon || '/pwa-192x192.png',
          badge: badge || '/favicon.png',
          data: data || {}
        });

        // Use web-push library for actual push notifications
        // This is a simplified version - in production use a proper web-push library
        const response = await fetch(subscriptionData.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'TTL': '86400'
          },
          body: payload
        });

        if (!response.ok) {
          throw new Error(`Push failed: ${response.status}`);
        }
        
        console.log('Notification sent to:', sub.user_id);
        return { success: true, userId: sub.user_id };
      } catch (error) {
        console.error('Error sending to subscription:', error);
        return { success: false, userId: sub.user_id, error };
      }
    });

    const results = await Promise.all(notificationPromises);
    const successCount = results.filter(r => r.success).length;

    console.log(`Successfully sent ${successCount}/${subscriptions.length} notifications`);

    return new Response(
      JSON.stringify({ 
        message: `Sent ${successCount}/${subscriptions.length} notifications`,
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