import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, BarChart3 } from "lucide-react";
import { useWorkTracking } from "@/hooks/useWorkTracking";
import { useTranslation } from "react-i18next";

export function WeeklySummary() {
  const { t } = useTranslation();
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
            {t("weeklySummary.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{t("weeklySummary.loading")}</p>
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
            {t("weeklySummary.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {t("weeklySummary.emptyMessage")}
          </p>
        </CardContent>
      </Card>
    );
  }

  const getMostCommonWorkload = () => {
    const dist = summary.workloadDistribution;
    const max = Math.max(dist.light, dist.moderate, dist.heavy, dist.exhausting);
    
    if (dist.exhausting === max) return { level: t("weeklySummary.workloadLevels.exhausting"), color: 'destructive' };
    if (dist.heavy === max) return { level: t("weeklySummary.workloadLevels.heavy"), color: 'default' };
    if (dist.moderate === max) return { level: t("weeklySummary.workloadLevels.moderate"), color: 'secondary' };
    return { level: t("weeklySummary.workloadLevels.light"), color: 'outline' };
  };

  const mostCommon = getMostCommonWorkload();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          {t("weeklySummary.workTitle")}
        </CardTitle>
        <CardDescription>
          {t("weeklySummary.subtitle")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {t("weeklySummary.totalHours")}
            </div>
            <p className="text-2xl font-bold">{summary.totalHours}h</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BarChart3 className="h-4 w-4" />
              {t("weeklySummary.dailyAverage")}
            </div>
            <p className="text-2xl font-bold">{summary.avgHours}h</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">{t("weeklySummary.predominantWorkload")}</p>
          <Badge variant={mostCommon.color as any}>{mostCommon.level}</Badge>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">{t("weeklySummary.weeklyDistribution")}</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("weeklySummary.lightDays")}:</span>
              <span className="font-medium">{summary.workloadDistribution.light}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("weeklySummary.moderateDays")}:</span>
              <span className="font-medium">{summary.workloadDistribution.moderate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("weeklySummary.heavyDays")}:</span>
              <span className="font-medium">{summary.workloadDistribution.heavy}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("weeklySummary.exhaustingDays")}:</span>
              <span className="font-medium">{summary.workloadDistribution.exhausting}</span>
            </div>
          </div>
        </div>

        {summary.avgHours > 9 && (
          <div className="rounded-lg bg-muted p-3 text-sm">
            <p className="font-medium mb-1">💜 {t("weeklySummary.lunaSuggestion")}</p>
            <p className="text-muted-foreground">
              {t("weeklySummary.highWorkloadMessage", { hours: summary.avgHours })}
            </p>
          </div>
        )}

        {summary.workloadDistribution.exhausting > 0 && (
          <div className="rounded-lg bg-muted p-3 text-sm">
            <p className="font-medium mb-1">⚠️ {t("weeklySummary.wellbeingAttention")}</p>
            <p className="text-muted-foreground">
              {t("weeklySummary.exhaustingMessage", { days: summary.workloadDistribution.exhausting })}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
