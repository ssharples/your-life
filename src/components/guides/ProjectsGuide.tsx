
import React from 'react';
import { GuideCard } from '@/components/ui/guide-card';

export const ProjectsGuide = () => {
  return (
    <div className="space-y-4 mb-6">
      <GuideCard
        title="Project Planning Fundamentals"
        description="Structure your projects for maximum success"
        category="Planning"
        tips={[
          "Define clear project objectives and success criteria upfront",
          "Break large projects into smaller, manageable phases or milestones",
          "Set realistic start and end dates based on your available time and resources",
          "Link projects to specific goals to maintain focus and motivation",
          "Assign projects to relevant life pillars for better organization"
        ]}
        defaultOpen={true}
      />
      
      <GuideCard
        title="Project Lifecycle Management"
        description="Navigate through different project phases effectively"
        category="Process"
        tips={[
          "Planning: Define scope, timeline, and required resources",
          "Active: Execute tasks, track progress, and adjust as needed",
          "Paused: Temporarily halt when priorities change or obstacles arise",
          "Completed: Celebrate success and capture lessons learned",
          "Cancelled: End projects that no longer serve your goals"
        ]}
      />

      <GuideCard
        title="Project Success Tips"
        description="Best practices for project execution"
        category="Best Practices"
        tips={[
          "Start with the end in mind - visualize the completed project",
          "Identify potential obstacles early and plan contingencies",
          "Schedule regular check-ins to assess progress and make adjustments",
          "Keep projects focused - avoid scope creep that dilutes effort",
          "Document lessons learned for future project improvements"
        ]}
      />
    </div>
  );
};
