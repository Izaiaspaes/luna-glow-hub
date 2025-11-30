-- Make closet-items bucket public so AI can analyze images
UPDATE storage.buckets 
SET public = true 
WHERE id = 'closet-items';

-- Update RLS policies for closet-items bucket to allow public read access
CREATE POLICY "Public Access for AI Analysis"
ON storage.objects FOR SELECT
USING (bucket_id = 'closet-items');