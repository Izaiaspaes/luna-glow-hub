-- Add registration_source column to profiles table for tracking user origin
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS registration_source jsonb DEFAULT NULL;

COMMENT ON COLUMN public.profiles.registration_source IS 'Stores UTM parameters and referral info from user registration';