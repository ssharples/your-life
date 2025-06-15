
import React from 'react';
import { GuideCard } from '@/components/ui/guide-card';

export const PillarsGuide = () => {
  return (
    <div className="space-y-4 mb-6">
      <GuideCard
        title="Understanding Life Pillars"
        description="Define the core areas that support your life structure"
        category="Foundation"
        tips={[
          "Pillars represent the major areas of your life that need attention and balance",
          "Common pillars: Health, Career, Relationships, Personal Growth, Finance, Family",
          "Aim for 4-7 pillars - too few lacks detail, too many becomes overwhelming",
          "Each pillar should be distinct but they often interconnect",
          "Your pillars should reflect your current life stage and priorities"
        ]}
        defaultOpen={true}
      />
      
      <GuideCard
        title="Creating Effective Pillars"
        description="Guidelines for defining meaningful life areas"
        category="Creation"
        tips={[
          "Use broad categories that encompass multiple goals and activities",
          "Make them personal - your pillars might differ from others'",
          "Include both professional and personal aspects of life",
          "Consider adding spiritual/meaning pillar if important to you",
          "Review and adjust pillars as your life circumstances change"
        ]}
      />

      <GuideCard
        title="Using Pillars for Life Balance"
        description="Leverage pillars to maintain a well-rounded life"
        category="Balance"
        tips={[
          "Regularly assess if you're neglecting any pillar",
          "Set goals across multiple pillars to ensure balance",
          "Use pillars to categorize and prioritize your goals and projects",
          "During busy periods, ensure you maintain minimum attention to each pillar",
          "Link your daily habits and tasks back to specific pillars"
        ]}
      />
    </div>
  );
};
