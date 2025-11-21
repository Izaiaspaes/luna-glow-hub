-- Create partner_relationships table
CREATE TABLE public.partner_relationships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  partner_email TEXT NOT NULL,
  partner_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  invite_token TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'revoked')),
  invited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  sharing_settings JSONB NOT NULL DEFAULT '{"cycle": true, "symptoms": true, "mood": true, "energy": true}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(owner_user_id, partner_email)
);

-- Enable RLS
ALTER TABLE public.partner_relationships ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own relationships (as owner or partner)
CREATE POLICY "Users can view their relationships"
ON public.partner_relationships
FOR SELECT
USING (
  auth.uid() = owner_user_id OR 
  auth.uid() = partner_user_id
);

-- Policy: Users can create their own relationships
CREATE POLICY "Users can create relationships"
ON public.partner_relationships
FOR INSERT
WITH CHECK (auth.uid() = owner_user_id);

-- Policy: Users can update their own relationships
CREATE POLICY "Users can update their relationships"
ON public.partner_relationships
FOR UPDATE
USING (auth.uid() = owner_user_id OR auth.uid() = partner_user_id);

-- Policy: Users can delete their own relationships
CREATE POLICY "Users can delete their relationships"
ON public.partner_relationships
FOR DELETE
USING (auth.uid() = owner_user_id);

-- Create partner_notifications table for educational tips
CREATE TABLE public.partner_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  relationship_id UUID NOT NULL REFERENCES public.partner_relationships(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('phase_change', 'tip', 'support_reminder')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  phase TEXT,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.partner_notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Partners can view their notifications
CREATE POLICY "Partners can view their notifications"
ON public.partner_notifications
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.partner_relationships pr
    WHERE pr.id = partner_notifications.relationship_id
    AND pr.partner_user_id = auth.uid()
    AND pr.status = 'accepted'
  )
);

-- Policy: Partners can update their notifications (mark as read)
CREATE POLICY "Partners can update their notifications"
ON public.partner_notifications
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.partner_relationships pr
    WHERE pr.id = partner_notifications.relationship_id
    AND pr.partner_user_id = auth.uid()
    AND pr.status = 'accepted'
  )
);

-- Create indexes
CREATE INDEX idx_partner_relationships_owner ON public.partner_relationships(owner_user_id);
CREATE INDEX idx_partner_relationships_partner ON public.partner_relationships(partner_user_id);
CREATE INDEX idx_partner_relationships_token ON public.partner_relationships(invite_token);
CREATE INDEX idx_partner_notifications_relationship ON public.partner_notifications(relationship_id);

-- Create trigger for updated_at
CREATE TRIGGER update_partner_relationships_updated_at
BEFORE UPDATE ON public.partner_relationships
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Realtime for partner relationships
ALTER PUBLICATION supabase_realtime ADD TABLE public.partner_relationships;
ALTER PUBLICATION supabase_realtime ADD TABLE public.partner_notifications;