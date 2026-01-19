-- Adicionar campos de trial na tabela profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS trial_started_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS trial_type TEXT CHECK (trial_type IN ('automatic', 'manual'));

-- Criar índice para buscar trials ativos
CREATE INDEX IF NOT EXISTS idx_profiles_trial_ends_at ON public.profiles(trial_ends_at) WHERE trial_ends_at IS NOT NULL;

-- Criar função para verificar se o trial está ativo
CREATE OR REPLACE FUNCTION public.is_trial_active(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  trial_end TIMESTAMP WITH TIME ZONE;
BEGIN
  SELECT trial_ends_at INTO trial_end
  FROM public.profiles
  WHERE user_id = p_user_id;
  
  RETURN trial_end IS NOT NULL AND trial_end > NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar função para ativar trial para um usuário
CREATE OR REPLACE FUNCTION public.activate_trial(
  p_user_id UUID,
  p_days INTEGER DEFAULT 7,
  p_type TEXT DEFAULT 'manual'
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.profiles
  SET 
    trial_started_at = NOW(),
    trial_ends_at = NOW() + (p_days || ' days')::INTERVAL,
    trial_type = p_type
  WHERE user_id = p_user_id
    AND subscription_plan = 'free'
    AND (trial_ends_at IS NULL OR trial_ends_at < NOW()); -- Só ativa se não tiver trial ativo
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar tabela de log de trials para analytics
CREATE TABLE IF NOT EXISTS public.trial_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  trial_type TEXT NOT NULL CHECK (trial_type IN ('automatic', 'manual')),
  duration_days INTEGER NOT NULL DEFAULT 7,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
  converted_to_paid BOOLEAN DEFAULT FALSE,
  converted_at TIMESTAMP WITH TIME ZONE,
  activated_by UUID, -- admin que ativou (se manual)
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.trial_logs ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para trial_logs
CREATE POLICY "Admins can view all trial logs"
ON public.trial_logs
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

CREATE POLICY "Admins can insert trial logs"
ON public.trial_logs
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

CREATE POLICY "System can insert trial logs"
ON public.trial_logs
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can view own trial logs"
ON public.trial_logs
FOR SELECT
USING (auth.uid() = user_id);