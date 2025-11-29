-- Simplify the trigger to only insert notifications in database
-- The email sending will be handled by the client after successful signup
DROP TRIGGER IF EXISTS on_auth_user_created_notify_admins ON auth.users;

CREATE OR REPLACE FUNCTION public.notify_admins_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert notification in database only
  INSERT INTO public.admin_notifications (
    title,
    message,
    type,
    severity,
    related_user_id,
    metadata
  )
  VALUES (
    'Novo Usuário Cadastrado',
    'Um novo usuário se cadastrou na plataforma: ' || NEW.email,
    'new_user',
    'info',
    NEW.id,
    jsonb_build_object('email', NEW.email, 'created_at', NEW.created_at)
  );

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_notify_admins
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_admins_new_user();