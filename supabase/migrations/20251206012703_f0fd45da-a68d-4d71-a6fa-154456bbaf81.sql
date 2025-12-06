-- Drop the overly permissive "Anyone can lookup referral codes" policy
DROP POLICY IF EXISTS "Anyone can lookup referral codes" ON public.user_referral_codes;

-- Create a security definer function to validate referral codes without exposing user_id
CREATE OR REPLACE FUNCTION public.validate_referral_code(code TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_referral_codes WHERE referral_code = code
  );
$$;

-- Create a restrictive policy that only allows lookup by exact referral_code match
-- This prevents enumeration of all codes while still allowing validation
CREATE POLICY "Validate referral code by exact match" 
ON public.user_referral_codes 
FOR SELECT 
USING (
  -- Allow if user owns the code OR if querying by exact referral_code match
  auth.uid() = user_id OR 
  referral_code = current_setting('request.headers', true)::json->>'x-referral-code'
);