-- Primeiro dropar a função existente para poder alterar o tipo de retorno
DROP FUNCTION IF EXISTS public.get_users_with_profiles();

-- Recriar a função com os campos de trial
CREATE FUNCTION public.get_users_with_profiles()
RETURNS TABLE (
  id UUID,
  email TEXT,
  full_name TEXT,
  subscription_plan TEXT,
  is_active BOOLEAN,
  created_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ,
  trial_started_at TIMESTAMPTZ,
  trial_ends_at TIMESTAMPTZ,
  trial_type TEXT,
  nationality TEXT,
  registration_source JSONB,
  roles TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.email::TEXT,
    COALESCE(o.preferred_name, p.full_name, '')::TEXT as full_name,
    COALESCE(p.subscription_plan, 'free')::TEXT as subscription_plan,
    COALESCE(p.is_active, true) as is_active,
    u.created_at,
    p.last_accessed_at,
    p.trial_started_at,
    p.trial_ends_at,
    p.trial_type::TEXT,
    o.nationality::TEXT,
    p.registration_source,
    ARRAY(
      SELECT ur.role::TEXT 
      FROM public.user_roles ur 
      WHERE ur.user_id = u.id
    ) as roles
  FROM auth.users u
  LEFT JOIN public.profiles p ON p.user_id = u.id
  LEFT JOIN public.user_onboarding_data o ON o.user_id = u.id
  ORDER BY u.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;