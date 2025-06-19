
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
    const { negativeThought } = await req.json();

    if (!negativeThought) {
      throw new Error('Negative thought is required');
    }

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
            content: `You are a compassionate mindset coach helping people transform negative beliefs into empowering affirmations. 

Your task is to take a negative belief or thought and create a positive, believable, and empowering affirmation that:
1. Directly counters the negative belief
2. Is realistic and achievable 
3. Uses "I am" or "I" statements when appropriate
4. Focuses on growth, capability, and self-worth
5. Is specific and meaningful rather than generic

Keep affirmations concise (1-2 sentences) and make them feel authentic and believable to someone working on personal growth.`
          },
          {
            role: 'user',
            content: `Transform this negative belief into a positive affirmation: "${negativeThought}"`
          }
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to generate affirmation');
    }

    const affirmation = data.choices[0].message.content.trim();

    return new Response(JSON.stringify({ affirmation }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-affirmation function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
