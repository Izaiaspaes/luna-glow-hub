import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Heart, TrendingUp, Calendar, Activity, UserPlus, HeartHandshake } from "lucide-react";

interface Stats {
  totalUsers: number;
  activeUsers: number;
  totalPlans: number;
  activePlans: number;
  cycleTracking: number;
  sleepTracking: number;
  moodTracking: number;
  energyTracking: number;
  totalPartnerRelationships: number;
  acceptedPartners: number;
  pendingPartners: number;
}

export const Statistics = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeUsers: 0,
    totalPlans: 0,
    activePlans: 0,
    cycleTracking: 0,
    sleepTracking: 0,
    moodTracking: 0,
    energyTracking: 0,
    totalPartnerRelationships: 0,
    acceptedPartners: 0,
    pendingPartners: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);

    // Get total users
    const { count: totalUsers } = await supabase
      .from('user_roles')
      .select('user_id', { count: 'exact', head: true });

    // Get total wellness plans
    const { count: totalPlans } = await supabase
      .from('wellness_plans')
      .select('*', { count: 'exact', head: true });

    // Get active wellness plans
    const { count: activePlans } = await supabase
      .from('wellness_plans')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
      .is('archived_at', null);

    // Get tracking data counts
    const { count: cycleTracking } = await supabase
      .from('cycle_tracking')
      .select('*', { count: 'exact', head: true });

    const { count: sleepTracking } = await supabase
      .from('sleep_tracking')
      .select('*', { count: 'exact', head: true });

    const { count: moodTracking } = await supabase
      .from('mood_tracking')
      .select('*', { count: 'exact', head: true });

    const { count: energyTracking } = await supabase
      .from('energy_tracking')
      .select('*', { count: 'exact', head: true });

    // Get partner relationships stats (Luna a Dois)
    const { count: totalPartnerRelationships } = await supabase
      .from('partner_relationships')
      .select('*', { count: 'exact', head: true });

    const { count: acceptedPartners } = await supabase
      .from('partner_relationships')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'accepted');

    const { count: pendingPartners } = await supabase
      .from('partner_relationships')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    setStats({
      totalUsers: totalUsers || 0,
      activeUsers: totalUsers || 0, // For now, all registered users are considered active
      totalPlans: totalPlans || 0,
      activePlans: activePlans || 0,
      cycleTracking: cycleTracking || 0,
      sleepTracking: sleepTracking || 0,
      moodTracking: moodTracking || 0,
      energyTracking: energyTracking || 0,
      totalPartnerRelationships: totalPartnerRelationships || 0,
      acceptedPartners: acceptedPartners || 0,
      pendingPartners: pendingPartners || 0,
    });

    setLoading(false);
  };

  const StatCard = ({ title, value, icon: Icon, description }: { title: string; value: number; icon: any; description: string }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{loading ? "..." : value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Usuários"
          value={stats.totalUsers}
          icon={Users}
          description="Usuários cadastrados"
        />
        <StatCard
          title="Usuários Ativos"
          value={stats.activeUsers}
          icon={Activity}
          description="Usuários com atividade recente"
        />
        <StatCard
          title="Planos Gerados"
          value={stats.totalPlans}
          icon={Calendar}
          description="Total de planos criados"
        />
        <StatCard
          title="Planos Ativos"
          value={stats.activePlans}
          icon={TrendingUp}
          description="Planos em andamento"
        />
      </div>

      {/* Luna a Dois Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HeartHandshake className="h-5 w-5 text-primary" />
            Luna a Dois (Parceiros)
          </CardTitle>
          <CardDescription>Estatísticas de convites e parceiros cadastrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2 p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Total de Convites</span>
              </div>
              <p className="text-2xl font-bold">{loading ? "..." : stats.totalPartnerRelationships}</p>
              <p className="text-xs text-muted-foreground">Convites enviados</p>
            </div>
            <div className="space-y-2 p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <HeartHandshake className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium">Parceiros Aceitos</span>
              </div>
              <p className="text-2xl font-bold">{loading ? "..." : stats.acceptedPartners}</p>
              <p className="text-xs text-muted-foreground">Parceiros que aceitaram o convite</p>
            </div>
            <div className="space-y-2 p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span className="text-sm font-medium">Convites Pendentes</span>
              </div>
              <p className="text-2xl font-bold">{loading ? "..." : stats.pendingPartners}</p>
              <p className="text-xs text-muted-foreground">Aguardando aceitação</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rastreamento de Dados</CardTitle>
          <CardDescription>Estatísticas de uso das funcionalidades de rastreamento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Ciclo Menstrual</span>
              </div>
              <p className="text-2xl font-bold">{loading ? "..." : stats.cycleTracking}</p>
              <p className="text-xs text-muted-foreground">Registros de ciclo</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium">Sono</span>
              </div>
              <p className="text-2xl font-bold">{loading ? "..." : stats.sleepTracking}</p>
              <p className="text-xs text-muted-foreground">Registros de sono</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span className="text-sm font-medium">Humor</span>
              </div>
              <p className="text-2xl font-bold">{loading ? "..." : stats.moodTracking}</p>
              <p className="text-xs text-muted-foreground">Registros de humor</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium">Energia</span>
              </div>
              <p className="text-2xl font-bold">{loading ? "..." : stats.energyTracking}</p>
              <p className="text-xs text-muted-foreground">Registros de energia</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
