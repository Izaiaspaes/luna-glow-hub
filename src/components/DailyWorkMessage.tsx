import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, AlertCircle, TrendingUp, Sparkles } from "lucide-react";
import { useWorkTracking } from "@/hooks/useWorkTracking";
import { useTranslation } from "react-i18next";

export function DailyWorkMessage() {
  const { t } = useTranslation();
  const [todayDate] = useState(() => new Date());
  const { workData, loading } = useWorkTracking(todayDate);
  const [todayWork, setTodayWork] = useState<any>(null);

  useEffect(() => {
    if (workData && workData.length > 0) {
      setTodayWork(workData[0]);
    }
  }, [workData]);

  if (loading || !todayWork) {
    return null;
  }

  const getWorkloadInfo = (level: string) => {
    switch (level) {
      case 'light':
        return { label: t("dailyWork.workloadLevels.light"), icon: Sparkles, color: 'outline' };
      case 'moderate':
        return { label: t("dailyWork.workloadLevels.moderate"), icon: TrendingUp, color: 'secondary' };
      case 'heavy':
        return { label: t("dailyWork.workloadLevels.heavy"), icon: AlertCircle, color: 'default' };
      case 'exhausting':
        return { label: t("dailyWork.workloadLevels.exhausting"), icon: AlertCircle, color: 'destructive' };
      default:
        return { label: t("dailyWork.workloadLevels.unknown"), icon: Heart, color: 'outline' };
    }
  };

  const getMoodImpactInfo = (level: string) => {
    switch (level) {
      case 'low':
        return t("dailyWork.moodImpact.low");
      case 'medium':
        return t("dailyWork.moodImpact.medium");
      case 'high':
        return t("dailyWork.moodImpact.high");
      case 'very_high':
        return t("dailyWork.moodImpact.veryHigh");
      default:
        return t("dailyWork.moodImpact.unknown");
    }
  };

  const workloadInfo = getWorkloadInfo(todayWork.workload_level);
  const Icon = workloadInfo.icon;

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-primary/10 p-2">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={workloadInfo.color as any}>
                {t("dailyWork.workload")} {workloadInfo.label}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {todayWork.hours_worked}h {t("dailyWork.hoursWorked")}
              </span>
            </div>
            
            <p className="text-sm">
              <span className="font-medium">{t("dailyWork.predictedMoodImpact")}: </span>
              <span className="text-muted-foreground">
                {getMoodImpactInfo(todayWork.mood_impact_level)}
              </span>
            </p>

            {todayWork.daily_message && (
              <div className="rounded-lg bg-background/50 p-3 mt-3">
                <p className="text-sm leading-relaxed">
                  {todayWork.daily_message}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
