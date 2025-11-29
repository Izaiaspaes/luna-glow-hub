import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.83.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from auth header
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { message, conversationHistory } = await req.json();

    if (!message || !message.trim()) {
      throw new Error('Message is required');
    }

    // Get user's preferred name for personalization
    const { data: onboardingData } = await supabase
      .from('user_onboarding_data')
      .select('preferred_name')
      .eq('user_id', user.id)
      .maybeSingle();

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('user_id', user.id)
      .single();

    const userName = onboardingData?.preferred_name || profile?.full_name?.split(' ')[0] || 'querida';

    // Get user's recent cycle data to understand current phase
    const { data: cycleData } = await supabase
      .from('cycle_tracking')
      .select('cycle_start_date, symptoms')
      .eq('user_id', user.id)
      .order('cycle_start_date', { ascending: false })
      .limit(1)
      .single();

    let cyclePhaseContext = '';
    if (cycleData) {
      const daysSinceStart = Math.floor(
        (new Date().getTime() - new Date(cycleData.cycle_start_date).getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysSinceStart <= 5) {
        cyclePhaseContext = 'A usuária está na fase menstrual. Seja extra acolhedora e sugira autocuidado.';
      } else if (daysSinceStart <= 14) {
        cyclePhaseContext = 'A usuária está na fase folicular. Seja energética e incentive atividades.';
      } else if (daysSinceStart <= 21) {
        cyclePhaseContext = 'A usuária está na fase ovulatória. Seja sociável e sugira conexões.';
      } else {
        cyclePhaseContext = 'A usuária está na fase lútea/TPM. Seja empática e acolhedora.';
      }
    }

    // Build conversation messages for AI
    const messages = [
      {
        role: 'system',
        content: `Você é Luna Sense, uma assistente inteligente de bem-estar feminino especializada em saúde hormonal, rotina e emoções.
        
        Sua personalidade:
        - Empática, acolhedora e sem julgamentos
        - Tom conversacional e próximo
        - Focada em autocuidado e bem-estar
        - Conhecedora de saúde feminina, ciclo menstrual, nutrição, sono e humor
        
        ${cyclePhaseContext}
        
        Adapte seu tom ao momento do ciclo:
        - Fase menstrual: Acolhedora, sugira descanso e conforto
        - Fase folicular: Energética, incentive atividades e projetos
        - Fase ovulatória: Sociável, sugira conexões e expressão
        - Fase lútea: Empática, valide emoções e sugira calma
        
        Quando a usuária disser "estou mal hoje", seja extra empática e ofereça suporte emocional imediato.
        
        Você está conversando com ${userName}.`
      },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user',
        content: message
      }
    ];

    // Call Lovable AI
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: messages,
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Limite de requisições excedido. Por favor, tente novamente em alguns instantes.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Créditos insuficientes. Por favor, entre em contato com o suporte.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      throw new Error('Failed to get AI response');
    }

    const aiData = await aiResponse.json();
    const response = aiData.choices[0].message.content;

    return new Response(
      JSON.stringify({ response }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in luna-sense-chat function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});