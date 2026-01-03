-- Drop and recreate the function to include country from user_onboarding_data
DROP FUNCTION IF EXISTS get_users_with_profiles();

CREATE OR REPLACE FUNCTION get_users_with_profiles()
RETURNS TABLE (
  user_id uuid,
  email text,
  full_name text,
  phone text,
  subscription_plan text,
  created_at timestamptz,
  roles jsonb,
  is_active boolean,
  registration_source jsonb,
  last_accessed_at timestamptz,
  country text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    au.id as user_id,
    au.email::text,
    p.full_name,
    p.phone,
    COALESCE(p.subscription_plan, 'free') as subscription_plan,
    au.created_at,
    COALESCE(
      jsonb_agg(
        jsonb_build_object('role', ur.role)
      ) FILTER (WHERE ur.role IS NOT NULL),
      '[]'::jsonb
    ) as roles,
    COALESCE(p.is_active, true) as is_active,
    p.registration_source,
    p.last_accessed_at,
    uod.current_country as country
  FROM auth.users au
  LEFT JOIN public.profiles p ON p.user_id = au.id
  LEFT JOIN public.user_roles ur ON ur.user_id = au.id
  LEFT JOIN public.user_onboarding_data uod ON uod.user_id = au.id
  GROUP BY au.id, au.email, p.full_name, p.phone, p.subscription_plan, au.created_at, p.is_active, p.registration_source, p.last_accessed_at, uod.current_country
  ORDER BY au.created_at DESC;
END;
$$;