-- Add theme preference column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN theme TEXT DEFAULT 'default' CHECK (theme IN ('default', 'sunset', 'ocean', 'forest', 'lavender', 'rose'));