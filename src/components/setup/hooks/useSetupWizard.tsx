
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { SetupData } from '../SetupWizard';

const initialSetupData: SetupData = {
  personalInfo: {
    name: '',
    age: '',
    occupation: '',
    location: ''
  },
  lifeAreas: [],
  goals: [],
  values: [],
  aiRecommendations: {
    pillars: [],
    projects: [],
    tasks: []
  }
};

export const useSetupWizard = () => {
  const [setupData, setSetupData] = useState<SetupData>(initialSetupData);
  const [isProcessing, setIsProcessing] = useState(false);

  const updateSetupData = (data: Partial<SetupData>) => {
    setSetupData(prev => ({
      ...prev,
      ...data
    }));
  };

  const generateRecommendations = async () => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-setup-recommendations', {
        body: {
          personalInfo: setupData.personalInfo,
          lifeAreas: setupData.lifeAreas,
          goals: setupData.goals,
          values: setupData.values
        }
      });

      if (error) throw error;

      updateSetupData({
        aiRecommendations: data.recommendations
      });

      toast({
        title: "AI Recommendations Generated",
        description: "We've created personalized recommendations based on your inputs."
      });
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to generate recommendations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const saveSetup = async () => {
    setIsProcessing(true);
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const userId = user.data.user.id;

      // Create pillars
      const pillarPromises = setupData.aiRecommendations.pillars.map(async (pillar: any) => {
        const { data, error } = await supabase
          .from('pillars')
          .insert({
            name: pillar.name,
            description: pillar.description,
            user_id: userId
          })
          .select()
          .single();
        
        if (error) throw error;
        return data;
      });

      const createdPillars = await Promise.all(pillarPromises);

      // Create values
      const valuePromises = setupData.values.map(async (value) => {
        const { data, error } = await supabase
          .from('values_vault')
          .insert({
            value: value.title,
            description: value.description,
            importance_rating: value.importance,
            user_id: userId
          })
          .select()
          .single();
        
        if (error) throw error;
        return data;
      });

      const createdValues = await Promise.all(valuePromises);

      // Create goals
      const goalPromises = setupData.goals.map(async (goal) => {
        const pillar = createdPillars.find(p => p.name.toLowerCase().includes(goal.area.toLowerCase()));
        
        const { data, error } = await supabase
          .from('goals')
          .insert({
            title: goal.title,
            description: goal.description,
            type: 'long-term',
            pillar_id: pillar?.id,
            user_id: userId
          })
          .select()
          .single();
        
        if (error) throw error;
        return data;
      });

      const createdGoals = await Promise.all(goalPromises);

      // Create projects
      const projectPromises = setupData.aiRecommendations.projects.map(async (project: any) => {
        const relatedGoal = createdGoals.find(g => 
          g.title.toLowerCase().includes(project.relatedArea?.toLowerCase() || '')
        );

        const { data, error } = await supabase
          .from('los_projects')
          .insert({
            title: project.title,
            description: project.description,
            linked_goal_id: relatedGoal?.id,
            user_id: userId
          })
          .select()
          .single();
        
        if (error) throw error;
        return data;
      });

      const createdProjects = await Promise.all(projectPromises);

      // Create tasks
      const taskPromises = setupData.aiRecommendations.tasks.map(async (task: any) => {
        const relatedProject = createdProjects.find(p => 
          p.title.toLowerCase().includes(task.relatedArea?.toLowerCase() || '')
        );
        const relatedGoal = createdGoals.find(g => 
          g.title.toLowerCase().includes(task.relatedArea?.toLowerCase() || '')
        );

        const { data, error } = await supabase
          .from('los_tasks')
          .insert({
            description: task.title,
            project_id: relatedProject?.id,
            goal_id: relatedGoal?.id,
            priority: task.priority || 3,
            user_id: userId
          })
          .select()
          .single();
        
        if (error) throw error;
        return data;
      });

      await Promise.all(taskPromises);

      toast({
        title: "Setup Complete!",
        description: "Your life organization system has been created successfully."
      });

    } catch (error) {
      console.error('Error saving setup:', error);
      toast({
        title: "Error",
        description: "Failed to save your setup. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    setupData,
    updateSetupData,
    isProcessing,
    generateRecommendations,
    saveSetup
  };
};
