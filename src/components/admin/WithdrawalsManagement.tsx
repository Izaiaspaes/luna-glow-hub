import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  Wallet, 
  Clock, 
  CheckCircle, 
  XCircle,
  DollarSign,
  TrendingUp,
  RefreshCw
} from "lucide-react";

interface WithdrawalRequest {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: string;
  pix_key: string | null;
  pix_key_type: string | null;
  account_holder_name: string | null;
  admin_notes: string | null;
  processed_at: string | null;
  paid_at: string | null;
  created_at: string;
}

interface CommissionStats {
  total_pending: number;
  total_available: number;
  total_paid: number;
  pending_withdrawals_count: number;
  pending_withdrawals_amount: number;
}

export const WithdrawalsManagement = () => {
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [stats, setStats] = useState<CommissionStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<WithdrawalRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch withdrawals
      const { data: withdrawalsData, error: withdrawalsError } = await supabase
        .from("withdrawal_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (withdrawalsError) throw withdrawalsError;
      setWithdrawals(withdrawalsData || []);

      // Calculate stats
      const { data: commissionsData } = await supabase
        .from("commission_transactions")
        .select("amount, status");

      const pending = commissionsData?.filter(c => c.status === "pending").reduce((sum, c) => sum + Number(c.amount), 0) || 0;
      const available = commissionsData?.filter(c => c.status === "available").reduce((sum, c) => sum + Number(c.amount), 0) || 0;
      const paid = commissionsData?.filter(c => c.status === "paid").reduce((sum, c) => sum + Number(c.amount), 0) || 0;

      const pendingWithdrawals = withdrawalsData?.filter(w => w.status === "pending") || [];

      setStats({
        total_pending: pending,
        total_available: available,
        total_paid: paid,
        pending_withdrawals_count: pendingWithdrawals.length,
        pending_withdrawals_amount: pendingWithdrawals.reduce((sum, w) => sum + Number(w.amount), 0),
      });
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("Erro ao carregar dados");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async () => {
    if (!selectedWithdrawal) return;
    
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from("withdrawal_requests")
        .update({
          status: "approved",
          admin_notes: adminNotes,
          processed_at: new Date().toISOString(),
        })
        .eq("id", selectedWithdrawal.id);

      if (error) throw error;

      toast.success("Saque aprovado! Agora realize o pagamento via PIX.");
      setSelectedWithdrawal(null);
      setAdminNotes("");
      fetchData();
    } catch (err) {
      toast.error("Erro ao aprovar saque");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMarkAsPaid = async (withdrawal: WithdrawalRequest) => {
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from("withdrawal_requests")
        .update({
          status: "paid",
          paid_at: new Date().toISOString(),
        })
        .eq("id", withdrawal.id);

      if (error) throw error;

      // Update user balance
      const { data: balance } = await supabase
        .from("user_commission_balance")
        .select("*")
        .eq("user_id", withdrawal.user_id)
        .single();

      if (balance) {
        await supabase
          .from("user_commission_balance")
          .update({
            total_withdrawn: Number(balance.total_withdrawn) + Number(withdrawal.amount),
          })
          .eq("user_id", withdrawal.user_id);
      }

      toast.success("Saque marcado como pago!");
      fetchData();
    } catch (err) {
      toast.error("Erro ao marcar como pago");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedWithdrawal) return;
    
    if (!adminNotes.trim()) {
      toast.error("Informe o motivo da rejeição");
      return;
    }

    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from("withdrawal_requests")
        .update({
          status: "rejected",
          admin_notes: adminNotes,
          processed_at: new Date().toISOString(),
        })
        .eq("id", selectedWithdrawal.id);

      if (error) throw error;

      // Return balance to user
      const { data: balance } = await supabase
        .from("user_commission_balance")
        .select("*")
        .eq("user_id", selectedWithdrawal.user_id)
        .single();

      if (balance) {
        await supabase
          .from("user_commission_balance")
          .update({
            available_balance: Number(balance.available_balance) + Number(selectedWithdrawal.amount),
          })
          .eq("user_id", selectedWithdrawal.user_id);
      }

      toast.success("Saque rejeitado e saldo devolvido.");
      setSelectedWithdrawal(null);
      setAdminNotes("");
      fetchData();
    } catch (err) {
      toast.error("Erro ao rejeitar saque");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pendente</Badge>;
      case "approved":
        return <Badge variant="outline" className="border-green-500 text-green-600"><CheckCircle className="w-3 h-3 mr-1" />Aprovado</Badge>;
      case "paid":
        return <Badge className="bg-green-500"><DollarSign className="w-3 h-3 mr-1" />Pago</Badge>;
      case "rejected":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejeitado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPixKeyTypeLabel = (type: string | null) => {
    switch (type) {
      case "cpf": return "CPF";
      case "email": return "E-mail";
      case "phone": return "Telefone";
      case "random": return "Aleatória";
      default: return type || "-";
    }
  };

  const pendingWithdrawals = withdrawals.filter(w => w.status === "pending");
  const approvedWithdrawals = withdrawals.filter(w => w.status === "approved");
  const completedWithdrawals = withdrawals.filter(w => w.status === "paid" || w.status === "rejected");

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4 text-center">
              <Clock className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
              <p className="text-2xl font-bold">{formatCurrency(stats.total_pending)}</p>
              <p className="text-xs text-muted-foreground">Comissões Pendentes (30 dias)</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <Wallet className="w-6 h-6 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold">{formatCurrency(stats.total_available)}</p>
              <p className="text-xs text-muted-foreground">Disponível para saque</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <DollarSign className="w-6 h-6 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold">{formatCurrency(stats.total_paid)}</p>
              <p className="text-xs text-muted-foreground">Total pago</p>
            </CardContent>
          </Card>
          <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
            <CardContent className="pt-4 text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-orange-500" />
              <p className="text-2xl font-bold text-orange-600">{stats.pending_withdrawals_count}</p>
              <p className="text-xs text-muted-foreground">
                Saques pendentes ({formatCurrency(stats.pending_withdrawals_amount)})
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Withdrawals Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Solicitações de Saque
          </CardTitle>
          <Button variant="outline" size="sm" onClick={fetchData} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending">
                Pendentes ({pendingWithdrawals.length})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Aguardando Pgto ({approvedWithdrawals.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Finalizados ({completedWithdrawals.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              <WithdrawalsTable 
                withdrawals={pendingWithdrawals}
                formatCurrency={formatCurrency}
                getStatusBadge={getStatusBadge}
                getPixKeyTypeLabel={getPixKeyTypeLabel}
                onSelect={(w) => { setSelectedWithdrawal(w); setAdminNotes(""); }}
              />
            </TabsContent>

            <TabsContent value="approved">
              <WithdrawalsTable 
                withdrawals={approvedWithdrawals}
                formatCurrency={formatCurrency}
                getStatusBadge={getStatusBadge}
                getPixKeyTypeLabel={getPixKeyTypeLabel}
                showPayButton
                onMarkAsPaid={handleMarkAsPaid}
                isProcessing={isProcessing}
              />
            </TabsContent>

            <TabsContent value="completed">
              <WithdrawalsTable 
                withdrawals={completedWithdrawals}
                formatCurrency={formatCurrency}
                getStatusBadge={getStatusBadge}
                getPixKeyTypeLabel={getPixKeyTypeLabel}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Process Dialog */}
      <Dialog open={!!selectedWithdrawal} onOpenChange={() => setSelectedWithdrawal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Processar Saque</DialogTitle>
            <DialogDescription>
              Analise os dados e aprove ou rejeite a solicitação de saque.
            </DialogDescription>
          </DialogHeader>

          {selectedWithdrawal && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Valor</p>
                  <p className="font-bold text-lg">{formatCurrency(selectedWithdrawal.amount)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Data</p>
                  <p>{new Date(selectedWithdrawal.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Titular</p>
                  <p className="font-medium">{selectedWithdrawal.account_holder_name || "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Tipo de Chave</p>
                  <p>{getPixKeyTypeLabel(selectedWithdrawal.pix_key_type)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Chave PIX</p>
                  <p className="font-mono bg-muted p-2 rounded">{selectedWithdrawal.pix_key || "-"}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Observações (obrigatório para rejeição)</p>
                <Textarea
                  placeholder="Motivo da aprovação/rejeição..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setSelectedWithdrawal(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={isProcessing}>
              Rejeitar
            </Button>
            <Button onClick={handleApprove} disabled={isProcessing}>
              Aprovar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Sub-component for table
const WithdrawalsTable = ({ 
  withdrawals, 
  formatCurrency, 
  getStatusBadge, 
  getPixKeyTypeLabel,
  onSelect,
  showPayButton,
  onMarkAsPaid,
  isProcessing
}: {
  withdrawals: WithdrawalRequest[];
  formatCurrency: (amount: number) => string;
  getStatusBadge: (status: string) => React.ReactNode;
  getPixKeyTypeLabel: (type: string | null) => string;
  onSelect?: (w: WithdrawalRequest) => void;
  showPayButton?: boolean;
  onMarkAsPaid?: (w: WithdrawalRequest) => void;
  isProcessing?: boolean;
}) => {
  if (withdrawals.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhuma solicitação nesta categoria
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Data</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Titular</TableHead>
          <TableHead>PIX</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {withdrawals.map((w) => (
          <TableRow key={w.id}>
            <TableCell className="text-sm">
              {new Date(w.created_at).toLocaleDateString()}
            </TableCell>
            <TableCell className="font-medium">
              {formatCurrency(w.amount)}
            </TableCell>
            <TableCell className="text-sm">
              {w.account_holder_name || "-"}
            </TableCell>
            <TableCell className="text-xs">
              <span className="text-muted-foreground">{getPixKeyTypeLabel(w.pix_key_type)}:</span><br/>
              <span className="font-mono">{w.pix_key}</span>
            </TableCell>
            <TableCell>
              {getStatusBadge(w.status)}
            </TableCell>
            <TableCell>
              {onSelect && w.status === "pending" && (
                <Button size="sm" variant="outline" onClick={() => onSelect(w)}>
                  Processar
                </Button>
              )}
              {showPayButton && onMarkAsPaid && w.status === "approved" && (
                <Button 
                  size="sm" 
                  onClick={() => onMarkAsPaid(w)}
                  disabled={isProcessing}
                >
                  Marcar como Pago
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
