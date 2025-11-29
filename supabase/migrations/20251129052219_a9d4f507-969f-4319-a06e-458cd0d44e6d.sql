-- Fix search_path for validate_coupon_dates function
CREATE OR REPLACE FUNCTION validate_coupon_dates()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.valid_until <= NEW.valid_from THEN
    RAISE EXCEPTION 'valid_until must be after valid_from';
  END IF;
  RETURN NEW;
END;
$$;