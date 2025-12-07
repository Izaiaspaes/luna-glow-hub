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

    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return new Response(JSON.stringify({ error: 'Missing imageUrl' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = `Você é uma consultora de moda especializada em análise de peças de roupa. Analise a imagem da peça de roupa fornecida e forneça uma análise detalhada em JSON.

Forneça sua análise no seguinte formato JSON:
{
  "item_type": "tipo da peça (top, bottom, dress, shoes, accessories, outerwear)",
  "category": "categoria (casual, formal, sport, party, etc.)",
  "colors": ["cor1", "cor2", "cor3"],
  "season": ["primavera", "verão", "outono", "inverno"],
  "occasion": ["trabalho", "casual", "formal", "festa", "esporte"],
  "description": "descrição detalhada da peça",
  "tags": ["tag1", "tag2", "tag3"],
  "styling_tips": "dicas de como usar esta peça"
}`;

    console.log('Sending image to AI for clothing analysis...');

    // Call Lovable AI with image
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
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analise esta peça de roupa seguindo as instruções do sistema.',
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                },
              },
            ],
          },
        ],
        temperature: 0.7,
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

    // Parse JSON from AI response - handle markdown code blocks
    let analysisResult;
    try {
      const jsonCodeBlockMatch = aiContent.match(/```json\n?([\s\S]*?)\n?```/) || 
                                  aiContent.match(/```\n?([\s\S]*?)\n?```/);
      const jsonString = jsonCodeBlockMatch ? jsonCodeBlockMatch[1].trim() : aiContent.trim();
      analysisResult = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      throw new Error('Failed to parse AI analysis');
    }

    // Save clothing item to database
    const { data: savedItem, error: saveError } = await supabase
      .from('closet_items')
      .insert({
        user_id: user.id,
        photo_url: imageUrl,
        item_type: analysisResult.item_type,
        category: analysisResult.category,
        colors: analysisResult.colors,
        season: analysisResult.season,
        occasion: analysisResult.occasion,
        ai_description: analysisResult.description,
        ai_tags: analysisResult.tags,
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving clothing item:', saveError);
      throw saveError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        item: savedItem,
        styling_tips: analysisResult.styling_tips,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in analyze-clothing-item function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
