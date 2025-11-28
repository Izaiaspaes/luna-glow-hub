-- Add notification preferences to profiles table
ALTER TABLE public.profiles
ADD COLUMN notification_preferences jsonb DEFAULT jsonb_build_object(
  'reminders', true,
  'cycle_phase_changes', true,
  'partner_updates', true,
  'wellness_plans', true,
  'predictions', true
);