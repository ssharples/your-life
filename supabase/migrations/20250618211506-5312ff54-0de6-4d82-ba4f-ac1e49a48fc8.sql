
-- Remove the existing pillar_id column and create a many-to-many relationship
ALTER TABLE public.values_vault DROP COLUMN IF EXISTS pillar_id;

-- Create a junction table for values-to-pillars many-to-many relationship
CREATE TABLE public.value_pillar_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  value_id UUID NOT NULL REFERENCES public.values_vault(id) ON DELETE CASCADE,
  pillar_id UUID NOT NULL REFERENCES public.pillars(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(value_id, pillar_id)
);

-- Create indexes for better performance
CREATE INDEX idx_value_pillar_connections_value_id ON public.value_pillar_connections(value_id);
CREATE INDEX idx_value_pillar_connections_pillar_id ON public.value_pillar_connections(pillar_id);

-- Enable RLS on the junction table
ALTER TABLE public.value_pillar_connections ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for the junction table
CREATE POLICY "Users can view their own value-pillar connections" 
  ON public.value_pillar_connections 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.values_vault v 
      WHERE v.id = value_pillar_connections.value_id 
      AND v.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own value-pillar connections" 
  ON public.value_pillar_connections 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.values_vault v 
      WHERE v.id = value_pillar_connections.value_id 
      AND v.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own value-pillar connections" 
  ON public.value_pillar_connections 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.values_vault v 
      WHERE v.id = value_pillar_connections.value_id 
      AND v.user_id = auth.uid()
    )
  );
