-- Drop and recreate get_users_with_profiles function to include subscription_plan
DROP FUNCTION IF EXISTS public.get_users_with_profiles();

CREATE FUNCTION public.get_users_with_profiles()
 RETURNS TABLE(user_id uuid, email text, full_name text, phone text, subscription_plan text, created_at timestamp with time zone, roles jsonb)
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
    ) as roles
  FROM auth.users au
  LEFT JOIN public.profiles p ON p.user_id = au.id
  LEFT JOIN public.user_roles ur ON ur.user_id = au.id
  GROUP BY au.id, au.email, p.full_name, p.phone, p.subscription_plan, au.created_at
  ORDER BY au.created_at DESC;
$function$;