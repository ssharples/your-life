
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
    const { userData } = await req.json();

    const contextPrompt = `Based on the following user data, generate 3-5 personalized daily review questions that are insightful and actionable:

User Data Summary:
- Recent habit completion: ${userData.habitLogs?.length || 0} entries
- Journal entries: ${userData.journalEntries?.length || 0} entries  
- Task completions: ${userData.taskCompletions?.length || 0} entries
- Active goals: ${userData.goalProgress?.length || 0} goals
- Recent mood ratings: ${userData.moodRatings?.length || 0} entries

Generate questions that:
1. Focus on patterns and correlations in their data
2. Help identify successful strategies
3. Address areas needing improvement
4. Encourage self-reflection and growth
5. Are specific to their actual behavior patterns

Return a JSON array of question objects with fields: id, question, category, priority, context, and suggested_response.`;

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
            content: 'You are an expert life coach and behavioral psychologist. Generate personalized daily review questions based on user data patterns. Return only valid JSON.'
          },
          {
            role: 'user',
            content: contextPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', await response.text());
      // Return fallback questions
      const fallbackQuestions = [
        {
          id: '1',
          question: 'What was your biggest win today, and what made it possible?',
          category: 'Achievement Recognition',
          priority: 'high',
          context: 'Identifying success patterns',
          suggested_response: 'Focus on both the outcome and the process that led to it'
        },
        {
          id: '2',
          question: 'Which of your habits felt most natural today?',
          category: 'Habit Formation',
          priority: 'medium', 
          context: 'Understanding habit strength',
          suggested_response: 'Consider what environmental or mental factors supported this habit'
        },
        {
          id: '3',
          question: 'What would you approach differently if you could restart today?',
          category: 'Learning & Growth',
          priority: 'medium',
          context: 'Continuous improvement mindset',
          suggested_response: 'Focus on actionable changes rather than regrets'
        }
      ];

      return new Response(
        JSON.stringify({ questions: fallbackQuestions }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    let questions;
    
    try {
      const content = data.choices[0].message.content;
      questions = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Return fallback questions if parsing fails
      questions = [
        {
          id: '1',
          question: 'What patterns do you notice in your recent habit completions?',
          category: 'Pattern Recognition',
          priority: 'high',
          context: 'Based on your habit tracking data',
          suggested_response: 'Look for connections between successful days and specific conditions'
        }
      ];
    }

    return new Response(
      JSON.stringify({ questions: Array.isArray(questions) ? questions : [questions] }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating review questions:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate review questions' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
