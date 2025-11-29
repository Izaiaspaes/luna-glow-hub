-- Fix RLS policy for user_onboarding_data updates
-- The current UPDATE policy is missing the with_check clause

DROP POLICY IF EXISTS "Users can update their own onboarding data" ON user_onboarding_data;

CREATE POLICY "Users can update their own onboarding data"
ON user_onboarding_data
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);