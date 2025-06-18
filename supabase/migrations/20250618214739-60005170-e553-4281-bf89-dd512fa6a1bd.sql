
-- Add columns to support AI-enhanced goal creation
ALTER TABLE goals 
ADD COLUMN ai_enhanced BOOLEAN DEFAULT FALSE,
ADD COLUMN ai_suggestions JSONB DEFAULT '{}';

-- Update the existing goals table to ensure we have all needed columns
-- (pillar_id should already exist from previous migrations)
