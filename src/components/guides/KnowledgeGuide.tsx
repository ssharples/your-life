
import React from 'react';
import { GuideCard } from '@/components/ui/guide-card';

export const KnowledgeGuide = () => {
  return (
    <div className="space-y-4 mb-6">
      <GuideCard
        title="Organizing Your Knowledge"
        description="Build a valuable personal knowledge base"
        category="Organization"
        tips={[
          "Capture insights immediately when they occur - don't rely on memory",
          "Always note the source for future reference and credibility",
          "Link knowledge items to relevant goals and projects for context",
          "Write in your own words to ensure understanding and retention",
          "Include actionable takeaways, not just interesting facts"
        ]}
        defaultOpen={true}
      />
      
      <GuideCard
        title="Types of Knowledge to Capture"
        description="What's worth saving in your knowledge vault"
        category="Content"
        tips={[
          "Key insights from books, articles, podcasts, and videos",
          "Lessons learned from personal experiences and mistakes",
          "Best practices and frameworks that apply to your goals",
          "Quotes and ideas that resonate with your values",
          "Technical knowledge and how-to information for future reference"
        ]}
      />

      <GuideCard
        title="Making Knowledge Actionable"
        description="Turn information into transformation"
        category="Application"
        tips={[
          "Always ask: 'How can I apply this to my life or goals?'",
          "Create connections between new knowledge and existing knowledge",
          "Schedule time to review and implement key insights",
          "Share valuable knowledge with others to reinforce your learning",
          "Regularly revisit your knowledge vault to refresh important concepts"
        ]}
      />
    </div>
  );
};
