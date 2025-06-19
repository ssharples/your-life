
-- Create a table for storing knowledge graph connections
CREATE TABLE public.knowledge_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source_id TEXT NOT NULL,
  target_id TEXT NOT NULL,
  connection_type TEXT NOT NULL DEFAULT 'related',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_knowledge_connections_user_id ON public.knowledge_connections(user_id);
CREATE INDEX idx_knowledge_connections_source_id ON public.knowledge_connections(source_id);
CREATE INDEX idx_knowledge_connections_target_id ON public.knowledge_connections(target_id);

-- Enable RLS
ALTER TABLE public.knowledge_connections ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own knowledge connections" 
  ON public.knowledge_connections 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own knowledge connections" 
  ON public.knowledge_connections 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own knowledge connections" 
  ON public.knowledge_connections 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own knowledge connections" 
  ON public.knowledge_connections 
  FOR DELETE 
  USING (auth.uid() = user_id);
