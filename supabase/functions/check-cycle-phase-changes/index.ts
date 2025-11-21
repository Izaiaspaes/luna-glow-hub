import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.83.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PhaseInfo {
  phase: string;
  title: string;
  description: string;
}

const phaseInfo: Record<string, PhaseInfo> = {
  menstrual: {
    phase: "menstrual",
    title: "Fase Menstrual",
    description: "Ela está na fase menstrual. É um período onde pode se sentir mais cansada e precisar de mais apoio emocional.",
  },
  folicular: {
    phase: "folicular",
    title: "Fase Folicular",
    description: "Ela entrou na fase folicular! Momento de mais energia e disposição. É um ótimo período para atividades em casal.",
  },
  ovulatoria: {
    phase: "ovulatoria",
    title: "Fase Ovulatória",
    description: "Ela está na fase ovulatória - o pico de energia e confiança! Momento ideal para conexão e intimidade.",
  },
  lutea: {
    phase: "lutea",
    title: "Fase Lútea (TPM)",
    description: "Ela entrou na fase lútea. Pode haver sintomas de TPM como irritabilidade e sensibilidade. Seja especialmente paciente e compreensivo.",
  },
};

function getCurrentPhase(cycleStartDate: string, cycleLength: number = 28): string {
  const cycleStart = new Date(cycleStartDate);
  const today = new Date();
  const daysSinceStart = Math.floor((today.getTime() - cycleStart.getTime()) / (1000 * 60 * 60 * 24));
  
  // Handle cycles that have completed
  const dayInCycle = daysSinceStart % cycleLength;
  
  if (dayInCycle <= 5) return "menstrual";
  if (dayInCycle <= 13) return "folicular";
  if (dayInCycle <= 17) return "ovulatoria";
  return "lutea";
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Starting cycle phase change detection...');

    // Get all active partner relationships
    const { data: relationships, error: relError } = await supabase
      .from('partner_relationships')
      .select('*')
      .eq('status', 'accepted');

    if (relError) {
      console.error('Error fetching relationships:', relError);
      throw relError;
    }

    console.log(`Found ${relationships?.length || 0} active relationships`);

    let notificationsCreated = 0;

    for (const relationship of relationships || []) {
      // Get latest cycle data for the owner
      const { data: cycleData, error: cycleError } = await supabase
        .from('cycle_tracking')
        .select('*')
        .eq('user_id', relationship.owner_user_id)
        .order('cycle_start_date', { ascending: false })
        .limit(1)
        .single();

      if (cycleError || !cycleData) {
        console.log(`No cycle data for user ${relationship.owner_user_id}`);
        continue;
      }

      const currentPhase = getCurrentPhase(cycleData.cycle_start_date, cycleData.cycle_length || 28);

      // Check if there's already a notification for this phase
      const { data: existingNotification } = await supabase
        .from('partner_notifications')
        .select('*')
        .eq('relationship_id', relationship.id)
        .eq('phase', currentPhase)
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
        .single();

      // If no notification exists for this phase in the last 24h, create one
      if (!existingNotification) {
        const info = phaseInfo[currentPhase];
        
        const { error: notifError } = await supabase
          .from('partner_notifications')
          .insert({
            relationship_id: relationship.id,
            notification_type: 'phase_change',
            phase: currentPhase,
            title: info.title,
            message: info.description,
            read: false,
          });

        if (notifError) {
          console.error('Error creating notification:', notifError);
        } else {
          notificationsCreated++;
          console.log(`Created notification for relationship ${relationship.id}: ${info.title}`);
        }
      }
    }

    console.log(`Process completed. Created ${notificationsCreated} notifications.`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Checked ${relationships?.length || 0} relationships, created ${notificationsCreated} notifications` 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in check-cycle-phase-changes:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
