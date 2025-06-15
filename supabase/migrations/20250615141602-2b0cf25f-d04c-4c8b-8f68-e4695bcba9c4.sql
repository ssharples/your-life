
-- Create the core tables for the Life Operating System (avoiding conflicts with existing tables)

-- 1. Pillars (Life Areas) - foundational table
CREATE TABLE public.pillars (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Goals table
CREATE TABLE public.goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('short-term', 'long-term')),
  target_date DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
  priority INTEGER DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
  pillar_id UUID REFERENCES public.pillars(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. LOS Projects table (renamed to avoid conflict with existing projects table)
CREATE TABLE public.los_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed', 'paused', 'cancelled')),
  linked_goal_id UUID REFERENCES public.goals(id),
  pillar_id UUID REFERENCES public.pillars(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. Tasks table (renaming to avoid potential conflicts)
CREATE TABLE public.los_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  description TEXT NOT NULL,
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed', 'cancelled')),
  priority INTEGER DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
  project_id UUID REFERENCES public.los_projects(id),
  goal_id UUID REFERENCES public.goals(id),
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. Habits table
CREATE TABLE public.habits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  frequency TEXT NOT NULL DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly', 'monthly')),
  tracking_period INTEGER DEFAULT 30,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  goal_id UUID REFERENCES public.goals(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 6. Habit logs (junction table for tracking)
CREATE TABLE public.habit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  habit_id UUID REFERENCES public.habits(id) NOT NULL,
  date DATE NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 7. Journals table
CREATE TABLE public.journals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  date DATE NOT NULL,
  entry_type TEXT NOT NULL DEFAULT 'daily' CHECK (entry_type IN ('daily', 'weekly', 'monthly', 'quarterly', 'annual')),
  mood_rating INTEGER CHECK (mood_rating BETWEEN 1 AND 10),
  content TEXT NOT NULL,
  insights TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 8. Knowledge Vault table
CREATE TABLE public.knowledge_vault (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  source TEXT,
  content TEXT NOT NULL,
  tags TEXT[],
  linked_goal_id UUID REFERENCES public.goals(id),
  linked_project_id UUID REFERENCES public.los_projects(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 9. Reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  review_type TEXT NOT NULL CHECK (review_type IN ('daily', 'weekly', 'monthly', 'quarterly', 'annual')),
  date DATE NOT NULL,
  summary TEXT,
  reflections TEXT,
  linked_goals UUID[],
  linked_journals UUID[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 10. Values Vault table
CREATE TABLE public.values_vault (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  importance_rating INTEGER DEFAULT 5 CHECK (importance_rating BETWEEN 1 AND 10),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.pillars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.los_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.los_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_vault ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.values_vault ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for each table (users can only access their own data)
CREATE POLICY "Users can view their own pillars" ON public.pillars FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own pillars" ON public.pillars FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own pillars" ON public.pillars FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own pillars" ON public.pillars FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own goals" ON public.goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own goals" ON public.goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own goals" ON public.goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own goals" ON public.goals FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own los projects" ON public.los_projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own los projects" ON public.los_projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own los projects" ON public.los_projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own los projects" ON public.los_projects FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own los tasks" ON public.los_tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own los tasks" ON public.los_tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own los tasks" ON public.los_tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own los tasks" ON public.los_tasks FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own habits" ON public.habits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own habits" ON public.habits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own habits" ON public.habits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own habits" ON public.habits FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own habit logs" ON public.habit_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own habit logs" ON public.habit_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own habit logs" ON public.habit_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own habit logs" ON public.habit_logs FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own journals" ON public.journals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own journals" ON public.journals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own journals" ON public.journals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own journals" ON public.journals FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own knowledge vault" ON public.knowledge_vault FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own knowledge vault" ON public.knowledge_vault FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own knowledge vault" ON public.knowledge_vault FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own knowledge vault" ON public.knowledge_vault FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own reviews" ON public.reviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reviews" ON public.reviews FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own values vault" ON public.values_vault FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own values vault" ON public.values_vault FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own values vault" ON public.values_vault FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own values vault" ON public.values_vault FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_goals_user_id ON public.goals(user_id);
CREATE INDEX idx_goals_pillar_id ON public.goals(pillar_id);
CREATE INDEX idx_los_projects_user_id ON public.los_projects(user_id);
CREATE INDEX idx_los_projects_goal_id ON public.los_projects(linked_goal_id);
CREATE INDEX idx_los_tasks_user_id ON public.los_tasks(user_id);
CREATE INDEX idx_los_tasks_project_id ON public.los_tasks(project_id);
CREATE INDEX idx_habits_user_id ON public.habits(user_id);
CREATE INDEX idx_habit_logs_user_id ON public.habit_logs(user_id);
CREATE INDEX idx_habit_logs_habit_id ON public.habit_logs(habit_id);
CREATE INDEX idx_journals_user_id ON public.journals(user_id);
CREATE INDEX idx_journals_date ON public.journals(date);
CREATE INDEX idx_knowledge_vault_user_id ON public.knowledge_vault(user_id);
CREATE INDEX idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX idx_values_vault_user_id ON public.values_vault(user_id);

-- Add updated_at triggers to relevant tables (reusing existing function)
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.pillars FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.goals FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.los_projects FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.los_tasks FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.habits FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.journals FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.knowledge_vault FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.values_vault FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
