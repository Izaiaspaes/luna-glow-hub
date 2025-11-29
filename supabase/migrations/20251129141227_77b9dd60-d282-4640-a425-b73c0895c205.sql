-- Add preferred_name field to user_onboarding_data table
ALTER TABLE user_onboarding_data 
ADD COLUMN preferred_name TEXT;

COMMENT ON COLUMN user_onboarding_data.preferred_name IS 'Nome preferido da usuária para ser chamada no app';