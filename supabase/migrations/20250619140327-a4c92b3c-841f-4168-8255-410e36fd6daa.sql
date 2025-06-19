
-- First, let's see what values are currently allowed for entry_type
-- Then update the constraint to allow the new belief-related entry types

-- Drop the existing check constraint
ALTER TABLE journals DROP CONSTRAINT IF EXISTS journals_entry_type_check;

-- Add a new check constraint that includes the belief entry types
ALTER TABLE journals ADD CONSTRAINT journals_entry_type_check 
CHECK (entry_type IN ('daily', 'weekly', 'monthly', 'quarterly', 'annual', 'belief', 'daily_belief'));
