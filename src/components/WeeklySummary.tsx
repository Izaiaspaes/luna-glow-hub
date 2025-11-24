import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, BarChart3 } from "lucide-react";
import { useWorkTracking } from "@/hooks/useWorkTracking";

export function WeeklySummary() {
  const { getWeeklySummary } = useWorkTracking();
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    setLoading(true);
    const data = await getWeeklySummary();
    setSummary(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Resumo Semanal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Carregando...</p>
        </CardContent>
      </Card>
    );
  }

  if (!summary) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Resumo Semanal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Registre seus dias de trabalho para ver um resumo semanal com análises e padrões.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getMostCommonWorkload = () => {
    const dist = summary.workloadDistribution;
    const max = Math.max(dist.light, dist.moderate, dist.heavy, dist.exhausting);
    
    if (dist.exhausting === max) return { level: 'Exaustiva', color: 'destructive' };
    if (dist.heavy === max) return { level: 'Pesada', color: 'default' };
    if (dist.moderate === max) return { level: 'Moderada', color: 'secondary' };
    return { level: 'Leve', color: 'outline' };
  };

  const mostCommon = getMostCommonWorkload();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Resumo Semanal de Trabalho
        </CardTitle>
        <CardDescription>
          Análise dos últimos 7 dias
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Total de Horas
            </div>
            <p className="text-2xl font-bold">{summary.totalHours}h</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BarChart3 className="h-4 w-4" />
              Média Diária
            </div>
            <p className="text-2xl font-bold">{summary.avgHours}h</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Carga de Trabalho Predominante</p>
          <Badge variant={mostCommon.color as any}>{mostCommon.level}</Badge>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Distribuição Semanal</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dias Leves:</span>
              <span className="font-medium">{summary.workloadDistribution.light}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dias Moderados:</span>
              <span className="font-medium">{summary.workloadDistribution.moderate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dias Pesados:</span>
              <span className="font-medium">{summary.workloadDistribution.heavy}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dias Exaustivos:</span>
              <span className="font-medium">{summary.workloadDistribution.exhausting}</span>
            </div>
          </div>
        </div>

        {summary.avgHours > 9 && (
          <div className="rounded-lg bg-muted p-3 text-sm">
            <p className="font-medium mb-1">💜 Sugestão da Luna</p>
            <p className="text-muted-foreground">
              Percebemos que sua média de trabalho está alta ({summary.avgHours}h/dia). 
              Considere programar rituais fixos de autocuidado, especialmente nos dias mais intensos.
            </p>
          </div>
        )}

        {summary.workloadDistribution.exhausting > 0 && (
          <div className="rounded-lg bg-muted p-3 text-sm">
            <p className="font-medium mb-1">⚠️ Atenção ao seu bem-estar</p>
            <p className="text-muted-foreground">
              Você teve {summary.workloadDistribution.exhausting} dia(s) de carga exaustiva esta semana. 
              Seu humor e energia podem estar comprometidos. Priorize descanso e recuperação.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
