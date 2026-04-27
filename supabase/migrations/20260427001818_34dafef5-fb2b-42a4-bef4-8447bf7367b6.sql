
-- service_role bypasses RLS automatically, so these policies are redundant and trip the linter.
DROP POLICY IF EXISTS "Service role can manage transactions" ON public.commission_transactions;
DROP POLICY IF EXISTS "Service role can manage balances" ON public.user_commission_balance;
DROP POLICY IF EXISTS "Service role can manage referrals" ON public.referrals;

-- For public buckets (avatars, banners), avoid the linter warning about listing
-- by ensuring there are no broad SELECT policies on storage.objects that allow listing.
-- Public URLs to specific objects continue to work without any storage.objects SELECT policy.
DROP POLICY IF EXISTS "Users can view all avatars" ON storage.objects;
DROP POLICY IF EXISTS "Public can view banner images" ON storage.objects;
