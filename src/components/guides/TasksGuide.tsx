
import React from 'react';
import { GuideCard } from '@/components/ui/guide-card';

export const TasksGuide = () => {
  return (
    <div className="space-y-4 mb-6">
      <GuideCard
        title="Creating Actionable Tasks"
        description="Write tasks that lead to real progress"
        category="Writing"
        tips={[
          "Start tasks with action verbs: 'Call', 'Write', 'Research', 'Schedule', 'Complete'",
          "Be specific about the outcome: 'Draft 500-word blog post' vs 'Work on blog'",
          "Include context when helpful: 'Call John about project meeting (555-1234)'",
          "Make tasks completable in one sitting when possible",
          "Break large tasks into smaller, actionable steps"
        ]}
        defaultOpen={true}
      />
      
      <GuideCard
        title="Task Priority System"
        description="Focus on what matters most"
        category="Prioritization"
        tips={[
          "Priority 1 (Highest): Urgent and important, do immediately",
          "Priority 2 (High): Important but not urgent, schedule time for these",
          "Priority 3 (Medium): Routine tasks that keep things running",
          "Priority 4 (Low): Nice to have, do when time permits",
          "Priority 5 (Lowest): Consider if these tasks are necessary at all"
        ]}
      />

      <GuideCard
        title="Task Organization Tips"
        description="Keep your task list manageable and effective"
        category="Organization"
        tips={[
          "Review and update your task list daily during planning time",
          "Use due dates strategically - not everything needs a deadline",
          "Tag related tasks for easy filtering and batch processing",
          "Link tasks to projects and goals to maintain bigger picture focus",
          "Regularly clean up completed and cancelled tasks"
        ]}
      />
    </div>
  );
};
