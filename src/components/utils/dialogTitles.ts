
export const getDialogTitle = (type: string | null): string => {
  switch (type) {
    case 'task': return 'Quick Add Task';
    case 'goal': return 'Quick Add Goal';
    case 'project': return 'Quick Add Project';
    case 'habit': return 'Quick Add Habit';
    case 'journal': return 'Quick Add Journal Entry';
    case 'knowledge': return 'Quick Add Knowledge Note';
    case 'pillar': return 'Quick Add Pillar';
    case 'value': return 'Quick Add Value';
    default: return 'Quick Add';
  }
};
