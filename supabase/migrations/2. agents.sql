-- Create agents table
CREATE TABLE public.agents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('setup', 'copywriting', 'infoproduct', 'seo', 'document', 'sales', 'executor')),
  icon TEXT NOT NULL,
  inputs JSONB NOT NULL DEFAULT '[]',
  outputs JSONB NOT NULL DEFAULT '[]',
  config JSONB NOT NULL DEFAULT '{}',
  template TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_favorite BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own agents" 
ON public.agents 
FOR SELECT 
USING (user_id = current_setting('app.current_user_id')::UUID);

CREATE POLICY "Users can create their own agents" 
ON public.agents 
FOR INSERT 
WITH CHECK (user_id = current_setting('app.current_user_id')::UUID);

CREATE POLICY "Users can update their own agents" 
ON public.agents 
FOR UPDATE 
USING (user_id = current_setting('app.current_user_id')::UUID);

CREATE POLICY "Users can delete their own agents" 
ON public.agents 
FOR DELETE 
USING (user_id = current_setting('app.current_user_id')::UUID);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_agents_updated_at
BEFORE UPDATE ON public.agents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();