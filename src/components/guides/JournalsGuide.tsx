
import React from 'react';
import { GuideCard } from '@/components/ui/guide-card';

export const JournalsGuide = () => {
  return (
    <div className="space-y-4 mb-6">
      <GuideCard
        title="Effective Journaling Techniques"
        description="Get the most out of your journal practice"
        category="Techniques"
        tips={[
          "Write consistently, even if just a few sentences",
          "Be honest and authentic - this is for you, not anyone else",
          "Include both events and your emotional responses to them",
          "Ask yourself reflective questions: 'What did I learn today?', 'What am I grateful for?'",
          "Don't worry about grammar or structure - focus on getting thoughts out"
        ]}
        defaultOpen={true}
      />
      
      <GuideCard
        title="Journal Entry Types"
        description="Different approaches for different needs"
        category="Types"
        tips={[
          "Daily: Quick check-ins, mood tracking, daily highlights and challenges",
          "Weekly: Reflection on the week, lessons learned, planning ahead",
          "Monthly: Deeper analysis, goal progress review, major insights",
          "Quarterly: Big picture reflection, life direction assessment",
          "Annual: Year in review, major accomplishments, future visioning"
        ]}
      />

      <GuideCard
        title="Mood Rating & Insights"
        description="Track emotional patterns and extract valuable insights"
        category="Analysis"
        tips={[
          "Rate your mood consistently on a 1-10 scale for better pattern recognition",
          "Note what influenced your mood - people, events, activities, weather",
          "Look for patterns over time: What consistently raises or lowers your mood?",
          "Use insights section to capture key learnings and 'aha' moments",
          "Review past entries to see growth and recurring themes"
        ]}
      />
    </div>
  );
};
