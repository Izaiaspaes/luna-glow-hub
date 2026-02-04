-- Create cron job to check commission eligibility daily at 11:00 UTC
SELECT cron.schedule(
  'check-commission-eligibility-daily',
  '0 11 * * *',
  $$
  SELECT net.http_post(
    url := (SELECT current_setting('app.settings.supabase_url') || '/functions/v1/check-commission-eligibility'),
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (SELECT current_setting('app.settings.service_role_key'))
    ),
    body := '{}'::jsonb
  );
  $$
);