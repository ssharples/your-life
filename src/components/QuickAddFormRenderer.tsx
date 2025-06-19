
import { TaskForm } from './modules/tasks/TaskForm';
import { GoalFormWithAI } from './modules/goals/GoalFormWithAI';
import { HabitForm } from './modules/habits/HabitForm';
import { SimpleForm } from './forms/SimpleForm';

interface QuickAddFormRendererProps {
  type: string | null;
  goals?: any[];
  projects?: any[];
  onSubmit: (data: any) => void;
  onClose: () => void;
  createItem: any;
}

export const QuickAddFormRenderer = ({ 
  type, 
  goals, 
  projects, 
  onSubmit, 
  onClose, 
  createItem 
}: QuickAddFormRendererProps) => {
  const handleGoalChange = () => {};
  const handleProjectChange = () => {};

  switch (type) {
    case 'task':
      return (
        <TaskForm
          goals={goals}
          projects={projects}
          onSubmit={onSubmit}
          onGoalChange={handleGoalChange}
          onProjectChange={handleProjectChange}
        />
      );
    
    case 'goal':
      return (
        <GoalFormWithAI
          onSubmit={onSubmit}
          onCancel={onClose}
          createItem={createItem}
        />
      );
    
    case 'habit':
      return (
        <HabitForm
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      );

    default:
      return <SimpleForm type={type} onSubmit={onSubmit} onCancel={onClose} />;
  }
};
