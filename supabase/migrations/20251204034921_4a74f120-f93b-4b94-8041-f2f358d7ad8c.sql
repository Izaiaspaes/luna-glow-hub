-- Move pg_net extension from public to extensions schema
-- First, drop the extension and recreate it in the correct schema
DROP EXTENSION IF EXISTS pg_net;

-- Ensure extensions schema exists
CREATE SCHEMA IF NOT EXISTS extensions;

-- Recreate pg_net in the extensions schema
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;