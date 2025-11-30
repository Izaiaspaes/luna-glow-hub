-- Create storage bucket for beauty analysis photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'beauty-analysis',
  'beauty-analysis',
  false,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
);

-- RLS policies for beauty-analysis bucket
CREATE POLICY "Users can upload their own beauty analysis photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'beauty-analysis' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own beauty analysis photos"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'beauty-analysis' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own beauty analysis photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'beauty-analysis' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create table for beauty analysis history
CREATE TABLE public.beauty_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  photo_url TEXT NOT NULL,
  analysis_type TEXT NOT NULL, -- 'face', 'body', 'product'
  ai_analysis JSONB NOT NULL,
  skin_tone_detected TEXT,
  face_shape TEXT,
  recommendations JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.beauty_analyses ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own beauty analyses"
ON public.beauty_analyses
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own beauty analyses"
ON public.beauty_analyses
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own beauty analyses"
ON public.beauty_analyses
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_beauty_analyses_updated_at
BEFORE UPDATE ON public.beauty_analyses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();