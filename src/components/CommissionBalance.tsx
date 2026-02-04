import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useCommission } from "@/hooks/useCommission";
import { toast } from "sonner";
import { 
  Wallet, 
  Clock, 
  CheckCircle, 
  ArrowDownToLine,
  TrendingUp,
  DollarSign,
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";

export const CommissionBalance = () => {
  const { t } = useTranslation();
  const { 
    balance, 
    transactions, 
    withdrawals,
    isLoading, 
    formatCurrency,
    requestWithdrawal,
    refresh
  } = useCommission();

  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [pixKey, setPixKey] = useState("");
  const [pixKeyType, setPixKeyType] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleWithdrawal = async () => {
    const amount = parseFloat(withdrawAmount);
    
    if (!amount || amount <= 0) {
      toast.error("Digite um valor válido");
      return;
    }

    if (amount > balance.available_balance) {
      toast.error("Saldo insuficiente");
      return;
    }

    if (!pixKey || !pixKeyType || !accountHolderName) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setIsSubmitting(true);
    try {
      await requestWithdrawal(amount, pixKey, pixKeyType, accountHolderName);
      toast.success("Solicitação de saque enviada! Você receberá em até 5 dias úteis.");
      setIsWithdrawDialogOpen(false);
      setWithdrawAmount("");
      setPixKey("");
      setPixKeyType("");
      setAccountHolderName("");
    } catch (err: any) {
      toast.error(err.message || "Erro ao solicitar saque");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pendente</Badge>;
      case "available":
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Disponível</Badge>;
      case "paid":
        return <Badge className="bg-blue-500"><CheckCircle className="w-3 h-3 mr-1" />Pago</Badge>;
      case "approved":
        return <Badge variant="outline" className="border-green-500 text-green-600"><Clock className="w-3 h-3 mr-1" />Aprovado</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejeitado</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="border-red-500 text-red-600">Cancelado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const hasPendingWithdrawal = withdrawals.some(w => w.status === "pending");

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10">
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-green-500" />
            {t("commission.title", "Minhas Comissões")}
          </CardTitle>
          <CardDescription>
            {t("commission.description", "Acompanhe seus ganhos por indicações e solicite saques")}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Balance Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800">
              <CardContent className="pt-4 text-center">
                <DollarSign className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                  {formatCurrency(balance.available_balance)}
                </p>
                <p className="text-xs text-muted-foreground">Disponível para saque</p>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="pt-4 text-center">
                <Clock className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                <p className="text-2xl font-bold">{formatCurrency(balance.pending_balance)}</p>
                <p className="text-xs text-muted-foreground">Pendente (30 dias)</p>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="pt-4 text-center">
                <TrendingUp className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                <p className="text-2xl font-bold">{formatCurrency(balance.total_earned)}</p>
                <p className="text-xs text-muted-foreground">Total ganho</p>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="pt-4 text-center">
                <ArrowDownToLine className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                <p className="text-2xl font-bold">{formatCurrency(balance.total_withdrawn)}</p>
                <p className="text-xs text-muted-foreground">Total sacado</p>
              </CardContent>
            </Card>
          </div>

          {/* Withdraw Button */}
          <Dialog open={isWithdrawDialogOpen} onOpenChange={setIsWithdrawDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="w-full gap-2"
                disabled={balance.available_balance <= 0 || hasPendingWithdrawal}
              >
                <ArrowDownToLine className="w-4 h-4" />
                {hasPendingWithdrawal 
                  ? "Saque em processamento" 
                  : "Solicitar saque"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Solicitar Saque via PIX</DialogTitle>
                <DialogDescription>
                  Preencha os dados para receber seu saque. O pagamento é processado em até 5 dias úteis.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="bg-muted/50 p-3 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    Saldo disponível: <strong>{formatCurrency(balance.available_balance)}</strong>
                  </span>
                </div>

                <div className="space-y-2">
                  <Label>Valor do saque (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max={balance.available_balance}
                    placeholder="0,00"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Nome do titular</Label>
                  <Input
                    placeholder="Nome completo"
                    value={accountHolderName}
                    onChange={(e) => setAccountHolderName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tipo de chave PIX</Label>
                  <Select value={pixKeyType} onValueChange={setPixKeyType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cpf">CPF</SelectItem>
                      <SelectItem value="email">E-mail</SelectItem>
                      <SelectItem value="phone">Telefone</SelectItem>
                      <SelectItem value="random">Chave aleatória</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Chave PIX</Label>
                  <Input
                    placeholder={
                      pixKeyType === "cpf" ? "000.000.000-00" :
                      pixKeyType === "email" ? "email@exemplo.com" :
                      pixKeyType === "phone" ? "+55 11 99999-9999" :
                      "Chave aleatória"
                    }
                    value={pixKey}
                    onChange={(e) => setPixKey(e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsWithdrawDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleWithdrawal} disabled={isSubmitting}>
                  {isSubmitting ? "Processando..." : "Solicitar Saque"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Recent Transactions */}
          {transactions.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Comissões recentes</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {transactions.slice(0, 5).map((tx) => (
                  <div 
                    key={tx.id} 
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {formatCurrency(tx.amount)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(tx.created_at).toLocaleDateString()} • 
                        {tx.status === "pending" && tx.eligible_at && (
                          <> Libera em {new Date(tx.eligible_at).toLocaleDateString()}</>
                        )}
                      </p>
                    </div>
                    {getStatusBadge(tx.status)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Withdrawals */}
          {withdrawals.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Saques recentes</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {withdrawals.slice(0, 3).map((wd) => (
                  <div 
                    key={wd.id} 
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium">{formatCurrency(wd.amount)}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(wd.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {getStatusBadge(wd.status)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
