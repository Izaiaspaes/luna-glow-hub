-- Create table for user suggestions and ideas
CREATE TABLE public.user_suggestions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  suggestion TEXT NOT NULL,
  category TEXT,
  status TEXT DEFAULT 'pending',
  is_reviewed BOOLEAN DEFAULT false,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_suggestions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert suggestions (public form)
CREATE POLICY "Anyone can submit suggestions"
ON public.user_suggestions
FOR INSERT
WITH CHECK (true);

-- Only admins can view suggestions
CREATE POLICY "Admins can view all suggestions"
ON public.user_suggestions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Only admins can update suggestions
CREATE POLICY "Admins can update suggestions"
ON public.user_suggestions
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Only admins can delete suggestions
CREATE POLICY "Admins can delete suggestions"
ON public.user_suggestions
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Create trigger for updated_at
CREATE TRIGGER update_user_suggestions_updated_at
BEFORE UPDATE ON public.user_suggestions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_user_suggestions_status ON public.user_suggestions(status);
CREATE INDEX idx_user_suggestions_created_at ON public.user_suggestions(created_at DESC);