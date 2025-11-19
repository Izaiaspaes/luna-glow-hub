import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Sparkles } from "lucide-react";

interface WellnessPlan {
  id: string;
  plan_type: string;
  plan_content: {
    title?: string;
    activities?: Array<{
      time?: string;
      activity?: string;
      description?: string;
    }>;
    tips?: string[];
    focus_areas?: string[];
  };
  ai_recommendations: string;
  valid_from: string;
  valid_until: string | null;
  is_active: boolean;
}

interface WellnessPlanCardProps {
  plan: WellnessPlan;
}

export function WellnessPlanCard({ plan }: WellnessPlanCardProps) {
  const content = plan.plan_content;
  
  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              {content.title || `Plano ${plan.plan_type}`}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-2">
              <Calendar className="h-4 w-4" />
              Válido desde {new Date(plan.valid_from).toLocaleDateString('pt-BR')}
            </CardDescription>
          </div>
          {plan.is_active && (
            <Badge variant="default">Ativo</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {content.focus_areas && content.focus_areas.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Áreas de Foco</h4>
            <div className="flex flex-wrap gap-2">
              {content.focus_areas.map((area, idx) => (
                <Badge key={idx} variant="secondary">{area}</Badge>
              ))}
            </div>
          </div>
        )}

        {content.activities && content.activities.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Atividades Recomendadas</h4>
            <div className="space-y-2">
              {content.activities.map((activity, idx) => (
                <div key={idx} className="p-3 bg-secondary/20 rounded-lg">
                  {activity.time && (
                    <p className="text-sm font-medium text-muted-foreground">{activity.time}</p>
                  )}
                  <p className="font-medium">{activity.activity}</p>
                  {activity.description && (
                    <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {content.tips && content.tips.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Dicas Personalizadas</h4>
            <ul className="space-y-1 list-disc list-inside">
              {content.tips.map((tip, idx) => (
                <li key={idx} className="text-sm">{tip}</li>
              ))}
            </ul>
          </div>
        )}

        {plan.ai_recommendations && (
          <div>
            <h4 className="font-semibold mb-2">Recomendações da IA</h4>
            <p className="text-sm text-muted-foreground">{plan.ai_recommendations}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
