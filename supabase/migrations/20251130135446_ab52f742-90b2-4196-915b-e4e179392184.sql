-- Create storage bucket for closet item photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('closet-items', 'closet-items', false);

-- Storage policies for closet items
CREATE POLICY "Users can upload their own closet item photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'closet-items' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own closet item photos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'closet-items' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own closet item photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'closet-items' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create closet_items table
CREATE TABLE IF NOT EXISTS public.closet_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  item_type TEXT NOT NULL, -- 'top', 'bottom', 'dress', 'shoes', 'accessories', 'outerwear'
  category TEXT, -- 'casual', 'formal', 'sport', 'party', etc.
  colors TEXT[], -- array of dominant colors
  season TEXT[], -- 'spring', 'summer', 'fall', 'winter'
  occasion TEXT[], -- 'work', 'casual', 'formal', 'party', 'sport'
  ai_description TEXT,
  ai_tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS policies for closet_items
ALTER TABLE public.closet_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own closet items"
ON public.closet_items FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own closet items"
ON public.closet_items FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own closet items"
ON public.closet_items FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own closet items"
ON public.closet_items FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create outfit_suggestions table
CREATE TABLE IF NOT EXISTS public.outfit_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_ids UUID[], -- array of closet_item ids used in the outfit
  outfit_name TEXT,
  occasion TEXT, -- 'work', 'casual', 'formal', 'party', 'date', etc.
  season TEXT, -- 'spring', 'summer', 'fall', 'winter'
  ai_description TEXT,
  ai_styling_tips TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS policies for outfit_suggestions
ALTER TABLE public.outfit_suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own outfit suggestions"
ON public.outfit_suggestions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own outfit suggestions"
ON public.outfit_suggestions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own outfit suggestions"
ON public.outfit_suggestions FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Trigger to update updated_at on closet_items
CREATE TRIGGER update_closet_items_updated_at
BEFORE UPDATE ON public.closet_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();