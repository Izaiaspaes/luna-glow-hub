-- Update the trigger to also send email notifications to admins
-- First, drop the existing trigger
DROP TRIGGER IF EXISTS on_auth_user_created_notify_admins ON auth.users;

-- Recreate the function to also call the edge function
CREATE OR REPLACE FUNCTION public.notify_admins_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_name TEXT;
BEGIN
  -- Insert notification in database
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

  -- Get user name from metadata if available
  user_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    split_part(NEW.email, '@', 1)
  );

  -- Call edge function to send email notifications (async, don't wait for response)
  PERFORM net.http_post(
    url := current_setting('app.settings.supabase_url') || '/functions/v1/notify-admin-new-user',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
    ),
    body := jsonb_build_object(
      'userId', NEW.id::text,
      'userEmail', NEW.email,
      'userName', user_name
    )
  );

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't fail the user creation
  RAISE WARNING 'Failed to send admin notification: %', SQLERRM;
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created_notify_admins
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_admins_new_user();