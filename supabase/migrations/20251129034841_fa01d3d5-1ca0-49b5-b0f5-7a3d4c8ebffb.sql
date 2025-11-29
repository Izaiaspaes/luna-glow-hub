-- Create announcement_banners table
CREATE TABLE IF NOT EXISTS public.announcement_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  banner_type TEXT NOT NULL DEFAULT 'info',
  is_active BOOLEAN NOT NULL DEFAULT true,
  link_url TEXT,
  link_text TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.announcement_banners ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view active banners within date range
CREATE POLICY "Anyone can view active banners"
  ON public.announcement_banners
  FOR SELECT
  USING (
    is_active = true 
    AND start_date <= now()
    AND (end_date IS NULL OR end_date >= now())
  );

-- Policy: Admins can view all banners
CREATE POLICY "Admins can view all banners"
  ON public.announcement_banners
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- Policy: Admins can insert banners
CREATE POLICY "Admins can insert banners"
  ON public.announcement_banners
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Policy: Admins can update banners
CREATE POLICY "Admins can update banners"
  ON public.announcement_banners
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

-- Policy: Admins can delete banners
CREATE POLICY "Admins can delete banners"
  ON public.announcement_banners
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- Trigger to update updated_at
CREATE TRIGGER update_announcement_banners_updated_at
  BEFORE UPDATE ON public.announcement_banners
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();