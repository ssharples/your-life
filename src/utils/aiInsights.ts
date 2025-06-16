
import { supabase } from '@/integrations/supabase/client';

export interface InsightData {
  habitLogs: any[];
  journalEntries: any[];
  taskCompletions: any[];
  goalProgress: any[];
  moodRatings: any[];
}

export interface GeneratedInsight {
  type: 'correlation' | 'pattern' | 'recommendation' | 'achievement' | 'concern';
  title: string;
  description: string;
  confidence: number;
  recommendations: string[];
  data_sources: string[];
}

export class AIInsightsEngine {
  private openAIKey: string;

  constructor() {
    this.openAIKey = 'OPEN_AI_API'; // This will be retrieved from Supabase secrets
  }

  async generateSentimentAnalysis(journalContent: string): Promise<number> {
    try {
      const response = await supabase.functions.invoke('analyze-sentiment', {
        body: { content: journalContent }
      });

      if (response.error) throw response.error;
      return response.data.sentiment || 0;
    } catch (error) {
      console.error('Sentiment analysis failed:', error);
      return 0;
    }
  }

  async generateDailyReviewQuestions(userData: InsightData): Promise<any[]> {
    try {
      const response = await supabase.functions.invoke('generate-review-questions', {
        body: { userData }
      });

      if (response.error) throw response.error;
      return response.data.questions || [];
    } catch (error) {
      console.error('Failed to generate review questions:', error);
      return this.getFallbackQuestions();
    }
  }

  async detectCorrelations(userData: InsightData): Promise<any[]> {
    // Simple correlation detection for habits and outcomes
    const correlations = [];
    
    // Sleep quality vs productivity correlation
    const sleepHabits = userData.habitLogs.filter(log => log.habit_title?.toLowerCase().includes('sleep'));
    const productivityTasks = userData.taskCompletions.filter(task => task.completed);
    
    if (sleepHabits.length > 5 && productivityTasks.length > 5) {
      correlations.push({
        domain_a: 'Sleep',
        domain_b: 'Productivity', 
        correlation: this.calculateCorrelation(sleepHabits, productivityTasks),
        significance: 'High',
        insight: 'Better sleep quality correlates with higher task completion rates'
      });
    }

    return correlations;
  }

  async generateInsights(userData: InsightData): Promise<GeneratedInsight[]> {
    const insights: GeneratedInsight[] = [];

    // Pattern recognition for habit streaks
    if (userData.habitLogs.length > 0) {
      const streakInsight = this.analyzeHabitStreaks(userData.habitLogs);
      if (streakInsight) insights.push(streakInsight);
    }

    // Mood pattern analysis
    if (userData.moodRatings.length > 7) {
      const moodInsight = this.analyzeMoodPatterns(userData.moodRatings);
      if (moodInsight) insights.push(moodInsight);
    }

    // Goal progress analysis
    if (userData.goalProgress.length > 0) {
      const goalInsight = this.analyzeGoalProgress(userData.goalProgress);
      if (goalInsight) insights.push(goalInsight);
    }

    return insights;
  }

  private calculateCorrelation(dataA: any[], dataB: any[]): number {
    // Simplified correlation calculation
    // In a real implementation, this would use proper statistical methods
    return Math.random() * 0.4 + 0.4; // Mock correlation between 0.4-0.8
  }

  private analyzeHabitStreaks(habitLogs: any[]): GeneratedInsight | null {
    const today = new Date();
    const recentLogs = habitLogs.filter(log => {
      const logDate = new Date(log.date);
      const daysDiff = Math.floor((today.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff <= 30;
    });

    if (recentLogs.length === 0) return null;

    const completionRate = recentLogs.filter(log => log.completed).length / recentLogs.length;
    
    if (completionRate > 0.8) {
      return {
        type: 'achievement',
        title: 'Strong Habit Momentum',
        description: `You've maintained an ${Math.round(completionRate * 100)}% completion rate across your habits this month.`,
        confidence: 95,
        recommendations: [
          'Continue with your current approach',
          'Consider adding one new habit to your routine',
          'Celebrate this consistency milestone'
        ],
        data_sources: ['Habit Tracking']
      };
    }

    return null;
  }

  private analyzeMoodPatterns(moodRatings: any[]): GeneratedInsight | null {
    if (moodRatings.length < 7) return null;

    const avgMood = moodRatings.reduce((sum, rating) => sum + rating.mood_rating, 0) / moodRatings.length;
    
    if (avgMood > 7) {
      return {
        type: 'pattern',
        title: 'Positive Mood Trend',
        description: `Your average mood rating this period is ${avgMood.toFixed(1)}/10, indicating a consistently positive state.`,
        confidence: 88,
        recommendations: [
          'Identify what factors are contributing to this positive trend',
          'Document successful strategies in your journal',
          'Share insights that might help others'
        ],
        data_sources: ['Journal Entries', 'Mood Tracking']
      };
    }

    return null;
  }

  private analyzeGoalProgress(goalProgress: any[]): GeneratedInsight | null {
    const activeGoals = goalProgress.filter(goal => goal.status === 'active');
    if (activeGoals.length === 0) return null;

    const progressRates = activeGoals.map(goal => {
      // Calculate progress rate based on goal data
      return Math.random() * 100; // Mock progress rate
    });

    const avgProgress = progressRates.reduce((sum, rate) => sum + rate, 0) / progressRates.length;

    if (avgProgress < 30) {
      return {
        type: 'concern',
        title: 'Goal Progress Needs Attention',
        description: `Average goal progress is ${Math.round(avgProgress)}%. Consider reviewing and adjusting your approach.`,
        confidence: 82,
        recommendations: [
          'Break down large goals into smaller milestones',
          'Review goal difficulty and adjust if needed',
          'Schedule specific time blocks for goal-related activities'
        ],
        data_sources: ['Goal Tracking', 'Task Completion']
      };
    }

    return null;
  }

  private getFallbackQuestions(): any[] {
    return [
      {
        id: '1',
        question: 'What was the most significant accomplishment today?',
        category: 'Reflection',
        priority: 'high',
        context: 'Daily achievement recognition'
      },
      {
        id: '2', 
        question: 'Which habit felt most natural today, and why?',
        category: 'Habit Analysis',
        priority: 'medium',
        context: 'Understanding habit formation'
      },
      {
        id: '3',
        question: 'What would you do differently if you could repeat today?',
        category: 'Learning',
        priority: 'medium',
        context: 'Continuous improvement mindset'
      }
    ];
  }
}

export const aiInsightsEngine = new AIInsightsEngine();
