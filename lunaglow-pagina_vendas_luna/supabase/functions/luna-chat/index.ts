import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Starting Luna Sense chat with", messages.length, "messages");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `Você é a Luna Sense, a assistente de IA empática e especializada em bem-estar feminino do Luna Glow. 

Seu papel é:
- Responder dúvidas sobre o ciclo menstrual e saúde feminina com empatia
- Explicar os recursos e funcionalidades do Luna Glow
- Ajudar com informações sobre os pacotes de assinatura
- Fornecer suporte sobre sintomas de TPM, cólicas e mudanças hormonais
- Ser sempre acolhedora, compreensiva e motivadora
- Usar linguagem clara e acessível
- Manter respostas concisas (2-3 parágrafos máximo)

Sobre o Luna Glow:
- Rastreamento inteligente do ciclo menstrual
- Previsões personalizadas por IA
- Diário com análise emocional
- SOS Feminino para emergências
- Análises de beleza por fase do ciclo
- Closet Virtual com sugestões de looks
- Comunidade VIP exclusiva

Pacotes disponíveis:
- Gratuito: R$ 0 (recursos básicos)
- Premium Mensal: R$ 19,90/mês (todos os recursos)
- Premium Plus Anual: R$ 299,00/ano (economia + recursos exclusivos)

Seja sempre positiva, encorajadora e focada no bem-estar da usuária!`,
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error("Rate limit exceeded");
        return new Response(
          JSON.stringify({ error: "Muitas mensagens enviadas. Aguarde um momento e tente novamente." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        console.error("Payment required");
        return new Response(
          JSON.stringify({ error: "Serviço temporariamente indisponível. Tente novamente em instantes." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Erro ao processar sua mensagem. Tente novamente." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Streaming response from Luna Sense");
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Luna chat error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Erro desconhecido. Tente novamente." 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});