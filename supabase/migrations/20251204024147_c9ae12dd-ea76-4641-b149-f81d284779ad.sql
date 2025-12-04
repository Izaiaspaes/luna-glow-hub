-- Create referrals table to track the referral program
CREATE TABLE public.referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_user_id UUID NOT NULL,
  referred_user_id UUID,
  referral_code TEXT NOT NULL,
  referred_email TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  referred_subscribed_at TIMESTAMP WITH TIME ZONE,
  reward_eligible_at TIMESTAMP WITH TIME ZONE,
  reward_applied BOOLEAN NOT NULL DEFAULT false,
  reward_applied_at TIMESTAMP WITH TIME ZONE,
  stripe_coupon_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'signed_up', 'subscribed', 'eligible', 'rewarded', 'expired'))
);

-- Create user_referral_codes table for unique codes per user
CREATE TABLE public.user_referral_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  referral_code TEXT NOT NULL UNIQUE,
  total_referrals INTEGER NOT NULL DEFAULT 0,
  successful_referrals INTEGER NOT NULL DEFAULT 0,
  rewards_earned INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_referral_codes ENABLE ROW LEVEL SECURITY;

-- RLS policies for referrals
CREATE POLICY "Users can view their own referrals"
  ON public.referrals
  FOR SELECT
  USING (auth.uid() = referrer_user_id);

CREATE POLICY "Users can view referrals where they are referred"
  ON public.referrals
  FOR SELECT
  USING (auth.uid() = referred_user_id);

CREATE POLICY "System can insert referrals"
  ON public.referrals
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "System can update referrals"
  ON public.referrals
  FOR UPDATE
  USING (true);

CREATE POLICY "Admins can view all referrals"
  ON public.referrals
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update all referrals"
  ON public.referrals
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for user_referral_codes
CREATE POLICY "Users can view their own referral code"
  ON public.user_referral_codes
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own referral code"
  ON public.user_referral_codes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own referral code"
  ON public.user_referral_codes
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can lookup referral codes"
  ON public.user_referral_codes
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can view all referral codes"
  ON public.user_referral_codes
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate 8-character alphanumeric code
    new_code := upper(substring(md5(random()::text || clock_timestamp()::text) for 8));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM user_referral_codes WHERE referral_code = new_code) INTO code_exists;
    
    EXIT WHEN NOT code_exists;
  END LOOP;
  
  RETURN new_code;
END;
$$;

-- Trigger to update updated_at
CREATE TRIGGER update_referrals_updated_at
  BEFORE UPDATE ON public.referrals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_referral_codes_updated_at
  BEFORE UPDATE ON public.user_referral_codes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();