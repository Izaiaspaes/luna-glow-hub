import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FeatureSuggestion {
  id: string;
  title: string;
  body: string;
  icon: string;
  feature: string;
  route: string;
  triggers: string[];
  priority: number;
}

// Feature suggestions catalog
const featureSuggestions: FeatureSuggestion[] = [
  // Weekend suggestions
  {
    id: 'weekend_closet',
    title: '👗 Hora de escolher o look do fim de semana!',
    body: 'Que tal explorar seu Armário Virtual e montar um look incrível para o fim de semana? A IA pode te ajudar!',
    icon: '/pwa-192x192.png',
    feature: 'closet',
    route: '/dashboard?tab=closet',
    triggers: ['weekend'],
    priority: 1
  },
  {
    id: 'weekend_beauty',
    title: '💄 Descubra seu look de make perfeito!',
    body: 'Final de semana chegou! Use a análise de beleza para descobrir as melhores cores de maquiagem para você.',
    icon: '/pwa-192x192.png',
    feature: 'beauty',
    route: '/dashboard?tab=beauty',
    triggers: ['weekend'],
    priority: 2
  },
  {
    id: 'weekend_selfcare',
    title: '🧘 Que tal um dia de autocuidado?',
    body: 'O fim de semana é perfeito para cuidar de você! Confira seu plano de bem-estar personalizado.',
    icon: '/pwa-192x192.png',
    feature: 'wellness',
    route: '/dashboard?tab=wellness',
    triggers: ['weekend'],
    priority: 3
  },
  
  // Morning suggestions
  {
    id: 'morning_outfit',
    title: '☀️ Bom dia! Vamos escolher seu look?',
    body: 'Comece o dia com estilo! O Luna pode sugerir a roupa perfeita baseada no clima e sua agenda.',
    icon: '/pwa-192x192.png',
    feature: 'closet',
    route: '/dashboard?tab=closet',
    triggers: ['morning'],
    priority: 1
  },
  {
    id: 'morning_journal',
    title: '📝 Que tal começar o dia refletindo?',
    body: 'Escreva no seu Diário da Mulher e a IA irá analisar padrões e te dar insights valiosos.',
    icon: '/pwa-192x192.png',
    feature: 'journal',
    route: '/dashboard?tab=journal',
    triggers: ['morning'],
    priority: 2
  },
  
  // Evening suggestions
  {
    id: 'evening_sleep',
    title: '🌙 Hora de preparar para dormir bem!',
    body: 'Registre seu sono e descubra padrões que podem melhorar sua qualidade de descanso.',
    icon: '/pwa-192x192.png',
    feature: 'sleep',
    route: '/dashboard',
    triggers: ['evening'],
    priority: 1
  },
  {
    id: 'evening_mood',
    title: '💜 Como foi seu dia hoje?',
    body: 'Registre seu humor e energia para que a IA possa identificar padrões e te ajudar.',
    icon: '/pwa-192x192.png',
    feature: 'mood',
    route: '/dashboard',
    triggers: ['evening'],
    priority: 2
  },
  
  // Weekly suggestions
  {
    id: 'weekly_predictions',
    title: '🔮 Previsões da semana disponíveis!',
    body: 'Confira o que a IA previu para sua semana e se prepare para os próximos dias.',
    icon: '/pwa-192x192.png',
    feature: 'predictions',
    route: '/dashboard?tab=predictions',
    triggers: ['monday'],
    priority: 1
  },
  {
    id: 'weekly_summary',
    title: '📊 Seu resumo semanal está pronto!',
    body: 'Veja como foi sua semana: padrões de sono, humor, energia e muito mais!',
    icon: '/pwa-192x192.png',
    feature: 'summary',
    route: '/dashboard',
    triggers: ['sunday'],
    priority: 1
  },
  
  // Feature discovery suggestions
  {
    id: 'discover_sos',
    title: '🆘 Você conhece o Botão SOS?',
    body: 'Em momentos de crise, use o botão SOS para receber apoio imediato e orientações.',
    icon: '/pwa-192x192.png',
    feature: 'sos',
    route: '/dashboard',
    triggers: ['discovery'],
    priority: 1
  },
  {
    id: 'discover_partner',
    title: '💕 Compartilhe com seu parceiro!',
    body: 'O Luna a Dois permite que você compartilhe informações do seu ciclo com seu parceiro de forma discreta.',
    icon: '/pwa-192x192.png',
    feature: 'partner',
    route: '/dashboard?tab=partner',
    triggers: ['discovery'],
    priority: 2
  },
  {
    id: 'discover_health',
    title: '🩺 Análise de Saúde disponível!',
    body: 'Descreva seus sintomas e receba uma análise personalizada pela IA.',
    icon: '/pwa-192x192.png',
    feature: 'health',
    route: '/dashboard?tab=health',
    triggers: ['discovery'],
    priority: 3
  },
  {
    id: 'discover_wearable',
    title: '⌚ Conecte seu wearable!',
    body: 'Integre seu dispositivo de saúde para dados ainda mais precisos.',
    icon: '/pwa-192x192.png',
    feature: 'wearable',
    route: '/dashboard?tab=wearable',
    triggers: ['discovery'],
    priority: 4
  },
  
  // Special occasion suggestions
  {
    id: 'special_event',
    title: '🎉 Evento especial chegando?',
    body: 'Use o Armário Virtual para planejar seu look perfeito com antecedência!',
    icon: '/pwa-192x192.png',
    feature: 'closet',
    route: '/dashboard?tab=closet',
    triggers: ['special'],
    priority: 1
  },
  
  // Nutrition and work
  {
    id: 'lunch_nutrition',
    title: '🥗 Hora do almoço! O que vai comer?',
    body: 'Registre sua alimentação e a IA te dará dicas personalizadas para sua fase do ciclo.',
    icon: '/pwa-192x192.png',
    feature: 'nutrition',
    route: '/dashboard',
    triggers: ['lunch'],
    priority: 1
  },
  {
    id: 'work_energy',
    title: '💼 Como está sua energia no trabalho?',
    body: 'Registre sua rotina de trabalho e descubra como ela impacta seu bem-estar.',
    icon: '/pwa-192x192.png',
    feature: 'work',
    route: '/dashboard',
    triggers: ['workday'],
    priority: 1
  }
];

