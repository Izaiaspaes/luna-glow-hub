-- Create invites table for admin pre-approval system
CREATE TABLE public.invites (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code text NOT NULL UNIQUE,
  email text,
  created_by uuid NOT NULL,
  used_by uuid,
  used_at timestamp with time zone,
  expires_at timestamp with time zone NOT NULL,
  max_uses integer NOT NULL DEFAULT 1,
  current_uses integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  is_active boolean NOT NULL DEFAULT true
);

-- Enable RLS
ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;

-- Admins can view all invites
CREATE POLICY "Admins can view all invites"
ON public.invites
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can create invites
CREATE POLICY "Admins can create invites"
ON public.invites
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update invites
CREATE POLICY "Admins can update invites"
ON public.invites
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete invites
CREATE POLICY "Admins can delete invites"
ON public.invites
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can validate invites (needed for signup)
CREATE POLICY "Anyone can validate invites"
ON public.invites
FOR SELECT
USING (is_active = true AND expires_at > now());

-- Create index for faster lookups
CREATE INDEX idx_invites_code ON public.invites(code);
CREATE INDEX idx_invites_email ON public.invites(email);