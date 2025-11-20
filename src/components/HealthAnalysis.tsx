import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Brain, AlertTriangle, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HealthAnalysisProps {
  analysis: {
    analysis: string;
    suggestions: string[];
    insights: string[];
    needs_attention: boolean;
  };
}

export function HealthAnalysis({ analysis }: HealthAnalysisProps) {
  return (
    <Card className="mt-4 border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary" />
          Análise com IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {analysis.needs_attention && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Atenção</AlertTitle>
            <AlertDescription>
              Recomendamos consultar um profissional de saúde sobre estes sintomas.
            </AlertDescription>
          </Alert>
        )}

        <div>
          <p className="text-sm text-muted-foreground">{analysis.analysis}</p>
        </div>

        {analysis.insights.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Insights
            </h4>
            <div className="space-y-1">
              {analysis.insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-primary">•</span>
                  <span className="text-muted-foreground">{insight}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {analysis.suggestions.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2">Sugestões</h4>
            <div className="flex flex-wrap gap-2">
              {analysis.suggestions.map((suggestion, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {suggestion}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
