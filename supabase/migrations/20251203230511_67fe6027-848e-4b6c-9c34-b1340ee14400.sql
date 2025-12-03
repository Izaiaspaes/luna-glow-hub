-- Add column to force banner display (bypass user dismissals)
ALTER TABLE public.announcement_banners 
ADD COLUMN IF NOT EXISTS force_display_at timestamp with time zone DEFAULT NULL;