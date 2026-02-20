
-- Remove the overly permissive policy that exposes all pending invites (and emails)
DROP POLICY IF EXISTS "Anyone can view pending invites by token" ON public.partner_relationships;

-- Create a security definer function to look up invite by token safely
-- This prevents direct table access while still allowing token-based lookup
CREATE OR REPLACE FUNCTION public.get_partner_invite_by_token(p_token text)
RETURNS TABLE (
  id uuid,
  owner_user_id uuid,
  partner_email text,
  status text,
  sharing_settings jsonb,
  invited_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pr.id,
    pr.owner_user_id,
    pr.partner_email,
    pr.status,
    pr.sharing_settings,
    pr.invited_at
  FROM public.partner_relationships pr
  WHERE pr.invite_token = p_token
    AND pr.status = 'pending';
END;
$$;

-- Grant execute to anonymous and authenticated users (needed for invite acceptance flow)
GRANT EXECUTE ON FUNCTION public.get_partner_invite_by_token(text) TO anon, authenticated;
