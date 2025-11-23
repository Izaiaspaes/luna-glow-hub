-- Remove the existing check constraint
ALTER TABLE energy_tracking DROP CONSTRAINT IF EXISTS energy_tracking_time_of_day_check;

-- Add a new check constraint that accepts Portuguese values
ALTER TABLE energy_tracking ADD CONSTRAINT energy_tracking_time_of_day_check 
CHECK (time_of_day IS NULL OR time_of_day IN ('manha', 'tarde', 'noite'));