-- Add last_accessed_at column to profiles for tracking user activity
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create index for efficient querying of inactive users
CREATE INDEX IF NOT EXISTS idx_profiles_last_accessed_at ON public.profiles(last_accessed_at);

-- Update existing profiles to have current timestamp
UPDATE public.profiles SET last_accessed_at = now() WHERE last_accessed_at IS NULL;