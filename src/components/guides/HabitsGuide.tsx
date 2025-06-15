
import React from 'react';
import { GuideCard } from '@/components/ui/guide-card';

export const HabitsGuide = () => {
  return (
    <div className="space-y-4 mb-6">
      <GuideCard
        title="Building Successful Habits"
        description="Create lasting behavioral changes"
        category="Habit Formation"
        tips={[
          "Start small: Begin with a version so easy you can't say no (e.g., 1 push-up, 1 page of reading)",
          "Stack habits: Attach new habits to existing routines (e.g., 'After I pour coffee, I will meditate for 2 minutes')",
          "Focus on consistency over intensity in the beginning",
          "Track your habits daily to build momentum and identify patterns",
          "Celebrate small wins to reinforce the positive behavior"
        ]}
        defaultOpen={true}
      />
      
      <GuideCard
        title="Habit Frequency Guidelines"
        description="Choose the right frequency for different types of habits"
        category="Frequency"
        tips={[
          "Daily: Health habits (exercise, meditation, reading), personal care routines",
          "Weekly: Planning sessions, deep cleaning, relationship check-ins",
          "Monthly: Financial reviews, goal assessments, habit evaluations",
          "Start with daily habits for faster momentum building",
          "Be realistic about your schedule and energy levels"
        ]}
      />

      <GuideCard
        title="Overcoming Habit Challenges"
        description="Stay on track when motivation wanes"
        category="Troubleshooting"
        tips={[
          "Prepare for obstacles: Identify what might prevent you from doing the habit",
          "Use the 2-minute rule: Scale down the habit when you're struggling",
          "Never miss twice: If you skip one day, get back on track immediately",
          "Focus on identity change: 'I am someone who exercises' vs 'I want to exercise'",
          "Adjust rather than abandon: Modify habits that aren't working instead of quitting"
        ]}
      />
    </div>
  );
};
