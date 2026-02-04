-- Create commission settings table
CREATE TABLE public.commission_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commission_rate DECIMAL(5,2) NOT NULL DEFAULT 50.00,
  eligibility_days INTEGER NOT NULL DEFAULT 30,
  is_active BOOLEAN NOT NULL DEFAULT true,
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default settings
INSERT INTO public.commission_settings (commission_rate, eligibility_days, is_active)
VALUES (50.00, 30, true);

-- Enable RLS
ALTER TABLE public.commission_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read settings
CREATE POLICY "Anyone can read commission settings"
ON public.commission_settings
FOR SELECT
USING (true);

-- Policy: Only admins can update settings
CREATE POLICY "Admins can update commission settings"
ON public.commission_settings
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Policy: Only admins can insert settings
CREATE POLICY "Admins can insert commission settings"
ON public.commission_settings
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_commission_settings_updated_at
BEFORE UPDATE ON public.commission_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();