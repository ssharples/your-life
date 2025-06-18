
-- Add pillar_id column to values_vault table to connect values to specific pillars
ALTER TABLE public.values_vault 
ADD COLUMN pillar_id UUID REFERENCES public.pillars(id);

-- Create an index for better performance when querying values by pillar
CREATE INDEX idx_values_vault_pillar_id ON public.values_vault(pillar_id);
