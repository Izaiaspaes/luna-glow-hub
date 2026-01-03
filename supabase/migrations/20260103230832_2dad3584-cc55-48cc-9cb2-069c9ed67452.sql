-- Remover a constraint antiga
ALTER TABLE public.push_subscriptions DROP CONSTRAINT IF EXISTS push_subscriptions_user_id_subscription_data_key;

-- Criar índice único apenas para user_id para permitir upsert
CREATE UNIQUE INDEX IF NOT EXISTS push_subscriptions_user_id_key ON public.push_subscriptions(user_id);