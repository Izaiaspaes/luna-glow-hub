-- Add image_url column to announcement_banners table
ALTER TABLE public.announcement_banners
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Create storage bucket for banner images
INSERT INTO storage.buckets (id, name, public)
VALUES ('banners', 'banners', true)
ON CONFLICT (id) DO NOTHING;

-- Allow admins to upload banner images
CREATE POLICY "Admins can upload banner images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'banners' AND 
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Allow admins to update banner images  
CREATE POLICY "Admins can update banner images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'banners' AND 
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Allow admins to delete banner images
CREATE POLICY "Admins can delete banner images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'banners' AND 
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Allow public to view banner images
CREATE POLICY "Public can view banner images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'banners');