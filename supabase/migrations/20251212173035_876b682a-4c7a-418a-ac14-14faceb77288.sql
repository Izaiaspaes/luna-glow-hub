CREATE FUNCTION public.get_users_with_profiles()
RETURNS TABLE(
  user_id uuid, 
  email text, 
  full_name text, 
  phone text, 
  subscription_plan text, 
  created_at timestamp with time zone, 
  roles jsonb,
  is_active boolean
)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    au.id as user_id,
    au.email,
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
    COALESCE(p.is_active, true) as is_active
  FROM auth.users au
  LEFT JOIN public.profiles p ON p.user_id = au.id
  LEFT JOIN public.user_roles ur ON ur.user_id = au.id
  GROUP BY au.id, au.email, p.full_name, p.phone, p.subscription_plan, au.created_at, p.is_active
  ORDER BY au.created_at DESC;
$$;