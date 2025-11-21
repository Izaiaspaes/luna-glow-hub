-- Recreate update_reminders_updated_at function with proper security and search_path
CREATE OR REPLACE FUNCTION public.update_reminders_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;