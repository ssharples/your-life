
-- Add pillar tracking to reviews table
ALTER TABLE reviews ADD COLUMN selected_pillars uuid[] DEFAULT '{}';

-- Create pillar energy logs table to track energy allocation over time
CREATE TABLE pillar_energy_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  pillar_id uuid NOT NULL REFERENCES pillars(id),
  review_id uuid NOT NULL REFERENCES reviews(id),
  date date NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, pillar_id, review_id)
);

-- Enable RLS
ALTER TABLE pillar_energy_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their own pillar energy logs" ON pillar_energy_logs
  FOR ALL USING (auth.uid() = user_id);

-- Add index for performance
CREATE INDEX idx_pillar_energy_logs_user_pillar ON pillar_energy_logs(user_id, pillar_id);
CREATE INDEX idx_pillar_energy_logs_date ON pillar_energy_logs(date);
