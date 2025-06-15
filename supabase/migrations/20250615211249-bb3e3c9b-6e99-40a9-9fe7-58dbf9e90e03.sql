
-- Add columns to support guided review templates and responses
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS template_responses JSONB DEFAULT '{}';
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS review_step INTEGER DEFAULT 1;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS is_completed BOOLEAN DEFAULT false;

-- Create a table to store review templates
CREATE TABLE IF NOT EXISTS review_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_type TEXT NOT NULL,
  step_number INTEGER NOT NULL,
  step_title TEXT NOT NULL,
  step_description TEXT,
  prompts JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(review_type, step_number)
);

-- Insert templates for each review type
INSERT INTO review_templates (review_type, step_number, step_title, step_description, prompts) VALUES 
-- Daily Review Templates
('daily', 1, 'Task Review', 'Review your due tasks for today', '["Review each task and decide: Complete, Reschedule, or Delete"]'),
('daily', 2, 'Habit Check-in', 'Mark your habits as successful or failed', '["Which habits did you complete today?", "Which habits did you miss and why?"]'),
('daily', 3, 'Emotional Check-in', 'Reflect on your emotional state', '["Write down any negative thoughts or emotions that have come up throughout the day", "What triggered these emotions?", "How did you handle them?"]'),
('daily', 4, 'Tomorrow Planning', 'Set intentions for tomorrow', '["What are your top 3 priorities for tomorrow?", "What will you do differently tomorrow?"]'),

-- Weekly Review Templates  
('weekly', 1, 'Weekly Reflection', 'Reflect on the past week', '["What went well this week?", "What could have been improved?", "What were your biggest achievements?", "What were your biggest disappointments?"]'),
('weekly', 2, 'Next Week Planning', 'Set objectives for the upcoming week', '["What are your main objectives for next week?", "What will you focus on?", "What habits will you prioritize?"]'),

-- Monthly Review Templates
('monthly', 1, 'Monthly Overview', 'Review your month holistically', '["How did this month align with your goals?", "What patterns do you notice in your weekly reviews?"]'),
('monthly', 2, 'Pillars Review', 'Evaluate your life pillars', '["How well did you maintain balance across your life pillars?", "Which pillar needs more attention next month?"]'),
('monthly', 3, 'Goals Assessment', 'Review progress on your goals', '["Which goals made significant progress?", "Which goals are falling behind and why?", "Do any goals need to be adjusted?"]'),
('monthly', 4, 'Habits Evaluation', 'Assess your habit consistency', '["Which habits are becoming automatic?", "Which habits need more focus?", "What environmental changes could support your habits?"]'),

-- Quarterly Review Templates
('quarterly', 1, 'Quarter Reflection', 'Deep dive into the past 3 months', '["What were the major themes of this quarter?", "What significant progress was made?", "What obstacles emerged?"]'),
('quarterly', 2, 'Strategic Assessment', 'Review your strategic direction', '["Are you on track with your annual goals?", "What strategic adjustments are needed?", "What new opportunities have emerged?"]'),

-- Annual Review Templates
('annual', 1, 'Reflect - People', 'Reflect on meaningful relationships', '["Who mattered most in your life this year? How, in what way?", "What relationships brought you joy and growth?", "Which relationships need more attention?"]'),
('annual', 2, 'Reflect - Places', 'Reflect on meaningful locations', '["Where did meaningful things happen in your life?", "What environments brought out your best self?", "Which places hold special significance and why?"]'),
('annual', 3, 'Reflect - Experiences', 'Reflect on significant experiences', '["What were the most meaningful events and experiences?", "Which experiences challenged you to grow?", "What moments brought you the most joy?"]'),
('annual', 4, 'Reflect - Questions', 'Deep reflection questions', '["What are the best questions you could ask yourself about this past year?", "What shift in thinking do you need to make?", "What is most important to you right now?"]'),
('annual', 5, 'Interpret - People', 'Understand relationship significance', '["WHY were those people important and impactful in your life?", "What do these relationships reveal about your values?"]'),
('annual', 6, 'Interpret - Places', 'Understand place significance', '["WHY were those places important and impactful in your life?", "What do these environments reveal about what energizes you?"]'),
('annual', 7, 'Interpret - Experiences', 'Understand experience significance', '["WHY were those experiences important and impactful in your life?", "What themes keep coming up? What does this reveal about you?"]'),
('annual', 8, 'Visualize Future', 'Envision the next 12 months', '["Describe what your life will be like in 12 months if things go according to plan", "Who do you need to become to achieve those things?", "What do you need to learn?", "How do your habits and routines need to change?"]'),
('annual', 9, 'Overcome Obstacles', 'Identify and address barriers', '["What is holding you back from achieving your vision?", "How can you overcome these obstacles?", "What support systems do you need?"]');
