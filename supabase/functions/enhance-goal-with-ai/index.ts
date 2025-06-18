
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
    const { goalTitle } = await req.json();

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
            content: `You are a SMART goals expert. Given a goal title, provide specific suggestions for each SMART criteria. Return a JSON object with the following structure:
            {
              "specificDetails": "Detailed explanation of what exactly should be accomplished",
              "measurementCriteria": "How to measure progress and success with specific metrics",
              "achievabilityNotes": "Why this goal is realistic and what resources/skills are needed",
              "relevanceReason": "How this goal aligns with personal/professional development",
              "suggestedTimeframe": "Recommended timeframe with specific deadline"
            }
            
            Keep suggestions practical, actionable, and personalized to the goal title provided.`
          },
          { role: 'user', content: `Generate SMART goal suggestions for: "${goalTitle}"` }
        ],
      }),
    });

    const data = await response.json();
    const suggestions = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify({ suggestions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in enhance-goal-with-ai function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
