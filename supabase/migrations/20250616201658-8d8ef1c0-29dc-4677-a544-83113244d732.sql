
-- Add type column to habits table to support do/don't habit types
ALTER TABLE habits ADD COLUMN type TEXT NOT NULL DEFAULT 'do';

-- Add a check constraint to ensure type is either 'do' or 'dont'
ALTER TABLE habits ADD CONSTRAINT habits_type_check CHECK (type IN ('do', 'dont'));
