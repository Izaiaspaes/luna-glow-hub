-- Add privacy_mode and encryption settings to profiles
ALTER TABLE public.profiles 
ADD COLUMN privacy_mode boolean DEFAULT false,
ADD COLUMN encryption_enabled boolean DEFAULT false;