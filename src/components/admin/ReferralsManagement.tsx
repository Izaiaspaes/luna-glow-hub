import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { Users, Gift, Clock, CheckCircle, Search, RefreshCw, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

interface Referral {
  id: string;
  referrer_user_id: string;
  referred_user_id: string | null;
  referral_code: string;
  referred_email: string | null;
  status: string;
  referred_subscribed_at: string | null;
  reward_eligible_at: string | null;
  reward_applied: boolean;
  reward_applied_at: string | null;
  created_at: string;
  stripe_coupon_id: string | null;
}

interface ReferralCode {
  id: string;
  user_id: string;
  referral_code: string;
  total_referrals: number;
  successful_referrals: number;
  rewards_earned: number;
}

interface ReferralWithDetails extends Referral {
  referrer_email?: string;
  referrer_name?: string;
}

export const ReferralsManagement = () => {
  const [referrals, setReferrals] = useState<ReferralWithDetails[]>([]);
  const [referralCodes, setReferralCodes] = useState<ReferralCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch referrals
      const { data: referralsData, error: referralsError } = await supabase
        .from("referrals")
        .select("*")
        .order("created_at", { ascending: false });

      if (referralsError) throw referralsError;

      // Fetch referral codes for stats
      const { data: codesData, error: codesError } = await supabase
        .from("user_referral_codes")
        .select("*");

      if (codesError) throw codesError;

      // Fetch user profiles for names/emails
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("user_id, full_name");

      // Get unique user IDs from referrals
      const userIds = [...new Set(referralsData?.map(r => r.referrer_user_id) || [])];
      
      // Fetch user emails using the get_users_with_profiles function
      const { data: usersData } = await supabase.rpc("get_users_with_profiles");

      // Create a map of user_id to email/name
      const userMap = new Map<string, { email: string; name: string }>();
      usersData?.forEach((u: any) => {
        userMap.set(u.user_id, { email: u.email, name: u.full_name || u.email });
      });

      // Enrich referrals with user data
      const enrichedReferrals = referralsData?.map(r => ({
        ...r,
        referrer_email: userMap.get(r.referrer_user_id)?.email,
        referrer_name: userMap.get(r.referrer_user_id)?.name,
      })) || [];

      setReferrals(enrichedReferrals);
      setReferralCodes(codesData || []);
    } catch (error) {
      console.error("Error fetching referrals:", error);
      toast.error("Erro ao carregar indicações");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusBadge = (status: string, rewardApplied: boolean) => {
    if (rewardApplied) {
      return <Badge className="bg-green-500/20 text-green-700 border-green-500/30">Recompensado</Badge>;
    }
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pendente</Badge>;
      case "signed_up":
        return <Badge className="bg-blue-500/20 text-blue-700 border-blue-500/30">Cadastrado</Badge>;
      case "subscribed":
        return <Badge className="bg-purple-500/20 text-purple-700 border-purple-500/30">Assinante</Badge>;
      case "eligible":
        return <Badge className="bg-orange-500/20 text-orange-700 border-orange-500/30">Elegível</Badge>;
      case "rewarded":
        return <Badge className="bg-green-500/20 text-green-700 border-green-500/30">Recompensado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredReferrals = referrals.filter(r => {
    const matchesSearch = 
      r.referrer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.referrer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.referred_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.referral_code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    total: referrals.length,
    pending: referrals.filter(r => r.status === "pending" || r.status === "signed_up").length,
    subscribed: referrals.filter(r => r.status === "subscribed" || r.status === "eligible").length,
    rewarded: referrals.filter(r => r.status === "rewarded" || r.reward_applied).length,
    totalReferrers: referralCodes.length,
    totalRewardsEarned: referralCodes.reduce((sum, c) => sum + c.rewards_earned, 0),
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Indicações</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalReferrers} usuários indicando
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando assinatura
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Assinantes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.subscribed}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando 30 dias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Recompensados</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rewarded}</div>
            <p className="text-xs text-muted-foreground">
              Cupons aplicados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Referrals Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Indicações</CardTitle>
              <CardDescription>
                Gerencie todas as indicações e acompanhe o status de cada uma
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={fetchData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por email, nome ou código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="signed_up">Cadastrado</SelectItem>
                <SelectItem value="subscribed">Assinante</SelectItem>
                <SelectItem value="eligible">Elegível</SelectItem>
                <SelectItem value="rewarded">Recompensado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quem Indicou</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Indicado</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data Indicação</TableHead>
                  <TableHead>Data Assinatura</TableHead>
                  <TableHead>Elegível em</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReferrals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Nenhuma indicação encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReferrals.map((referral) => (
                    <TableRow key={referral.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{referral.referrer_name || "—"}</p>
                          <p className="text-xs text-muted-foreground">{referral.referrer_email || "—"}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {referral.referral_code}
                        </code>
                      </TableCell>
                      <TableCell>
                        {referral.referred_email || "—"}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(referral.status, referral.reward_applied)}
                      </TableCell>
                      <TableCell>
                        {format(new Date(referral.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        {referral.referred_subscribed_at 
                          ? format(new Date(referral.referred_subscribed_at), "dd/MM/yyyy", { locale: ptBR })
                          : "—"
                        }
                      </TableCell>
                      <TableCell>
                        {referral.reward_eligible_at 
                          ? format(new Date(referral.reward_eligible_at), "dd/MM/yyyy", { locale: ptBR })
                          : "—"
                        }
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            Total: {filteredReferrals.length} indicação(ões)
          </p>
        </CardContent>
      </Card>

      {/* Top Referrers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Indicadores</CardTitle>
          <CardDescription>
            Usuários com mais indicações bem-sucedidas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead className="text-center">Total Indicações</TableHead>
                  <TableHead className="text-center">Indicações Bem-sucedidas</TableHead>
                  <TableHead className="text-center">Recompensas Ganhas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referralCodes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Nenhum código de indicação gerado ainda
                    </TableCell>
                  </TableRow>
                ) : (
                  referralCodes
                    .sort((a, b) => b.successful_referrals - a.successful_referrals)
                    .slice(0, 10)
                    .map((code) => (
                      <TableRow key={code.id}>
                        <TableCell>
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {code.referral_code}
                          </code>
                        </TableCell>
                        <TableCell className="text-center">{code.total_referrals}</TableCell>
                        <TableCell className="text-center">{code.successful_referrals}</TableCell>
                        <TableCell className="text-center">{code.rewards_earned}</TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
