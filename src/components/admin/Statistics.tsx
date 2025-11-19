import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Heart, TrendingUp, Calendar, Activity } from "lucide-react";

interface Stats {
  totalUsers: number;
  activeUsers: number;
  totalPlans: number;
  activePlans: number;
  cycleTracking: number;
  sleepTracking: number;
  moodTracking: number;
  energyTracking: number;
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

    setStats({
      totalUsers: totalUsers || 0,
      activeUsers: totalUsers || 0, // For now, all registered users are considered active
      totalPlans: totalPlans || 0,
      activePlans: activePlans || 0,
      cycleTracking: cycleTracking || 0,
      sleepTracking: sleepTracking || 0,
      moodTracking: moodTracking || 0,
      energyTracking: energyTracking || 0,
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

      <Card>
        <CardHeader>
          <CardTitle>Rastreamento de Dados</CardTitle>
          <CardDescription>Estatísticas de uso das funcionalidades de rastreamento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-pink-500" />
                <span className="text-sm font-medium">Ciclo Menstrual</span>
              </div>
              <p className="text-2xl font-bold">{loading ? "..." : stats.cycleTracking}</p>
              <p className="text-xs text-muted-foreground">Registros de ciclo</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Sono</span>
              </div>
              <p className="text-2xl font-bold">{loading ? "..." : stats.sleepTracking}</p>
              <p className="text-xs text-muted-foreground">Registros de sono</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Humor</span>
              </div>
              <p className="text-2xl font-bold">{loading ? "..." : stats.moodTracking}</p>
              <p className="text-xs text-muted-foreground">Registros de humor</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-500" />
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
