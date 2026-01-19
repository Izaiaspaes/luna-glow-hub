-- Drop and recreate the get_users_with_profiles function with correct column name
DROP FUNCTION IF EXISTS public.get_users_with_profiles();

CREATE OR REPLACE FUNCTION public.get_users_with_profiles()
RETURNS TABLE(
  id uuid,
  email text,
  created_at text,
  full_name text,
  subscription_plan text,
  is_active boolean,
  last_accessed_at text,
  roles text[],
  nationality text,
  registration_source json,
  trial_started_at text,
  trial_ends_at text,
  trial_type text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.email::text,
    u.created_at::text,
    COALESCE(p.full_name, '')::text as full_name,
    COALESCE(p.subscription_plan, 'FREE')::text as subscription_plan,
    COALESCE(p.is_active, true) as is_active,
    p.last_accessed_at::text,
    COALESCE(
      ARRAY(
        SELECT ur.role::text 
        FROM user_roles ur 
        WHERE ur.user_id = u.id
      ),
      ARRAY[]::text[]
    ) as roles,
    COALESCE(o.current_country, '')::text as nationality,
    p.registration_source::json,
    p.trial_started_at::text,
    p.trial_ends_at::text,
    p.trial_type::text
  FROM auth.users u
  LEFT JOIN profiles p ON p.user_id = u.id
  LEFT JOIN user_onboarding_data o ON o.user_id = u.id
  ORDER BY u.created_at DESC;
END;
$$;