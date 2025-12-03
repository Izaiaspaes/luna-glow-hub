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
    const { title, message, bannerType } = await req.json();

    if (!title && !message) {
      return new Response(
        JSON.stringify({ error: "Title or message is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build a creative prompt for banner image
    const colorScheme = bannerType === 'promo' ? 'vibrant pink, purple and orange gradient' :
                        bannerType === 'warning' ? 'warm amber and yellow tones' :
                        bannerType === 'success' ? 'fresh green and teal colors' :
                        'soft blue and purple professional colors';

    const prompt = `Create a beautiful, modern promotional banner image for a women's wellness app. 
Theme: ${title || message}
Style: Clean, minimalist, elegant design with ${colorScheme}. 
Include: Abstract feminine shapes, soft gradients, subtle wellness icons (like moon, flowers, or hearts).
Aspect ratio: 16:9 horizontal banner format.
No text in the image, just visual elements.
Ultra high resolution, professional marketing quality.`;

    console.log("Generating image with prompt:", prompt);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      throw new Error("No image generated");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        imageData: imageUrl,
        message: "Image generated successfully" 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error generating banner image:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to generate image";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
