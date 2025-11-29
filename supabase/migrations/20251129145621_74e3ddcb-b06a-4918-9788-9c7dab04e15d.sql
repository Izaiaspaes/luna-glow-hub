
-- Add UNIQUE constraint to user_id column in user_onboarding_data table
-- This is required for the upsert operation with onConflict: 'user_id' to work

ALTER TABLE public.user_onboarding_data
ADD CONSTRAINT user_onboarding_data_user_id_unique UNIQUE (user_id);
