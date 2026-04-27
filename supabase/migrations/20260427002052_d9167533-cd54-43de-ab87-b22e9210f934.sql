
-- =========================================================
-- 1. price_settings: hide stripe_price_id from public
-- =========================================================
DROP POLICY IF EXISTS "Anyone can view active prices" ON public.price_settings;

-- Only admins can read full price_settings (including stripe_price_id)
CREATE POLICY "Admins can view all prices"
ON public.price_settings
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Public-facing view WITHOUT stripe_price_id
CREATE OR REPLACE VIEW public.price_settings_public
WITH (security_invoker = true)
AS
SELECT
  id,
  plan_type,
  currency,
  billing_period,
  price,
  is_active,
  is_promotion,
  promotion_start_date,
  promotion_end_date,
  created_at,
  updated_at
FROM public.price_settings
WHERE is_active = true;

GRANT SELECT ON public.price_settings_public TO anon, authenticated;

-- =========================================================
-- 2. beauty-analysis bucket: make private
-- =========================================================
UPDATE storage.buckets SET public = false WHERE id = 'beauty-analysis';

-- Add UPDATE policies for user-owned storage buckets
CREATE POLICY "Users can update their own beauty analysis photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'beauty-analysis'
  AND (auth.uid())::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'beauty-analysis'
  AND (auth.uid())::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own closet item photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'closet-items'
  AND (auth.uid())::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'closet-items'
  AND (auth.uid())::text = (storage.foldername(name))[1]
);

-- =========================================================
-- 3. Realtime: remove sensitive tables from publication
-- =========================================================
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename='admin_notifications'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE public.admin_notifications';
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename='partner_relationships'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE public.partner_relationships';
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename='partner_notifications'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE public.partner_notifications';
  END IF;
END $$;
