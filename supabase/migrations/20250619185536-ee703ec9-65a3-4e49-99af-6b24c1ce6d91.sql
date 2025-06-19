
-- Create a table to log when users put their values into action
CREATE TABLE IF NOT EXISTS value_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  value_id UUID NOT NULL REFERENCES values_vault(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add Row Level Security
ALTER TABLE value_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for value_logs
CREATE POLICY "Users can view their own value logs" 
  ON value_logs 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own value logs" 
  ON value_logs 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own value logs" 
  ON value_logs 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own value logs" 
  ON value_logs 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Update the daily review template for step 3 to focus on values
UPDATE review_templates 
SET 
  step_title = 'Values Check-in',
  step_description = 'Reflect on which values you put into action today',
  prompts = '["Which of your core values did you actively live out today?", "How did you demonstrate these values through your actions?", "What specific situations allowed you to practice your values?"]'
WHERE review_type = 'daily' AND step_number = 3;
