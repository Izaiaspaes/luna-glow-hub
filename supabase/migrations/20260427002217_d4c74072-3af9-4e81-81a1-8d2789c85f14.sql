
-- Explicit public SELECT policies for intentionally public buckets
CREATE POLICY "Avatars are publicly viewable"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'avatars');

CREATE POLICY "Banner images are publicly viewable"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'banners');

-- Allow newsletter unsubscribe by matching email (will be combined with email confirmation in app layer)
CREATE POLICY "Subscribers can view their own newsletter record"
ON public.newsletter_subscribers
FOR SELECT
TO authenticated
USING (email = (auth.jwt() ->> 'email'));

CREATE POLICY "Subscribers can unsubscribe themselves"
ON public.newsletter_subscribers
FOR DELETE
TO authenticated
USING (email = (auth.jwt() ->> 'email'));

-- Allow suggestion authors to view/delete their own submissions
CREATE POLICY "Authors can view their own suggestions"
ON public.user_suggestions
FOR SELECT
TO authenticated
USING (email = (auth.jwt() ->> 'email'));

CREATE POLICY "Authors can delete their own suggestions"
ON public.user_suggestions
FOR DELETE
TO authenticated
USING (email = (auth.jwt() ->> 'email'));
