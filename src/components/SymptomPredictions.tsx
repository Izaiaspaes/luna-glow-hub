import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Brain, TrendingUp, Calendar, AlertTriangle, Sparkles, Loader2 } from "lucide-react";
import { format, addDays } from "date-fns";
import { ptBR, enUS, es } from "date-fns/locale";
import { useTranslation } from "react-i18next";

interface Prediction {
  date: string;
  phase: string;
  symptoms: string[];
  confidence: number;
  severity: "low" | "medium" | "high";
  recommendations: string[];
}

interface SymptomPredictionsProps {
  userId: string;
}

const severityColors: Record<string, string> = {
  low: "bg-green-500/10 text-green-700 dark:text-green-400",
  medium: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  high: "bg-red-500/10 text-red-700 dark:text-red-400",
};

const getDateLocale = (lang: string) => {
  switch (lang) {
    case 'en': return enUS;
    case 'es': return es;
    default: return ptBR;
  }
};

export function SymptomPredictions({ userId }: SymptomPredictionsProps) {
  const { t, i18n } = useTranslation();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const generatePredictions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("predict-symptoms", {
        body: {},
      });

      if (error) throw error;

      setPredictions(data.predictions);
      setSummary(data.summary);
      setHasGenerated(true);

      toast({
        title: t("symptomPredictions.toasts.generated"),
        description: t("symptomPredictions.toasts.generatedDesc"),
      });
    } catch (error: any) {
      console.error("Error generating predictions:", error);
      toast({
        title: t("symptomPredictions.toasts.error"),
        description: error.message || t("symptomPredictions.toasts.errorRetry"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600 dark:text-green-400";
    if (confidence >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-orange-600 dark:text-orange-400";
  };

  return (
    <div className="space-y-4">
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                {t("symptomPredictions.title")}
              </CardTitle>
              <CardDescription>
                {t("symptomPredictions.description")}
              </CardDescription>
            </div>
            <Button
              onClick={generatePredictions}
              disabled={loading}
              className="gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("symptomPredictions.analyzing")}
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  {hasGenerated ? t("symptomPredictions.updatePredictions") : t("symptomPredictions.generatePredictions")}
                </>
              )}
            </Button>
          </div>
        </CardHeader>

        {!hasGenerated && !loading && (
          <CardContent>
            <Alert>
              <TrendingUp className="h-4 w-4" />
              <AlertDescription>
                {t("symptomPredictions.emptyAlert")}
              </AlertDescription>
            </Alert>
          </CardContent>
        )}

        {summary && (
          <CardContent>
            <Alert className="bg-primary/5 border-primary/20">
              <Brain className="h-4 w-4 text-primary" />
              <AlertDescription className="text-sm">
                {summary}
              </AlertDescription>
            </Alert>
          </CardContent>
        )}
      </Card>

      {predictions.length > 0 && (
        <div className="grid gap-3">
          {predictions.map((prediction, index) => (
            <Card key={index} className="border-border/50 hover:border-primary/30 transition-colors">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Header with date and phase */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium">
                          {format(new Date(prediction.date), "EEEE, dd MMMM", { locale: getDateLocale(i18n.language) })}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {t(`symptomPredictions.phases.${prediction.phase}`)}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${getConfidenceColor(prediction.confidence)}`}>
                        {prediction.confidence}% {t("symptomPredictions.confidence")}
                      </p>
                      <Badge className={`text-xs ${severityColors[prediction.severity]}`}>
                        {t(`symptomPredictions.severity.${prediction.severity}`)}
                      </Badge>
                    </div>
                  </div>

                  {/* Symptoms */}
                  {prediction.symptoms.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        {t("symptomPredictions.predictedSymptoms")}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {prediction.symptoms.map((symptom, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {symptom}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {prediction.recommendations.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        {t("symptomPredictions.recommendations")}
                      </p>
                      <ul className="space-y-1.5">
                        {prediction.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="text-primary mt-0.5">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}