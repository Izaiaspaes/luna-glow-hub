-- =====================================================
-- SISTEMA DE COMISSÕES POR INDICAÇÃO (50%)
-- =====================================================

-- Tabela para armazenar saldo de comissões acumuladas
CREATE TABLE public.user_commission_balance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  available_balance DECIMAL(10,2) NOT NULL DEFAULT 0,
  pending_balance DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_earned DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_withdrawn DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para registrar cada comissão individual
CREATE TABLE public.commission_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  referral_id UUID REFERENCES public.referrals(id),
  referred_user_id UUID,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'BRL',
  status TEXT NOT NULL DEFAULT 'pending', -- pending, available, paid, cancelled
  payment_amount DECIMAL(10,2) NOT NULL, -- valor total do pagamento da indicada
  commission_rate DECIMAL(5,4) NOT NULL DEFAULT 0.50, -- 50%
  eligible_at TIMESTAMP WITH TIME ZONE, -- quando fica disponível (30 dias após pagamento)
  available_at TIMESTAMP WITH TIME ZONE, -- quando foi liberado
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para solicitações de saque
CREATE TABLE public.withdrawal_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'BRL',
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, paid, rejected
  pix_key TEXT,
  pix_key_type TEXT, -- cpf, email, phone, random
  bank_name TEXT,
  account_holder_name TEXT,
  admin_notes TEXT,
  processed_by UUID,
  processed_at TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_commission_balance_user ON public.user_commission_balance(user_id);
CREATE INDEX idx_commission_transactions_user ON public.commission_transactions(user_id);
CREATE INDEX idx_commission_transactions_status ON public.commission_transactions(status);
CREATE INDEX idx_commission_transactions_eligible ON public.commission_transactions(eligible_at) WHERE status = 'pending';
CREATE INDEX idx_withdrawal_requests_user ON public.withdrawal_requests(user_id);
CREATE INDEX idx_withdrawal_requests_status ON public.withdrawal_requests(status);

-- Enable RLS
ALTER TABLE public.user_commission_balance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies para user_commission_balance
CREATE POLICY "Users can view their own balance"
  ON public.user_commission_balance
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all balances"
  ON public.user_commission_balance
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can manage balances"
  ON public.user_commission_balance
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- RLS Policies para commission_transactions
CREATE POLICY "Users can view their own transactions"
  ON public.commission_transactions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all transactions"
  ON public.commission_transactions
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can manage transactions"
  ON public.commission_transactions
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- RLS Policies para withdrawal_requests
CREATE POLICY "Users can view their own withdrawals"
  ON public.withdrawal_requests
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create withdrawal requests"
  ON public.withdrawal_requests
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all withdrawals"
  ON public.withdrawal_requests
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update withdrawals"
  ON public.withdrawal_requests
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger para atualizar updated_at
CREATE TRIGGER update_commission_balance_updated_at
  BEFORE UPDATE ON public.user_commission_balance
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_commission_transactions_updated_at
  BEFORE UPDATE ON public.commission_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_withdrawal_requests_updated_at
  BEFORE UPDATE ON public.withdrawal_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();