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

    const { entry } = await req.json();

    if (!entry || !entry.trim()) {
      throw new Error('Entry text is required');
    }

    // Get user's name for personalization
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('user_id', user.id)
      .single();

    const userName = profile?.full_name || 'usuária';

    // Call Lovable AI to analyze the journal entry
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
            content: `Você é uma assistente de bem-estar feminino especializada em análise de diários pessoais. 
            Analise a entrada do diário e forneça insights empáticos e acionáveis.
            
            Retorne um JSON com a seguinte estrutura:
            {
              "summary": "Resumo do dia em 2-3 frases",
              "patterns": "Padrões recorrentes identificados",
              "suggestions": ["sugestão 1", "sugestão 2", "sugestão 3"],
              "correlations": "Correlações entre humor, sintomas e possível fase do ciclo"
            }
            
            Seja empática, acolhedora e focada no bem-estar da ${userName}.`
          },
          {
            role: 'user',
            content: entry
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      throw new Error('Failed to analyze journal entry');
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices[0].message.content;
    
    // Parse the AI response
    let analysis;
    try {
      analysis = JSON.parse(aiContent);
    } catch (e) {
      console.error('Failed to parse AI response:', aiContent);
      throw new Error('Failed to parse AI analysis');
    }

    // Save journal entry to database
    const { data: journalEntry, error: insertError } = await supabase
      .from('journal_entries')
      .insert({
        user_id: user.id,
        entry_text: entry,
        ai_summary: analysis.summary,
        ai_patterns: analysis.patterns,
        ai_suggestions: analysis.suggestions || [],
        ai_correlations: analysis.correlations,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw insertError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        entry: journalEntry,
        summary: analysis.summary,
        patterns: analysis.patterns,
        suggestions: analysis.suggestions,
        correlations: analysis.correlations,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in analyze-journal function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});