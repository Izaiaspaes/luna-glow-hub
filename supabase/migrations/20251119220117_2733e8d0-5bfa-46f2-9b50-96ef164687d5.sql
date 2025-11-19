-- Create admin notifications table
CREATE TABLE public.admin_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('new_user', 'system_alert', 'critical_metric', 'general')),
  severity TEXT NOT NULL DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'error', 'success')),
  read BOOLEAN NOT NULL DEFAULT false,
  related_user_id UUID,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- Only admins can view notifications
CREATE POLICY "Admins can view all notifications"
ON public.admin_notifications
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update notifications (mark as read)
CREATE POLICY "Admins can update notifications"
ON public.admin_notifications
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- System can insert notifications
CREATE POLICY "System can insert notifications"
ON public.admin_notifications
FOR INSERT
WITH CHECK (true);

-- Create index for better query performance
CREATE INDEX idx_admin_notifications_read ON public.admin_notifications(read);
CREATE INDEX idx_admin_notifications_created_at ON public.admin_notifications(created_at DESC);

-- Function to notify admins about new users
CREATE OR REPLACE FUNCTION public.notify_admins_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.admin_notifications (
    title,
    message,
    type,
    severity,
    related_user_id,
    metadata
  )
  VALUES (
    'Novo Usuário Cadastrado',
    'Um novo usuário se cadastrou na plataforma: ' || NEW.email,
    'new_user',
    'info',
    NEW.id,
    jsonb_build_object('email', NEW.email, 'created_at', NEW.created_at)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for new user registrations
CREATE TRIGGER on_new_user_notify_admins
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.notify_admins_new_user();

-- Enable realtime for admin notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_notifications;