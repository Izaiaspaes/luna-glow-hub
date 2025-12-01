-- Create table for price management
CREATE TABLE IF NOT EXISTS public.price_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('premium', 'premium_plus')),
  currency TEXT NOT NULL CHECK (currency IN ('brl', 'usd')),
  billing_period TEXT NOT NULL CHECK (billing_period IN ('monthly', 'yearly')),
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  stripe_price_id TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_promotion BOOLEAN NOT NULL DEFAULT false,
  promotion_start_date TIMESTAMP WITH TIME ZONE,
  promotion_end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(plan_type, currency, billing_period, is_active)
);

-- Enable RLS
ALTER TABLE public.price_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active prices
CREATE POLICY "Anyone can view active prices"
  ON public.price_settings
  FOR SELECT
  USING (is_active = true);

-- Only admins can manage prices
CREATE POLICY "Admins can manage all prices"
  ON public.price_settings
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Trigger to update updated_at
CREATE TRIGGER update_price_settings_updated_at
  BEFORE UPDATE ON public.price_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default prices
INSERT INTO public.price_settings (plan_type, currency, billing_period, price, stripe_price_id) VALUES
  ('premium', 'brl', 'monthly', 19.90, 'price_1SX6CVIEVFZTiFWxkPKHuWRw'),
  ('premium', 'brl', 'yearly', 199.00, 'price_1SX6CjIEVFZTiFWxlX10yitN'),
  ('premium', 'usd', 'monthly', 9.90, 'price_1SXPuTIEVFZTiFWxVohXH8xe'),
  ('premium', 'usd', 'yearly', 99.00, 'price_1SXPucIEVFZTiFWxAaZO1YyI'),
  ('premium_plus', 'brl', 'monthly', 29.90, 'price_1SYebkIEVFZTiFWxFUKducJE'),
  ('premium_plus', 'brl', 'yearly', 299.00, 'price_1SYghcIEVFZTiFWxxqiCmWth'),
  ('premium_plus', 'usd', 'monthly', 19.90, 'price_1SYeblIEVFZTiFWxuoxqWS4o'),
  ('premium_plus', 'usd', 'yearly', 199.00, 'price_1SYghdIEVFZTiFWx6jTEbMet');