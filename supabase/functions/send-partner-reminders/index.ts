import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.83.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CaringTip {
  title: string;
  message: string;
}

const caringTips: Record<string, CaringTip[]> = {
  menstrual: [
    {
      title: "💝 Que tal um chá quentinho?",
      message: "A fase menstrual pode trazer cólicas e desconforto. Prepare um chá de camomila ou erva-doce para ela relaxar.",
    },
    {
      title: "🛁 Momento de relaxamento",
      message: "Que tal preparar um banho relaxante com água morna? Pode ajudar muito com as cólicas.",
    },
    {
      title: "🍫 Um chocolatinho faz bem",
      message: "Chocolate pode ajudar com o humor! Um mimo doce pode alegrar o dia dela.",
    },
    {
      title: "🏠 Ajuda nas tarefas",
      message: "Ela pode estar mais cansada hoje. Ofereça ajuda com as tarefas domésticas sem ela precisar pedir.",
    },
    {
      title: "🎬 Filme e aconchego",
      message: "Um dia tranquilo em casa assistindo algo leve pode ser exatamente o que ela precisa agora.",
    },
  ],
  folicular: [
    {
      title: "🎉 Momento de energia!",
      message: "Ela está com mais energia agora! Que tal planejar uma atividade especial juntos?",
    },
    {
      title: "🍽️ Jantar especial",
      message: "É uma ótima fase para um encontro romântico! Que tal surpreender com um jantar especial?",
    },
    {
      title: "🎨 Novos projetos",
      message: "A criatividade está em alta! Apoie os novos projetos e ideias que ela mencionar.",
    },
    {
      title: "🚶‍♀️ Passeio ao ar livre",
      message: "Ela está cheia de energia! Um passeio no parque ou uma caminhada juntos seria ótimo.",
    },
    {
      title: "💬 Conversas profundas",
      message: "É um bom momento para conversas importantes sobre o futuro de vocês. Ela está receptiva!",
    },
  ],
  ovulatoria: [
    {
      title: "✨ Pico de energia e confiança",
      message: "Ela está radiante! É o momento perfeito para elogios sinceros e conexão.",
    },
    {
      title: "🌹 Gesto romântico",
      message: "Surpreenda com flores ou uma mensagem carinhosa. Ela vai adorar a atenção especial!",
    },
    {
      title: "💑 Momento de intimidade",
      message: "A conexão está no auge! É um momento especial para vocês se reconectarem.",
    },
    {
      title: "📸 Crie memórias",
      message: "Façam algo memorável juntos! Ela está se sentindo confiante e linda.",
    },
    {
      title: "🎯 Resolva pendências",
      message: "É um ótimo momento para resolver questões práticas do casal. Ela está com clareza mental!",
    },
  ],
  lutea: [
    {
      title: "🤗 Paciência extra",
      message: "A TPM pode estar chegando. Seja especialmente compreensivo e evite discussões desnecessárias.",
    },
    {
      title: "🎧 Respeite o espaço",
      message: "Ela pode precisar de um tempo sozinha. Ofereça apoio, mas respeite se ela quiser ficar quieta.",
    },
    {
      title: "💆‍♀️ Massagem relaxante",
      message: "Uma massagem nos ombros ou pés pode fazer maravilhas para aliviar a tensão da TPM.",
    },
    {
      title: "🍕 Comida favorita",
      message: "Surpreenda com a comida favorita dela. Pequenos gestos fazem grande diferença agora!",
    },
    {
      title: "💬 Escuta ativa",
      message: "Se ela quiser conversar, apenas escute sem tentar resolver. Às vezes é só isso que ela precisa.",
    },
    {
      title: "🧹 Ajude sem pedir",
      message: "Tome iniciativa nas tarefas de casa. Ela pode estar se sentindo sobrecarregada.",
    },
  ],
};

function getCurrentPhase(cycleStartDate: string, cycleLength: number = 28): string {
  const cycleStart = new Date(cycleStartDate);
  const today = new Date();
  const daysSinceStart = Math.floor((today.getTime() - cycleStart.getTime()) / (1000 * 60 * 60 * 24));
  
  const dayInCycle = daysSinceStart % cycleLength;
  
  if (dayInCycle <= 5) return "menstrual";
  if (dayInCycle <= 13) return "folicular";
  if (dayInCycle <= 17) return "ovulatoria";
  return "lutea";
}

function getRandomTip(phase: string): CaringTip {
  const tips = caringTips[phase] || caringTips.menstrual;
  return tips[Math.floor(Math.random() * tips.length)];
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

    console.log('Starting partner reminders sending...');

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

    let remindersCreated = 0;

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
      const tip = getRandomTip(currentPhase);

      // Check if there's already a reminder today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data: existingReminder } = await supabase
        .from('partner_notifications')
        .select('*')
        .eq('relationship_id', relationship.id)
        .eq('notification_type', 'caring_reminder')
        .gte('created_at', today.toISOString())
        .single();

      // If no reminder exists today, create one
      if (!existingReminder) {
        const { error: notifError } = await supabase
          .from('partner_notifications')
          .insert({
            relationship_id: relationship.id,
            notification_type: 'caring_reminder',
            phase: currentPhase,
            title: tip.title,
            message: tip.message,
            read: false,
          });

        if (notifError) {
          console.error('Error creating reminder:', notifError);
        } else {
          remindersCreated++;
          console.log(`Created reminder for relationship ${relationship.id}: ${tip.title}`);
        }
      }
    }

    console.log(`Process completed. Created ${remindersCreated} reminders.`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Checked ${relationships?.length || 0} relationships, created ${remindersCreated} reminders` 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-partner-reminders:', error);
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
