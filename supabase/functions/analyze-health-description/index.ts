import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { description, trackingType } = await req.json();
    
    if (!description || !trackingType) {
      throw new Error('Description and tracking type are required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    console.log(`Analyzing ${trackingType} description...`);

    const systemPrompt = `Você é uma assistente de saúde feminina especializada em bem-estar holístico. 
Analise a descrição do usuário sobre ${trackingType} e forneça insights compassivos e úteis.
Forneça sua resposta em formato JSON com os seguintes campos:
- analysis: uma análise breve da situação descrita (2-3 frases)
- suggestions: array de 3 sugestões práticas e específicas
- insights: array de 2-3 insights sobre o que isso pode indicar
- needs_attention: booleano indicando se requer atenção médica
- quality_score: número de 1 a 5 avaliando a qualidade (1=muito ruim, 5=excelente) baseado na descrição. Para sono: qualidade do sono. Para humor: intensidade positiva do humor. Para energia: nível de energia.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: description }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', errorText);
      throw new Error(`Lovable AI error: ${errorText}`);
    }

    const data = await response.json();
    const analysisResult = JSON.parse(data.choices[0].message.content);
    
    console.log('Analysis complete');

    return new Response(
      JSON.stringify(analysisResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-health-description:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
