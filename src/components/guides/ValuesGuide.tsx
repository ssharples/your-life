
import React from 'react';
import { GuideCard } from '@/components/ui/guide-card';

export const ValuesGuide = () => {
  return (
    <div className="space-y-4 mb-6">
      <GuideCard
        title="Identifying Your Core Values"
        description="Discover what truly matters to you"
        category="Discovery"
        tips={[
          "Values are fundamental beliefs that guide your decisions and behavior",
          "Think about moments when you felt most fulfilled and proud",
          "Consider what makes you angry or frustrated - this often reveals violated values",
          "Look at people you admire and identify what qualities they embody",
          "Start with a long list and narrow down to your top 5-7 core values"
        ]}
        defaultOpen={true}
      />
      
      <GuideCard
        title="Common Core Values Examples"
        description="Reference list to help identify your values"
        category="Examples"
        tips={[
          "Integrity, Honesty, Authenticity, Transparency",
          "Growth, Learning, Curiosity, Innovation, Creativity",
          "Family, Relationships, Community, Service, Compassion",
          "Excellence, Achievement, Success, Recognition",
          "Freedom, Independence, Adventure, Flexibility, Balance"
        ]}
      />

      <GuideCard
        title="Living Your Values Daily"
        description="Integrate values into decision-making and goal-setting"
        category="Application"
        tips={[
          "Use values as a filter for major life decisions",
          "Ensure your goals and projects align with your core values",
          "When feeling conflicted, check if you're honoring your values",
          "Rate importance of each value to help prioritize when values conflict",
          "Regularly reflect on whether your actions match your stated values"
        ]}
      />
    </div>
  );
};
