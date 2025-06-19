
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { journalEntries } = await req.json();

    if (!journalEntries || journalEntries.length === 0) {
      return new Response(JSON.stringify({ 
        recommendations: [
          "Set a daily affirmation practice",
          "Create a personal growth plan",
          "Join a supportive community",
          "Start a new learning journey",
          "Practice mindful self-care"
        ]
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Extract content from journal entries
    const journalContent = journalEntries
      .map((entry: any) => entry.content || entry.negative_thought || entry.affirmation)
      .filter(Boolean)
      .join('\n\n');

    if (!journalContent.trim()) {
      return new Response(JSON.stringify({ 
        recommendations: [
          "Set a daily affirmation practice",
          "Create a personal growth plan",
          "Join a supportive community",
          "Start a new learning journey",
          "Practice mindful self-care"
        ]
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
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
            content: `You are a life coach AI that analyzes mindset journal entries to suggest actionable goals. Based on the journal entries, identify positive beliefs, affirmations, and growth areas, then suggest 3-5 specific, actionable goals that would help the person take concrete steps toward their positive mindset.

            Focus on:
            - Converting positive affirmations into actionable goals
            - Addressing areas where they want to grow
            - Building on their strengths and positive beliefs
            - Creating goals that reinforce their positive mindset

            Return only a JSON array of goal titles (strings), no explanations. Each goal should be concise and actionable (under 60 characters).

            Example format: ["Learn a new skill to boost confidence", "Start morning gratitude practice", "Join a community group"]`
          },
          { 
            role: 'user', 
            content: `Based on these mindset journal entries, suggest actionable goals that would help me take action on my positive beliefs and affirmations:\n\n${journalContent}`
          }
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    let recommendations = [];
    
    try {
      const content = data.choices?.[0]?.message?.content;
      if (content) {
        recommendations = JSON.parse(content);
      }
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      // Fallback recommendations
      recommendations = [
        "Set a daily affirmation practice",
        "Create a personal growth plan",
        "Join a supportive community",
        "Start a new learning journey",
        "Practice mindful self-care"
      ];
    }

    // Ensure we have an array of strings
    if (!Array.isArray(recommendations)) {
      recommendations = [
        "Set a daily affirmation practice",
        "Create a personal growth plan",
        "Join a supportive community",
        "Start a new learning journey",
        "Practice mindful self-care"
      ];
    }

    return new Response(JSON.stringify({ recommendations }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-goal-recommendations function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      recommendations: [
        "Set a daily affirmation practice",
        "Create a personal growth plan",
        "Join a supportive community",
        "Start a new learning journey",
        "Practice mindful self-care"
      ]
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
