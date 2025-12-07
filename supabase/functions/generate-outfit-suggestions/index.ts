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

    const { occasion, season } = await req.json();

    // Fetch all user's closet items
    const { data: closetItems, error: itemsError } = await supabase
      .from('closet_items')
      .select('*')
      .eq('user_id', user.id);

    if (itemsError) {
      throw itemsError;
    }

    if (!closetItems || closetItems.length === 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Você ainda não tem peças no seu closet. Adicione algumas peças primeiro!' 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Build context for AI
    const closetContext = closetItems.map(item => ({
      id: item.id,
      type: item.item_type,
      category: item.category,
      colors: item.colors,
      description: item.ai_description,
      season: item.season,
      occasion: item.occasion,
    }));

    const systemPrompt = `Você é uma personal stylist especializada em criar combinações de looks. 

Baseado no guarda-roupa da usuária abaixo, crie 3 sugestões de looks completos para a ocasião "${occasion || 'casual'}" e estação "${season || 'qualquer'}".

Guarda-roupa disponível:
${JSON.stringify(closetContext, null, 2)}

Para cada look, forneça:
1. Nome criativo para o look
2. IDs das peças que compõem o look (use os IDs fornecidos)
3. Descrição de como combinar as peças
4. Dicas de styling e acessórios

Retorne sua resposta no seguinte formato JSON:
{
  "outfits": [
    {
      "outfit_name": "nome criativo",
      "item_ids": ["id1", "id2", "id3"],
      "description": "descrição detalhada de como usar",
      "styling_tips": "dicas extras de styling"
    }
  ]
}`;

    console.log('Generating outfit suggestions with AI...');

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
            content: `Crie sugestões de looks para: ocasião "${occasion || 'casual'}", estação "${season || 'qualquer'}".`,
          },
        ],
        temperature: 0.8,
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

    let suggestions;
    try {
      const jsonCodeBlockMatch = aiContent.match(/```json\n?([\s\S]*?)\n?```/) || 
                                  aiContent.match(/```\n?([\s\S]*?)\n?```/);
      const jsonString = jsonCodeBlockMatch ? jsonCodeBlockMatch[1].trim() : aiContent.trim();
      suggestions = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      throw new Error('Failed to parse AI suggestions');
    }

    // Save outfit suggestions to database
    const savedOutfits = [];
    for (const outfit of suggestions.outfits) {
      const { data: savedOutfit, error: saveError } = await supabase
        .from('outfit_suggestions')
        .insert({
          user_id: user.id,
          item_ids: outfit.item_ids,
          outfit_name: outfit.outfit_name,
          occasion: occasion || 'casual',
          season: season || null,
          ai_description: outfit.description,
          ai_styling_tips: outfit.styling_tips,
        })
        .select()
        .single();

      if (!saveError && savedOutfit) {
        savedOutfits.push(savedOutfit);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        outfits: savedOutfits,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in generate-outfit-suggestions function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
