
import React from 'react';
import { GuideCard } from '@/components/ui/guide-card';

export const ReviewsGuide = () => {
  return (
    <div className="space-y-4 mb-6">
      <GuideCard
        title="The Power of Regular Reviews"
        description="Why consistent reflection drives continuous improvement"
        category="Purpose"
        tips={[
          "Reviews help you stay aligned with your goals and values",
          "Regular reflection prevents you from drifting off course",
          "Identify patterns and trends you might miss in daily life",
          "Celebrate progress and acknowledge achievements",
          "Course-correct quickly when things aren't working"
        ]}
        defaultOpen={true}
      />
      
      <GuideCard
        title="Review Framework by Type"
        description="Structured approach for different review periods"
        category="Framework"
        tips={[
          "Daily: What went well? What could improve? What's priority tomorrow?",
          "Weekly: Goal progress, habit consistency, key lessons learned",
          "Monthly: Goal achievement, habit effectiveness, life balance assessment",
          "Quarterly: Deep goal review, strategy adjustments, big picture thinking",
          "Annual: Year achievements, major growth areas, vision for next year"
        ]}
      />

      <GuideCard
        title="Making Reviews Actionable"
        description="Turn reflection into concrete next steps"
        category="Implementation"
        tips={[
          "Always end reviews with specific action items",
          "Identify 2-3 key areas for improvement each review period",
          "Set up systems and processes to address recurring issues",
          "Celebrate wins to maintain motivation and momentum",
          "Track review insights over time to see long-term growth patterns"
        ]}
      />
    </div>
  );
};
