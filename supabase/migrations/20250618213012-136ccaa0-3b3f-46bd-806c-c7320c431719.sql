
-- Create junction table for values-goals many-to-many relationship
CREATE TABLE public.value_goal_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  value_id UUID NOT NULL REFERENCES public.values_vault(id) ON DELETE CASCADE,
  goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(value_id, goal_id)
);

-- Enable RLS on the new table
ALTER TABLE public.value_goal_connections ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for value_goal_connections
CREATE POLICY "Users can view their own value-goal connections" 
  ON public.value_goal_connections 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.values_vault v 
      WHERE v.id = value_goal_connections.value_id 
      AND v.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own value-goal connections" 
  ON public.value_goal_connections 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.values_vault v 
      WHERE v.id = value_goal_connections.value_id 
      AND v.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own value-goal connections" 
  ON public.value_goal_connections 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.values_vault v 
      WHERE v.id = value_goal_connections.value_id 
      AND v.user_id = auth.uid()
    )
  );

-- Remove the old value_pillar_connections table since we're not using it anymore
DROP TABLE IF EXISTS public.value_pillar_connections;
