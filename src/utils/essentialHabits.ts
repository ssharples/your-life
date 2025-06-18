
import { supabase } from '@/integrations/supabase/client';

export const ESSENTIAL_HABITS = [
  {
    title: 'Daily Journal',
    description: 'Reflect on your day through journaling',
    frequency: 'daily',
    type: 'do' as const,
    tracking_period: 30,
  },
  {
    title: 'Daily Review',
    description: 'Complete your daily reflection and planning',
    frequency: 'daily',
    type: 'do' as const,
    tracking_period: 30,
  },
];

export const initializeEssentialHabits = async (userId: string) => {
  try {
    // Check if essential habits already exist
    const { data: existingHabits } = await supabase
      .from('habits')
      .select('title')
      .eq('user_id', userId)
      .in('title', ESSENTIAL_HABITS.map(h => h.title));

    const existingTitles = existingHabits?.map(h => h.title) || [];
    const habitsToCreate = ESSENTIAL_HABITS.filter(
      habit => !existingTitles.includes(habit.title)
    );

    if (habitsToCreate.length > 0) {
      const { error } = await supabase
        .from('habits')
        .insert(
          habitsToCreate.map(habit => ({
            ...habit,
            user_id: userId,
            status: 'active',
          }))
        );

      if (error) throw error;
    }

    return { success: true, created: habitsToCreate.length };
  } catch (error) {
    console.error('Error initializing essential habits:', error);
    return { success: false, error };
  }
};
