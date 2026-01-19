import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Gift, Clock, Users, TrendingUp, Search, Loader2, CheckCircle, XCircle } from 'lucide-react';

interface UserWithTrial {
  user_id: string;
  email: string;
  full_name: string;
  subscription_plan: string;
  trial_started_at: string | null;
  trial_ends_at: string | null;
  trial_type: string | null;
  created_at: string;
}

interface TrialLog {
  id: string;
  user_id: string;
  trial_type: string;
  duration_days: number;
  started_at: string;
  ends_at: string;
  converted_to_paid: boolean;
  converted_at: string | null;
}

interface TrialStats {
  totalTrials: number;
  activeTrials: number;
  convertedTrials: number;
  conversionRate: number;
}

export function TrialManagement() {
  const [users, setUsers] = useState<UserWithTrial[]>([]);
  const [trialLogs, setTrialLogs] = useState<TrialLog[]>([]);
  const [stats, setStats] = useState<TrialStats>({ totalTrials: 0, activeTrials: 0, convertedTrials: 0, conversionRate: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserWithTrial | null>(null);
  const [trialDays, setTrialDays] = useState('7');
  const [activating, setActivating] = useState(false);
  const [showActivateDialog, setShowActivateDialog] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load free users using RPC to get email
      const { data: usersData, error: usersError } = await supabase
        .rpc('get_users_with_profiles')
        .eq('subscription_plan', 'free');

      if (usersError) throw usersError;
      
      // Map to expected format
      const mappedUsers: UserWithTrial[] = (usersData || []).map((u: any) => ({
        user_id: u.id,
        email: u.email,
        full_name: u.full_name,
        subscription_plan: u.subscription_plan,
        trial_started_at: u.trial_started_at,
        trial_ends_at: u.trial_ends_at,
        trial_type: u.trial_type,
        created_at: u.created_at
      }));
      setUsers(mappedUsers);

      // Load trial logs
      const { data: logsData, error: logsError } = await supabase
        .from('trial_logs')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(100);

      if (logsError) throw logsError;
      setTrialLogs(logsData || []);

      // Calculate stats
      const now = new Date();
      const activeTrials = mappedUsers.filter(u => 
        u.trial_ends_at && new Date(u.trial_ends_at) > now
      ).length;
      
      const totalTrials = (logsData || []).length;
      const convertedTrials = (logsData || []).filter(l => l.converted_to_paid).length;
      const conversionRate = totalTrials > 0 ? (convertedTrials / totalTrials) * 100 : 0;

      setStats({
        totalTrials,
        activeTrials,
        convertedTrials,
        conversionRate
      });

    } catch (error) {
      console.error('Error loading trial data:', error);
      toast.error('Erro ao carregar dados de trial');
    } finally {
      setLoading(false);
    }
  };

  const activateTrial = async () => {
    if (!selectedUser) return;

    setActivating(true);
    try {
      const days = parseInt(trialDays);
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + days);

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          trial_started_at: new Date().toISOString(),
          trial_ends_at: trialEndsAt.toISOString(),
          trial_type: 'manual'
        })
        .eq('user_id', selectedUser.user_id);

      if (updateError) throw updateError;

      // Log the trial
      const { error: logError } = await supabase
        .from('trial_logs')
        .insert({
          user_id: selectedUser.user_id,
          trial_type: 'manual',
          duration_days: days,
          ends_at: trialEndsAt.toISOString(),
        });

      if (logError) throw logError;

      toast.success(`Trial de ${days} dias ativado para ${selectedUser.full_name || selectedUser.email}`);
      setShowActivateDialog(false);
      setSelectedUser(null);
      loadData();
    } catch (error) {
      console.error('Error activating trial:', error);
      toast.error('Erro ao ativar trial');
    } finally {
      setActivating(false);
    }
  };

  const getTrialStatus = (user: UserWithTrial) => {
    if (!user.trial_ends_at) return null;
    
    const now = new Date();
    const endsAt = new Date(user.trial_ends_at);
    
    if (endsAt > now) {
      const daysLeft = Math.ceil((endsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return { status: 'active', daysLeft };
    }
    return { status: 'expired', daysLeft: 0 };
  };

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trials Ativos</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeTrials}</div>
            <p className="text-xs text-muted-foreground">usuários testando premium</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Trials</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTrials}</div>
            <p className="text-xs text-muted-foreground">trials já concedidos</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversões</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.convertedTrials}</div>
            <p className="text-xs text-muted-foreground">viraram assinantes</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">trial → pago</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Gerenciar Trials
          </CardTitle>
          <CardDescription>
            Libere períodos de teste para usuários FREE experimentarem recursos Premium
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Cadastro</TableHead>
                  <TableHead>Status Trial</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Nenhum usuário FREE encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => {
                    const trialStatus = getTrialStatus(user);
                    return (
                      <TableRow key={user.user_id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{user.full_name || 'Sem nome'}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(user.created_at), { addSuffix: true, locale: ptBR })}
                          </span>
                        </TableCell>
                        <TableCell>
                          {trialStatus ? (
                            trialStatus.status === 'active' ? (
                              <Badge variant="default" className="gap-1">
                                <CheckCircle className="h-3 w-3" />
                                {trialStatus.daysLeft} dias restantes
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="gap-1">
                                <XCircle className="h-3 w-3" />
                                Expirado
                              </Badge>
                            )
                          ) : (
                            <Badge variant="outline">Nunca teve trial</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant={trialStatus?.status === 'active' ? 'outline' : 'default'}
                            onClick={() => {
                              setSelectedUser(user);
                              setShowActivateDialog(true);
                            }}
                            disabled={trialStatus?.status === 'active'}
                          >
                            <Gift className="h-4 w-4 mr-1" />
                            {trialStatus?.status === 'active' ? 'Trial Ativo' : 'Ativar Trial'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Trial Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Trials</CardTitle>
          <CardDescription>Últimos trials concedidos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead>Término</TableHead>
                  <TableHead>Conversão</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trialLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Nenhum trial registrado ainda
                    </TableCell>
                  </TableRow>
                ) : (
                  trialLogs.slice(0, 10).map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        {format(new Date(log.started_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        <Badge variant={log.trial_type === 'automatic' ? 'secondary' : 'outline'}>
                          {log.trial_type === 'automatic' ? 'Automático' : 'Manual'}
                        </Badge>
                      </TableCell>
                      <TableCell>{log.duration_days} dias</TableCell>
                      <TableCell>
                        {format(new Date(log.ends_at), 'dd/MM/yyyy', { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        {log.converted_to_paid ? (
                          <Badge variant="default" className="bg-green-500">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Converteu
                          </Badge>
                        ) : (
                          <Badge variant="outline">Não converteu</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Activate Trial Dialog */}
      <Dialog open={showActivateDialog} onOpenChange={setShowActivateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ativar Trial Premium</DialogTitle>
            <DialogDescription>
              Libere acesso às funcionalidades Premium para{' '}
              <strong>{selectedUser?.full_name || selectedUser?.email}</strong>
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Duração do Trial</label>
              <Select value={trialDays} onValueChange={setTrialDays}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 dias</SelectItem>
                  <SelectItem value="7">7 dias</SelectItem>
                  <SelectItem value="14">14 dias</SelectItem>
                  <SelectItem value="30">30 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="rounded-lg bg-muted p-3">
              <p className="text-sm text-muted-foreground">
                O usuário terá acesso a todas as funcionalidades do plano <strong>Premium</strong> durante o período de teste, incluindo:
              </p>
              <ul className="mt-2 text-sm text-muted-foreground list-disc list-inside">
                <li>Planos de bem-estar ilimitados</li>
                <li>Diário da Mulher com IA</li>
                <li>SOS Feminino</li>
                <li>Recomendações personalizadas</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowActivateDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={activateTrial} disabled={activating}>
              {activating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Ativando...
                </>
              ) : (
                <>
                  <Gift className="h-4 w-4 mr-2" />
                  Ativar Trial
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
