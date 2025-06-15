
import React from 'react';
import { GuideCard } from '@/components/ui/guide-card';

export const GoalsGuide = () => {
  return (
    <div className="space-y-4 mb-6">
      <GuideCard
        title="Setting SMART Goals"
        description="Create effective, achievable goals using the SMART framework"
        category="Framework"
        tips={[
          "Specific: Clearly define what you want to accomplish. Instead of 'get fit', try 'run a 5K in under 30 minutes'",
          "Measurable: Include metrics to track progress. Use numbers, percentages, or clear milestones",
          "Achievable: Set realistic goals based on your current situation and resources",
          "Relevant: Ensure goals align with your life pillars and personal values",
          "Time-bound: Set clear deadlines. Short-term goals (3-6 months) vs Long-term goals (1+ years)"
        ]}
        defaultOpen={true}
      />
      
      <GuideCard
        title="Goals vs Projects: What's the Difference?"
        description="Understanding the distinction between goals and projects"
        category="Concept"
        tips={[
          "Goals are outcomes you want to achieve (e.g., 'Lose 20 pounds', 'Learn Spanish')",
          "Projects are the structured work plans to achieve goals (e.g., '12-week fitness program', 'Spanish course completion')",
          "One goal can have multiple projects supporting it",
          "Projects have clear start/end dates and deliverables, goals focus on the desired end state",
          "Example: Goal = 'Become financially independent', Project = 'Create investment portfolio'"
        ]}
      />

      <GuideCard
        title="Goal Types & Timeframes"
        description="Choose the right timeframe for different types of goals"
        category="Planning"
        tips={[
          "Short-term goals (3-6 months): Skill acquisition, habit formation, small achievements",
          "Long-term goals (1+ years): Career changes, major life transitions, significant accomplishments",
          "Link short-term goals to long-term vision for better motivation",
          "Review and adjust goals quarterly during your reviews",
          "Celebrate milestone achievements to maintain momentum"
        ]}
      />
    </div>
  );
};
