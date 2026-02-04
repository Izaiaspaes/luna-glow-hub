import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface CommissionBalance {
  available_balance: number;
  pending_balance: number;
  total_earned: number;
  total_withdrawn: number;
}

interface CommissionTransaction {
  id: string;
  amount: number;
  currency: string;
  status: string;
  payment_amount: number;
  commission_rate: number;
  eligible_at: string | null;
  available_at: string | null;
  created_at: string;
}

interface WithdrawalRequest {
  id: string;
  amount: number;
  currency: string;
  status: string;
  pix_key: string | null;
  pix_key_type: string | null;
  account_holder_name: string | null;
  processed_at: string | null;
  paid_at: string | null;
  created_at: string;
}

export const useCommission = () => {
  const { user, session } = useAuth();
  const [balance, setBalance] = useState<CommissionBalance>({
    available_balance: 0,
    pending_balance: 0,
    total_earned: 0,
    total_withdrawn: 0,
  });
  const [transactions, setTransactions] = useState<CommissionTransaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!user || !session?.access_token) {
      setBalance({
        available_balance: 0,
        pending_balance: 0,
        total_earned: 0,
        total_withdrawn: 0,
      });
      setTransactions([]);
      setWithdrawals([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error: fnError } = await supabase.functions.invoke("process-commission", {
        body: { action: "get_balance" },
      });

      if (fnError) {
        if (fnError.message?.includes('401') || fnError.message?.includes('Invalid')) {
          setIsLoading(false);
          return;
        }
        throw fnError;
      }

      if (data?.success) {
        setBalance(data.balance);
        setTransactions(data.transactions || []);
        setWithdrawals(data.withdrawals || []);
      }
    } catch (err) {
      console.error("Error fetching commission balance:", err);
      setError("Failed to load commission balance");
    } finally {
      setIsLoading(false);
    }
  }, [user, session]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  const requestWithdrawal = async (
    amount: number,
    pixKey: string,
    pixKeyType: string,
    accountHolderName: string
  ) => {
    if (!user || !session?.access_token) {
      throw new Error("Not authenticated");
    }

    const { data, error: fnError } = await supabase.functions.invoke("process-commission", {
      body: {
        action: "request_withdrawal",
        amount,
        pix_key: pixKey,
        pix_key_type: pixKeyType,
        account_holder_name: accountHolderName,
      },
    });

    if (fnError) throw fnError;
    if (data?.error) throw new Error(data.error);

    // Refresh balance after withdrawal request
    await fetchBalance();
    return data;
  };

  const formatCurrency = (amount: number, currency: string = "BRL") => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  // Check if user has any commission activity
  const hasCommissions = 
    transactions.length > 0 || 
    withdrawals.length > 0 || 
    balance.total_earned > 0;

  return {
    balance,
    transactions,
    withdrawals,
    isLoading,
    error,
    hasCommissions,
    requestWithdrawal,
    formatCurrency,
    refresh: fetchBalance,
  };
};
