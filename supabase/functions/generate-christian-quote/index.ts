
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPEN_AI_API');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a thoughtful Christian theologian. Generate inspiring, biblically-grounded quotes that encourage faith, hope, and spiritual growth. Keep quotes concise (1-2 sentences) and include a relevant Bible verse reference when appropriate.' 
          },
          { 
            role: 'user', 
            content: 'Generate an inspiring Christian quote for daily reflection and encouragement.' 
          }
        ],
        max_tokens: 150,
        temperature: 0.8,
      }),
    });

    const data = await response.json();
    const quote = data.choices[0].message.content;

    return new Response(JSON.stringify({ quote }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating Christian quote:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to generate quote',
      fallback: 'Trust in the Lord with all your heart and lean not on your own understanding. - Proverbs 3:5'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
