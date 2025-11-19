import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Calendar, Sparkles, Heart, Moon, Apple, Dumbbell, Brain } from "lucide-react";

interface Recommendation {
  category: string;
  title: string;
  description: string;
  priority: string;
}

interface AIPlan {
  title: string;
  summary: string;
  recommendations: Recommendation[];
  insights?: string;
}

interface WellnessPlan {
  id: string;
  plan_type: string;
  plan_content: AIPlan;
  ai_recommendations: string;
  valid_from: string;
  valid_until: string | null;
  is_active: boolean;
}

interface WellnessPlanCardProps {
  plan: WellnessPlan;
}

const getCategoryIcon = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('sono') || cat.includes('descanso')) return Moon;
  if (cat.includes('nutrição') || cat.includes('nutricao')) return Apple;
  if (cat.includes('física') || cat.includes('exercicio') || cat.includes('movimento')) return Dumbbell;
  if (cat.includes('mental') || cat.includes('saúde')) return Brain;
  if (cat.includes('ciclo') || cat.includes('autocuidado')) return Heart;
  return Sparkles;
};

const getPriorityColor = (priority: string) => {
  const p = priority.toLowerCase();
  if (p === 'alta') return 'text-red-500 dark:text-red-400';
  if (p === 'média' || p === 'media') return 'text-yellow-500 dark:text-yellow-400';
  return 'text-green-500 dark:text-green-400';
};

export function WellnessPlanCard({ plan }: WellnessPlanCardProps) {
  const content = plan.plan_content;
  
  return (
    <Card className="mb-4 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-background">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="h-6 w-6 text-primary" />
              {content.title || `Plano ${plan.plan_type}`}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-2">
              <Calendar className="h-4 w-4" />
              Válido desde {new Date(plan.valid_from).toLocaleDateString('pt-BR')}
            </CardDescription>
          </div>
          {plan.is_active && (
            <Badge variant="default" className="ml-2">Ativo</Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-6">
        {content.summary && (
          <div className="p-4 bg-muted/50 rounded-lg border border-border/50">
            <p className="text-sm leading-relaxed">{content.summary}</p>
          </div>
        )}

        {content.recommendations && content.recommendations.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3 text-lg">Recomendações Personalizadas</h4>
            <Accordion type="single" collapsible className="w-full space-y-2">
              {content.recommendations.map((rec, idx) => {
                const Icon = getCategoryIcon(rec.category);
                return (
                  <AccordionItem 
                    key={idx} 
                    value={`item-${idx}`}
                    className="border rounded-lg px-4 bg-card hover:bg-accent/5 transition-colors"
                  >
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-3 text-left">
                        <Icon className="h-5 w-5 text-primary flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold">{rec.title}</span>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getPriorityColor(rec.priority)}`}
                            >
                              {rec.priority}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{rec.category}</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 pt-2">
                      <p className="text-sm leading-relaxed text-foreground/90 pl-8">
                        {rec.description}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        )}

        {content.insights && (
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Insights Personalizados
            </h4>
            <p className="text-sm leading-relaxed text-muted-foreground">{content.insights}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
