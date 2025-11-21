import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Generating symptom predictions for user:", user.id);

    // Get user's historical data (last 90 days)
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const [cycleData, moodData, energyData, sleepData] = await Promise.all([
      supabase
        .from("cycle_tracking")
        .select("*")
        .eq("user_id", user.id)
        .gte("cycle_start_date", ninetyDaysAgo.toISOString().split('T')[0])
        .order("cycle_start_date", { ascending: false }),
      supabase
        .from("mood_tracking")
        .select("*")
        .eq("user_id", user.id)
        .gte("mood_date", ninetyDaysAgo.toISOString().split('T')[0])
        .order("mood_date", { ascending: false }),
      supabase
        .from("energy_tracking")
        .select("*")
        .eq("user_id", user.id)
        .gte("energy_date", ninetyDaysAgo.toISOString().split('T')[0])
        .order("energy_date", { ascending: false }),
      supabase
        .from("sleep_tracking")
        .select("*")
        .eq("user_id", user.id)
        .gte("sleep_date", ninetyDaysAgo.toISOString().split('T')[0])
        .order("sleep_date", { ascending: false }),
    ]);

    if (!cycleData.data || cycleData.data.length === 0) {
      return new Response(
        JSON.stringify({ error: "Dados insuficientes para gerar previsões. Continue registrando seu ciclo!" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get user profile for personalization
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("user_id", user.id)
      .single();

    const userName = profile?.full_name || "usuária";

    // Prepare data summary for AI
    const dataSummary = {
      cycleCount: cycleData.data.length,
      averageCycleLength: cycleData.data.reduce((acc, c) => acc + (c.cycle_length || 28), 0) / cycleData.data.length,
      commonSymptoms: cycleData.data.flatMap(c => c.symptoms || []),
      moodPatterns: moodData.data?.slice(0, 20).map(m => ({ type: m.mood_type, level: m.mood_level, date: m.mood_date })) || [],
      energyPatterns: energyData.data?.slice(0, 20).map(e => ({ level: e.energy_level, date: e.energy_date })) || [],
      sleepPatterns: sleepData.data?.slice(0, 20).map(s => ({ quality: s.sleep_quality, duration: s.sleep_duration_hours, date: s.sleep_date })) || [],
      lastCycle: cycleData.data[0],
    };

    // Calculate current phase and next phases
    const lastCycleStart = new Date(dataSummary.lastCycle.cycle_start_date);
    const today = new Date();
    const daysSinceStart = Math.floor((today.getTime() - lastCycleStart.getTime()) / (1000 * 60 * 60 * 24));
    const cycleLength = dataSummary.lastCycle.cycle_length || 28;

    let currentPhase = "menstrual";
    if (daysSinceStart >= 0 && daysSinceStart <= 5) currentPhase = "menstrual";
    else if (daysSinceStart > 5 && daysSinceStart <= 13) currentPhase = "follicular";
    else if (daysSinceStart > 13 && daysSinceStart <= 16) currentPhase = "ovulatory";
    else if (daysSinceStart > 16 && daysSinceStart < cycleLength) currentPhase = "luteal";

    // Call Lovable AI for predictions
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const prompt = `Você é uma assistente especializada em saúde feminina e bem-estar hormonal. Analise os dados históricos abaixo e gere previsões inteligentes de sintomas para os próximos 7 dias.

DADOS HISTÓRICOS (últimos 90 dias):
- Número de ciclos registrados: ${dataSummary.cycleCount}
- Duração média do ciclo: ${dataSummary.averageCycleLength.toFixed(1)} dias
- Sintomas comuns observados: ${[...new Set(dataSummary.commonSymptoms)].join(", ") || "nenhum registrado"}
- Fase atual do ciclo: ${currentPhase}
- Dias desde início do último ciclo: ${daysSinceStart}

PADRÕES DE HUMOR (últimos 20 registros):
${dataSummary.moodPatterns.map(m => `- ${m.date}: ${m.type || "não especificado"} (nível ${m.level || "não especificado"})`).join("\n")}

PADRÕES DE ENERGIA (últimos 20 registros):
${dataSummary.energyPatterns.map(e => `- ${e.date}: nível ${e.level || "não especificado"}`).join("\n")}

PADRÕES DE SONO (últimos 20 registros):
${dataSummary.sleepPatterns.map(s => `- ${s.date}: qualidade ${s.quality || "não especificado"}, duração ${s.duration || "não especificado"}h`).join("\n")}

Com base nesses dados, gere previsões para os próximos 7 dias usando o seguinte formato JSON:

{
  "predictions": [
    {
      "date": "YYYY-MM-DD",
      "phase": "menstrual|follicular|ovulatory|luteal",
      "symptoms": ["sintoma1", "sintoma2"],
      "confidence": 85,
      "severity": "low|medium|high",
      "recommendations": ["recomendação1", "recomendação2"]
    }
  ],
  "summary": "Resumo geral das previsões em 2-3 frases"
}

INSTRUÇÕES:
1. Use os padrões históricos para identificar tendências
2. Seja específica sobre sintomas prováveis (ex: "cólicas leves", "TPM", "aumento de energia")
3. O confidence score deve ser de 0-100 baseado na consistência dos dados históricos
4. As recomendações devem ser práticas e acionáveis
5. Considere a fase do ciclo para cada data prevista
6. Retorne APENAS o JSON, sem texto adicional`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "Você é uma especialista em saúde feminina. Sempre responda em português do Brasil e use dados científicos."
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("Lovable AI error:", aiResponse.status, errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices[0].message.content;

    // Parse AI response
    let predictions;
    try {
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found in response");
      predictions = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("Failed to parse AI response:", aiContent);
      throw new Error("Failed to parse AI predictions");
    }

    // Save predictions to database
    const predictionsToSave = predictions.predictions.map((pred: any) => ({
      user_id: user.id,
      prediction_date: pred.date,
      predicted_phase: pred.phase,
      predicted_symptoms: pred.symptoms,
      confidence_score: pred.confidence,
      recommendations: pred.recommendations,
    }));

    const { error: insertError } = await supabase
      .from("symptom_predictions")
      .insert(predictionsToSave);

    if (insertError) {
      console.error("Error saving predictions:", insertError);
      throw insertError;
    }

    console.log("Predictions generated successfully for user:", user.id);

    return new Response(
      JSON.stringify({
        predictions: predictions.predictions,
        summary: predictions.summary,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in predict-symptoms function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});