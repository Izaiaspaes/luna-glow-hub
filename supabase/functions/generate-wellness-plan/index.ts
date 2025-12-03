import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Verify user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { planType, days = 7, language = 'pt' } = await req.json();

    console.log(`Generating ${planType} wellness plan for user ${user.id} in language ${language}`);
    
    // Language-specific configurations
    const languageConfig: Record<string, { defaultUser: string; cycleNotAvailable: string; cyclePhases: Record<string, string>; priorities: Record<string, string> }> = {
      pt: {
        defaultUser: 'usuária',
        cycleNotAvailable: 'não disponível',
        cyclePhases: { menstrual: 'menstrual', follicular: 'folicular', ovulatory: 'ovulatória', luteal: 'lútea' },
        priorities: { high: 'alta', medium: 'média', low: 'baixa' }
      },
      en: {
        defaultUser: 'user',
        cycleNotAvailable: 'not available',
        cyclePhases: { menstrual: 'menstrual', follicular: 'follicular', ovulatory: 'ovulatory', luteal: 'luteal' },
        priorities: { high: 'high', medium: 'medium', low: 'low' }
      },
      es: {
        defaultUser: 'usuaria',
        cycleNotAvailable: 'no disponible',
        cyclePhases: { menstrual: 'menstrual', follicular: 'folicular', ovulatory: 'ovulatoria', luteal: 'lútea' },
        priorities: { high: 'alta', medium: 'media', low: 'baja' }
      }
    };
    
    const langConfig = languageConfig[language] || languageConfig.pt;

    // Check subscription status and get user name
    const { data: onboardingData } = await supabase
      .from('user_onboarding_data')
      .select('preferred_name')
      .eq('user_id', user.id)
      .maybeSingle();

    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_plan, full_name')
      .eq('user_id', user.id)
      .single();

    const isPremium = profile?.subscription_plan === 'premium' || profile?.subscription_plan === 'premium_plus';
    const userName = onboardingData?.preferred_name || profile?.full_name?.split(' ')[0] || user.email?.split('@')[0] || langConfig.defaultUser;

    // If user is free, check active wellness plans limit
    if (!isPremium) {
      const { data: activePlans, error: plansError } = await supabase
        .from('wellness_plans')
        .select('id')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (plansError) {
        console.error('Error checking active plans:', plansError);
        throw new Error('Erro ao verificar planos ativos');
      }

      if (activePlans && activePlans.length >= 1) {
        return new Response(
          JSON.stringify({ 
            error: 'PLAN_LIMIT_REACHED',
            message: 'Usuários gratuitos podem ter apenas 1 plano de bem-estar ativo por vez. Arquive ou conclua seu plano atual para criar um novo, ou faça upgrade para Premium e tenha planos ilimitados!'
          }),
          {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // Fetch user's recent tracking data
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [cycleData, sleepData, moodData, energyData] = await Promise.all([
      supabase
        .from('cycle_tracking')
        .select('*')
        .eq('user_id', user.id)
        .gte('cycle_start_date', startDate.toISOString().split('T')[0])
        .order('cycle_start_date', { ascending: false })
        .limit(5),
      supabase
        .from('sleep_tracking')
        .select('*')
        .eq('user_id', user.id)
        .gte('sleep_date', startDate.toISOString().split('T')[0])
        .order('sleep_date', { ascending: false })
        .limit(days),
      supabase
        .from('mood_tracking')
        .select('*')
        .eq('user_id', user.id)
        .gte('mood_date', startDate.toISOString().split('T')[0])
        .order('mood_date', { ascending: false })
        .limit(days * 3),
      supabase
        .from('energy_tracking')
        .select('*')
        .eq('user_id', user.id)
        .gte('energy_date', startDate.toISOString().split('T')[0])
        .order('energy_date', { ascending: false })
        .limit(days * 3),
    ]);

    // Build context for AI
    const context = {
      cycle: cycleData.data || [],
      sleep: sleepData.data || [],
      mood: moodData.data || [],
      energy: energyData.data || [],
    };

    // Calculate averages
    const avgSleep = context.sleep.length > 0
      ? context.sleep.reduce((sum, s) => sum + (s.sleep_duration_hours || 0), 0) / context.sleep.length
      : 0;
    
    const avgSleepQuality = context.sleep.length > 0
      ? context.sleep.reduce((sum, s) => sum + (s.sleep_quality || 0), 0) / context.sleep.length
      : 0;

    const avgMood = context.mood.length > 0
      ? context.mood.reduce((sum, m) => sum + (m.mood_level || 0), 0) / context.mood.length
      : 0;

    const avgEnergy = context.energy.length > 0
      ? context.energy.reduce((sum, e) => sum + (e.energy_level || 0), 0) / context.energy.length
      : 0;

    // Determine cycle phase if available
    let cyclePhase = langConfig.cycleNotAvailable;
    if (context.cycle.length > 0) {
      const latestCycle = context.cycle[0];
      if (latestCycle.cycle_start_date) {
        const cycleStart = new Date(latestCycle.cycle_start_date);
        const today = new Date();
        const daysSinceCycleStart = Math.floor((today.getTime() - cycleStart.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysSinceCycleStart >= 0 && daysSinceCycleStart <= 5) {
          cyclePhase = langConfig.cyclePhases.menstrual;
        } else if (daysSinceCycleStart > 5 && daysSinceCycleStart <= 13) {
          cyclePhase = langConfig.cyclePhases.follicular;
        } else if (daysSinceCycleStart > 13 && daysSinceCycleStart <= 17) {
          cyclePhase = langConfig.cyclePhases.ovulatory;
        } else if (daysSinceCycleStart > 17) {
          cyclePhase = langConfig.cyclePhases.luteal;
        }
      }
    }

    // Fetch template for this plan type
    const { data: template } = await supabase
      .from('wellness_plan_templates')
      .select('*')
      .eq('template_type', planType)
      .eq('is_active', true)
      .maybeSingle();

    // Create prompt based on plan type, template and language
    const systemPrompts: Record<string, string> = {
      pt: `Você é uma especialista em saúde feminina e bem-estar. Sua missão é criar planos personalizados baseados nos dados de rastreamento da usuária.

Sempre seja empática, acolhedora e forneça recomendações práticas e acionáveis. Use uma linguagem amigável e motivadora EM PORTUGUÊS.

IMPORTANTE: Sempre inicie os insights com "Olá ${userName}," (sem "querida" ou outros apelidos).

${template ? `Use este template como BASE e PERSONALIZE as recomendações de acordo com os dados da usuária:
Template: ${template.name}
Descrição: ${template.description}
Recomendações base: ${JSON.stringify(template.base_recommendations, null, 2)}

IMPORTANTE: Não copie as recomendações base literalmente. Use-as como guia e personalize completamente com base nos dados reais da usuária.` : ''}

Formato da resposta: Retorne um objeto JSON com a seguinte estrutura:
{
  "title": "Título do plano",
  "summary": "Resumo de 2-3 linhas do plano",
  "recommendations": [
    {
      "category": "categoria",
      "title": "título da recomendação",
      "description": "descrição detalhada",
      "priority": "alta|média|baixa"
    }
  ],
  "insights": "Insights principais sobre os dados da usuária (2-3 parágrafos), começando com 'Olá ${userName},'"
}`,
      en: `You are a specialist in women's health and wellness. Your mission is to create personalized plans based on the user's tracking data.

Always be empathetic, welcoming and provide practical, actionable recommendations. Use friendly and motivating language IN ENGLISH.

IMPORTANT: Always start insights with "Hi ${userName}," (no "dear" or other nicknames).

${template ? `Use this template as a BASE and CUSTOMIZE the recommendations according to the user's data:
Template: ${template.name}
Description: ${template.description}
Base recommendations: ${JSON.stringify(template.base_recommendations, null, 2)}

IMPORTANT: Do not copy the base recommendations literally. Use them as a guide and fully customize based on the user's actual data.` : ''}

Response format: Return a JSON object with the following structure:
{
  "title": "Plan title",
  "summary": "2-3 line summary of the plan",
  "recommendations": [
    {
      "category": "category",
      "title": "recommendation title",
      "description": "detailed description",
      "priority": "high|medium|low"
    }
  ],
  "insights": "Main insights about the user's data (2-3 paragraphs), starting with 'Hi ${userName},'"
}`,
      es: `Eres una especialista en salud femenina y bienestar. Tu misión es crear planes personalizados basados en los datos de seguimiento de la usuaria.

Siempre sé empática, acogedora y proporciona recomendaciones prácticas y accionables. Usa un lenguaje amigable y motivador EN ESPAÑOL.

IMPORTANTE: Siempre inicia los insights con "Hola ${userName}," (sin "querida" u otros apodos).

${template ? `Usa esta plantilla como BASE y PERSONALIZA las recomendaciones de acuerdo con los datos de la usuaria:
Plantilla: ${template.name}
Descripción: ${template.description}
Recomendaciones base: ${JSON.stringify(template.base_recommendations, null, 2)}

IMPORTANTE: No copies las recomendaciones base literalmente. Úsalas como guía y personaliza completamente con base en los datos reales de la usuaria.` : ''}

Formato de respuesta: Devuelve un objeto JSON con la siguiente estructura:
{
  "title": "Título del plan",
  "summary": "Resumen de 2-3 líneas del plan",
  "recommendations": [
    {
      "category": "categoría",
      "title": "título de la recomendación",
      "description": "descripción detallada",
      "priority": "alta|media|baja"
    }
  ],
  "insights": "Insights principales sobre los datos de la usuaria (2-3 párrafos), comenzando con 'Hola ${userName},'"
}`
    };
    
    const systemPrompt = systemPrompts[language] || systemPrompts.pt;

    let userPrompt = '';

    if (planType === 'sono') {
      userPrompt = `Crie um plano personalizado de sono com base nos seguintes dados dos últimos ${days} dias:

Dados de sono:
- Média de horas dormidas: ${avgSleep.toFixed(1)}h
- Qualidade média do sono: ${avgSleepQuality.toFixed(1)}/5
- Registros: ${context.sleep.length}

Fase do ciclo atual: ${cyclePhase}
Nível médio de humor: ${avgMood.toFixed(1)}/5
Nível médio de energia: ${avgEnergy.toFixed(1)}/5

Forneça:
1. Análise dos padrões de sono
2. 4-6 recomendações práticas para melhorar o sono
3. Dicas específicas considerando a fase do ciclo menstrual
4. Sugestões de rotina noturna`;

    } else if (planType === 'meditacao') {
      userPrompt = `Crie um plano personalizado de meditação e mindfulness com base nos seguintes dados dos últimos ${days} dias:

Nível médio de humor: ${avgMood.toFixed(1)}/5
Nível médio de energia: ${avgEnergy.toFixed(1)}/5
Qualidade média do sono: ${avgSleepQuality.toFixed(1)}/5
Fase do ciclo atual: ${cyclePhase}

Forneça:
1. Análise do estado emocional atual
2. 4-6 práticas de meditação adaptadas às necessidades
3. Micro-meditações de 1-5 minutos para momentos do dia
4. Técnicas de respiração específicas`;

    } else if (planType === 'nutricao' || planType === 'alimentacao') {
      userPrompt = `Crie um plano nutricional personalizado com receitas práticas com base nos seguintes dados dos últimos ${days} dias:

Fase do ciclo atual: ${cyclePhase}
Nível médio de energia: ${avgEnergy.toFixed(1)}/5
Qualidade média do sono: ${avgSleepQuality.toFixed(1)}/5
Nível médio de humor: ${avgMood.toFixed(1)}/5

Forneça um plano completo incluindo:
1. Análise nutricional para a fase do ciclo atual
2. 5-7 recomendações nutricionais específicas com alimentos que:
   - Aumentam energia e disposição
   - Equilibram hormônios naturalmente
   - Melhoram qualidade do sono
   - Estabilizam o humor
3. 3-4 RECEITAS COMPLETAS e fáceis de preparar (com ingredientes, modo de preparo e benefícios)
4. Dicas de hidratação adequada
5. Sugestões de lanches saudáveis para diferentes momentos do dia
6. Lista de alimentos a priorizar e evitar nesta fase

IMPORTANTE: As receitas devem ser práticas, com ingredientes acessíveis e preparos simples (máximo 30 minutos). Inclua receitas variadas: café da manhã, almoço/jantar, lanches.`;

    } else {
      // Plano geral
      userPrompt = `Crie um plano de bem-estar geral com base nos seguintes dados dos últimos ${days} dias:

Dados de sono:
- Média: ${avgSleep.toFixed(1)}h
- Qualidade: ${avgSleepQuality.toFixed(1)}/5

Fase do ciclo: ${cyclePhase}
Humor médio: ${avgMood.toFixed(1)}/5
Energia média: ${avgEnergy.toFixed(1)}/5

Forneça um plano holístico abordando:
1. Sono e descanso
2. Nutrição
3. Atividade física
4. Saúde mental
5. Autocuidado específico para a fase do ciclo`;
    }

    // Call Lovable AI
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const planContent = JSON.parse(aiData.choices[0].message.content);

    // Save the wellness plan
    const { data: savedPlan, error: saveError } = await supabase
      .from('wellness_plans')
      .insert({
        user_id: user.id,
        plan_type: planType,
        plan_content: planContent,
        ai_recommendations: aiData.choices[0].message.content,
        valid_from: new Date().toISOString().split('T')[0],
        is_active: true
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving plan:', saveError);
      throw saveError;
    }

    console.log('Wellness plan created successfully:', savedPlan.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        plan: savedPlan,
        content: planContent
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in generate-wellness-plan:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : undefined
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});