function getCurrentTriggers(): string[] {
  const now = new Date();
  const hour = now.getUTCHours() - 3; // Brazil timezone approximation
  const day = now.getDay(); // 0 = Sunday, 6 = Saturday
  const triggers: string[] = [];
  
  // Weekend check
  if (day === 0 || day === 6) {
    triggers.push('weekend');
  } else {
    triggers.push('workday');
  }
  
  // Day of week
  if (day === 0) triggers.push('sunday');
  if (day === 1) triggers.push('monday');
  
  // Time of day
  if (hour >= 6 && hour < 10) triggers.push('morning');
  if (hour >= 11 && hour < 14) triggers.push('lunch');
  if (hour >= 18 && hour < 22) triggers.push('evening');
  
  // Discovery (random chance for feature discovery)
  if (Math.random() < 0.2) triggers.push('discovery');
  
  return triggers;
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

    const body = await req.json().catch(() => ({}));
    const { userId, trigger: manualTrigger } = body;

    console.log('=== FEATURE SUGGESTION REQUEST ===');
    console.log('Manual trigger:', manualTrigger);
    console.log('Target user:', userId || 'all');

    // Get current triggers based on time/day
    const triggers = manualTrigger ? [manualTrigger] : getCurrentTriggers();
    console.log('Active triggers:', triggers);

    // Filter suggestions by current triggers
    const matchingSuggestions = featureSuggestions.filter(
      suggestion => suggestion.triggers.some(t => triggers.includes(t))
    );

    if (matchingSuggestions.length === 0) {
      console.log('No matching suggestions for current triggers');
      return new Response(
        JSON.stringify({ message: 'No matching suggestions', sent: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Sort by priority and pick one
    matchingSuggestions.sort((a, b) => a.priority - b.priority);
    const selectedSuggestion = matchingSuggestions[Math.floor(Math.random() * Math.min(3, matchingSuggestions.length))];

    console.log('Selected suggestion:', selectedSuggestion.id);

    // Get users with feature suggestions enabled
    let query = supabaseClient
      .from('profiles')
      .select('user_id, notification_preferences');
    
    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data: profiles, error: profilesError } = await query;

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      throw profilesError;
    }

    // Filter users who have feature_suggestions enabled
    const eligibleUsers = profiles?.filter(profile => {
      const prefs = profile.notification_preferences as any;
      // Default to true if not explicitly set to false
      return prefs?.feature_suggestions !== false;
    }) || [];

    console.log(`Found ${eligibleUsers.length} eligible users for feature suggestions`);

    if (eligibleUsers.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No eligible users', sent: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Get push subscriptions for eligible users
    const userIds = eligibleUsers.map(u => u.user_id);
    const { data: subscriptions, error: subError } = await supabaseClient
      .from('push_subscriptions')
      .select('subscription_data, user_id')
      .in('user_id', userIds);

    if (subError) {
      console.error('Error fetching subscriptions:', subError);
      throw subError;
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log('No push subscriptions found for eligible users');
      return new Response(
        JSON.stringify({ message: 'No subscriptions found', sent: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    console.log(`Sending suggestion to ${subscriptions.length} subscriptions`);

    const notificationPayload = JSON.stringify({
      title: selectedSuggestion.title,
      body: selectedSuggestion.body,
      icon: selectedSuggestion.icon,
      badge: '/favicon.png',
      data: {
        feature: selectedSuggestion.feature,
        route: selectedSuggestion.route,
        suggestionId: selectedSuggestion.id
      },
      timestamp: Date.now()
    });

    let successCount = 0;
    let failedCount = 0;

    for (const sub of subscriptions) {
      try {
        const subscriptionData = sub.subscription_data as { endpoint: string };
        
        if (!subscriptionData?.endpoint) {
          console.error('Invalid subscription data for user:', sub.user_id);
          failedCount++;
          continue;
        }

        const response = await fetch(subscriptionData.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain;charset=UTF-8',
            'TTL': '86400',
            'Urgency': 'low',
          },
          body: notificationPayload
        });

        if (response.ok || response.status === 201) {
          successCount++;
        } else {
          failedCount++;
          
          // Remove invalid subscriptions
          if (response.status === 410 || response.status === 404) {
            await supabaseClient
              .from('push_subscriptions')
              .delete()
              .eq('user_id', sub.user_id);
          }
        }
      } catch (error) {
        console.error('Error sending notification:', error);
        failedCount++;
      }
    }

    console.log(`=== RESULTS: Sent ${successCount}, Failed ${failedCount} ===`);

    // Log the suggestion sent
    await supabaseClient
      .from('email_logs')
      .insert({
        email_type: 'feature_suggestion',
        email_to: userIds.join(', ').substring(0, 255),
        subject: selectedSuggestion.title,
        status: successCount > 0 ? 'sent' : 'failed',
        metadata: {
          suggestion_id: selectedSuggestion.id,
          feature: selectedSuggestion.feature,
          triggers,
          sent_count: successCount,
          failed_count: failedCount
        }
      });

    return new Response(
      JSON.stringify({
        message: `Sent feature suggestion to ${successCount} users`,
        suggestion: selectedSuggestion.id,
        sent: successCount,
        failed: failedCount
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('Error in send-feature-suggestions:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
