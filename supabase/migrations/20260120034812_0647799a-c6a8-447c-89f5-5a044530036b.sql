-- Create cron job to send trial expired notifications daily at 11:00 UTC
SELECT cron.schedule(
  'send-trial-expired-notification-daily',
  '0 11 * * *',
  $$
  SELECT net.http_post(
    url := 'https://savriwalgygixwtcpmya.supabase.co/functions/v1/send-trial-expired-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('supabase.service_role_key', true)
    ),
    body := '{}'::jsonb
  );
  $$
);