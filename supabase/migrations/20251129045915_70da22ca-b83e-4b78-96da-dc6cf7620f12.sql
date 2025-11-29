-- Drop the existing check constraint
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_subscription_plan_check;

-- Add new check constraint that includes premium_plus
ALTER TABLE public.profiles ADD CONSTRAINT profiles_subscription_plan_check 
  CHECK (subscription_plan IN ('free', 'premium', 'premium_plus'));