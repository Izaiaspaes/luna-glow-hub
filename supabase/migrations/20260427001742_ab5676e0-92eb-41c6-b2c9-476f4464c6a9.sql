
-- =========================================================
-- 1. CRITICAL: commission_transactions - remove USING(true)
-- =========================================================
DROP POLICY IF EXISTS "System can manage transactions" ON public.commission_transactions;

-- Only service_role (edge functions) can insert/update/delete
CREATE POLICY "Service role can manage transactions"
ON public.commission_transactions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- =========================================================
-- 2. CRITICAL: user_commission_balance - remove USING(true)
-- =========================================================
DROP POLICY IF EXISTS "System can manage balances" ON public.user_commission_balance;

CREATE POLICY "Service role can manage balances"
ON public.user_commission_balance
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- =========================================================
-- 3. CRITICAL: referrals - remove USING(true) update + insert
-- =========================================================
DROP POLICY IF EXISTS "System can update referrals" ON public.referrals;
DROP POLICY IF EXISTS "System can insert referrals" ON public.referrals;

CREATE POLICY "Service role can manage referrals"
ON public.referrals
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Allow authenticated users to insert referrals where they are the referrer
CREATE POLICY "Users can insert their own referrals"
ON public.referrals
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = referrer_user_id);

-- =========================================================
-- 4. CRITICAL: invites - hide email from public
-- =========================================================
DROP POLICY IF EXISTS "Anyone can validate invites" ON public.invites;

-- Secure function to validate invite codes without exposing emails
CREATE OR REPLACE FUNCTION public.validate_invite_code(p_code text)
RETURNS TABLE(is_valid boolean, expires_at timestamp with time zone, max_uses integer, current_uses integer)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    (i.is_active AND i.expires_at > now() AND i.current_uses < i.max_uses) AS is_valid,
    i.expires_at,
    i.max_uses,
    i.current_uses
  FROM public.invites i
  WHERE i.code = p_code
  LIMIT 1;
END;
$$;

GRANT EXECUTE ON FUNCTION public.validate_invite_code(text) TO anon, authenticated;

-- =========================================================
-- 5. CRITICAL: closet-items storage - remove public read
-- =========================================================
DROP POLICY IF EXISTS "Public Access for AI Analysis" ON storage.objects;

-- Make bucket private
UPDATE storage.buckets SET public = false WHERE id = 'closet-items';

-- =========================================================
-- 6. WARN: user_referral_codes - remove header-based enumeration
-- =========================================================
DROP POLICY IF EXISTS "Validate referral code by exact match" ON public.user_referral_codes;
-- validate_referral_code() function already exists for safe validation (returns boolean only)

-- =========================================================
-- 7. WARN: Fix function search_path
-- =========================================================
CREATE OR REPLACE FUNCTION public.activate_trial(p_user_id uuid, p_days integer DEFAULT 7, p_type text DEFAULT 'manual'::text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  UPDATE public.profiles
  SET 
    trial_started_at = NOW(),
    trial_ends_at = NOW() + (p_days || ' days')::INTERVAL,
    trial_type = p_type
  WHERE user_id = p_user_id
    AND subscription_plan = 'free'
    AND (trial_ends_at IS NULL OR trial_ends_at < NOW());
  
  RETURN FOUND;
END;
$function$;

CREATE OR REPLACE FUNCTION public.is_trial_active(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  trial_end TIMESTAMP WITH TIME ZONE;
BEGIN
  SELECT trial_ends_at INTO trial_end
  FROM public.profiles
  WHERE user_id = p_user_id;
  
  RETURN trial_end IS NOT NULL AND trial_end > NOW();
END;
$function$;
