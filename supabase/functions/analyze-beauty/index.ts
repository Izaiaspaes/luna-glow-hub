import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

    // Authenticate user
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { imageBase64, storageUrl, analysisType } = await req.json();

    if (!imageBase64 || !analysisType) {
      return new Response(JSON.stringify({ error: 'Missing imageBase64 or analysisType' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Use storage URL for saving to database, base64 for AI analysis
    const imageUrlForStorage = storageUrl || 'base64-upload';

    // Fetch user onboarding data for personalization
    const { data: onboardingData } = await supabase
      .from('user_onboarding_data')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Fetch current cycle data for hormonal context
    const { data: cycleData } = await supabase
      .from('cycle_tracking')
      .select('*')
      .eq('user_id', user.id)
      .order('cycle_start_date', { ascending: false })
      .limit(1)
      .single();

    // Usar nome preferido da usuária, com primeira letra maiúscula
    const rawName = onboardingData?.preferred_name || onboardingData?.social_name || onboardingData?.full_name?.split(' ')[0];
    const userName = rawName 
      ? rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase()
      : null;

    // Build context for AI
    const userContext = {
      skin_tone: onboardingData?.skin_tone,
      skin_types: onboardingData?.skin_types,
      hair_color: onboardingData?.hair_color,
      hair_type: onboardingData?.hair_type,
      hair_length: onboardingData?.hair_length,
      eye_color: onboardingData?.eye_color,
      body_shapes: onboardingData?.body_shapes,
      favorite_color: onboardingData?.favorite_color,
      age: onboardingData?.age,
    };

    // Determine cycle phase for hormonal context
    let cyclePhaseContext = '';
    if (cycleData) {
      const startDate = new Date(cycleData.cycle_start_date);
      const today = new Date();
      const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysSinceStart <= 5) {
        cyclePhaseContext = 'fase menstrual (pele pode estar mais sensível)';
      } else if (daysSinceStart <= 13) {
        cyclePhaseContext = 'fase folicular (pele geralmente mais equilibrada)';
      } else if (daysSinceStart <= 16) {
        cyclePhaseContext = 'fase ovulatória (pele em seu melhor momento)';
      } else {
        cyclePhaseContext = 'fase lútea/TPM (pele pode estar mais oleosa e com tendência a acne)';
      }
    }

    // System prompt based on analysis type
    const greeting = userName ? `${userName}` : 'você';
    const greetingForPrompt = userName ? `para ${userName}` : 'para a usuária';
    
    let systemPrompt = '';
    if (analysisType === 'face') {
      systemPrompt = `Você é uma consultora de beleza especializada em análise facial e coloração pessoal. Analise a imagem do rosto fornecida e forneça uma análise detalhada em JSON.

${userName ? `A usuária se chama ${userName}.` : 'Não use termos genéricos como "Querida" ou "Amiga". Dirija-se à usuária de forma neutra.'}

Informações da usuária:
- Tom de pele declarado: ${userContext.skin_tone || 'não informado'}
- Tipos de pele: ${userContext.skin_types?.join(', ') || 'não informado'}
- Cor dos olhos: ${userContext.eye_color || 'não informado'}
- Cor favorita: ${userContext.favorite_color || 'não informado'}
- Idade: ${userContext.age || 'não informado'}
${cyclePhaseContext ? `- Fase do ciclo: ${cyclePhaseContext}` : ''}

Forneça sua análise no seguinte formato JSON:
{
  "face_shape": "formato do rosto detectado (oval, redondo, quadrado, coração, etc.)",
  "skin_tone_detected": "tom de pele observado (clara, média, morena, negra)",
  "undertone": "subtom (quente, frio, neutro)",
  "color_season": "estação de cores (primavera, verão, outono, inverno)",
  "makeup_recommendations": {
    "foundation": "recomendações de base e tonalidade",
    "eyes": "cores e técnicas para os olhos",
    "lips": "cores de batom recomendadas",
    "cheeks": "blush e contorno"
  },
  "skincare_tips": ["dica1", "dica2", "dica3"],
  "best_colors_to_wear": ["cor1", "cor2", "cor3"],
  "colors_to_avoid": ["cor1", "cor2"],
  "personalized_message": "mensagem carinhosa e encorajadora ${greetingForPrompt} - ${userName ? `comece com o nome ${userName}` : 'NÃO use Querida, Amiga ou termos genéricos'}"
}`;
    } else if (analysisType === 'body') {
      systemPrompt = `Você é uma consultora de moda e estilo corporal. Analise a imagem fornecida e forneça recomendações de vestuário em JSON.

${userName ? `A usuária se chama ${userName}.` : 'Não use termos genéricos como "Querida" ou "Amiga". Dirija-se à usuária de forma neutra.'}

Informações da usuária:
- Formas corporais declaradas: ${userContext.body_shapes?.join(', ') || 'não informado'}
- Tom de pele: ${userContext.skin_tone || 'não informado'}
- Cor favorita: ${userContext.favorite_color || 'não informado'}
- Idade: ${userContext.age || 'não informado'}

Forneça sua análise no seguinte formato JSON:
{
  "body_type": "biotipo observado",
  "proportions": "análise de proporções",
  "clothing_recommendations": {
    "tops": ["recomendação1", "recomendação2"],
    "bottoms": ["recomendação1", "recomendação2"],
    "dresses": ["recomendação1", "recomendação2"],
    "accessories": ["recomendação1", "recomendação2"]
  },
  "patterns_and_prints": ["padrões que favorecem"],
  "best_fits": ["cortes que valorizam"],
  "styling_tips": ["dica1", "dica2", "dica3"],
  "personalized_message": "mensagem motivadora ${greetingForPrompt} - ${userName ? `comece com o nome ${userName}` : 'NÃO use Querida, Amiga ou termos genéricos'}"
}`;
    } else if (analysisType === 'product') {
      systemPrompt = `Você é uma consultora de beleza especializada em análise de produtos. Analise o produto da imagem e diga se combina com o perfil da usuária.

${userName ? `A usuária se chama ${userName}.` : 'Não use termos genéricos como "Querida" ou "Amiga". Dirija-se à usuária de forma neutra.'}

Informações da usuária:
- Tom de pele: ${userContext.skin_tone || 'não informado'}
- Tipos de pele: ${userContext.skin_types?.join(', ') || 'não informado'}
- Cor dos olhos: ${userContext.eye_color || 'não informado'}
- Cor de cabelo: ${userContext.hair_color || 'não informado'}
${cyclePhaseContext ? `- Fase do ciclo: ${cyclePhaseContext}` : ''}

Forneça sua análise no seguinte formato JSON:
{
  "product_identified": "nome/tipo do produto identificado",
  "compatibility_score": "pontuação de 0-10",
  "matches_profile": true/false,
  "why_matches": "explicação de por que combina ou não",
  "better_alternatives": ["alternativa1", "alternativa2"],
  "usage_tips": ["dica1", "dica2"],
  "personalized_message": "mensagem personalizada ${greetingForPrompt} - ${userName ? `comece com o nome ${userName}` : 'NÃO use Querida, Amiga ou termos genéricos'}"
}`;
    }

    console.log('Sending image to AI for analysis...');

    // Call Lovable AI with base64 image
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: systemPrompt + '\n\nAnalise esta imagem seguindo as instruções acima.',
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64,
                },
              },
            ],
          },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices[0].message.content;

    console.log('AI response received:', aiContent);

    // Parse JSON from AI response
    let analysisResult;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = aiContent.match(/```json\n([\s\S]*?)\n```/) || aiContent.match(/```\n([\s\S]*?)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : aiContent;
      analysisResult = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      throw new Error('Failed to parse AI analysis');
    }

    // Save analysis to database
    const { data: savedAnalysis, error: saveError } = await supabase
      .from('beauty_analyses')
      .insert({
        user_id: user.id,
        photo_url: imageUrlForStorage,
        analysis_type: analysisType,
        ai_analysis: analysisResult,
        skin_tone_detected: analysisResult.skin_tone_detected || null,
        face_shape: analysisResult.face_shape || null,
        recommendations: analysisResult,
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving analysis:', saveError);
      throw saveError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        analysis: savedAnalysis,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in analyze-beauty function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});