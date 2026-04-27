
-- These are inserted only by edge functions / triggers running as service_role,
-- which bypasses RLS. The open policies are unnecessary.
DROP POLICY IF EXISTS "System can insert notifications" ON public.admin_notifications;
DROP POLICY IF EXISTS "System can insert email logs" ON public.email_logs;
DROP POLICY IF EXISTS "System can insert trial logs" ON public.trial_logs;

-- Newsletter signup: keep public insert but add anti-abuse validation via trigger
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Public can subscribe to newsletter"
ON public.newsletter_subscribers
FOR INSERT
TO anon, authenticated
WITH CHECK (
  email IS NOT NULL
  AND length(email) BETWEEN 5 AND 255
  AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
);

-- Suggestions form: keep public insert but with validation
DROP POLICY IF EXISTS "Anyone can submit suggestions" ON public.user_suggestions;
CREATE POLICY "Public can submit suggestions"
ON public.user_suggestions
FOR INSERT
TO anon, authenticated
WITH CHECK (
  email IS NOT NULL
  AND length(email) BETWEEN 5 AND 255
  AND suggestion IS NOT NULL
  AND length(suggestion) BETWEEN 10 AND 2000
);
