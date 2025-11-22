import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WellnessPlanCard } from "@/components/WellnessPlanCard";
import { Calendar as CalendarIcon, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { format, isSameDay, isWithinInterval, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";

interface WellnessPlan {
  id: string;
  plan_type: string;
  plan_content: any;
  ai_recommendations: string;
  valid_from: string;
  valid_until: string | null;
  is_active: boolean;
  created_at: string;
  status?: string;
  completed_at?: string | null;
  archived_at?: string | null;
}

interface CalendarViewProps {
  plans: WellnessPlan[];
  onGeneratePlan?: () => void;
  generatingPlan?: boolean;
}

export function CalendarView({ plans, onGeneratePlan, generatingPlan }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
  const plansForSelectedDate = plans.filter(plan => {
    // Don't show archived plans in calendar view
    if (plan.status === 'archived') return false;
    
    const validFrom = new Date(plan.valid_from);
    const validUntil = plan.valid_until ? new Date(plan.valid_until) : null;
    
    if (validUntil) {
      return isWithinInterval(selectedDate, { start: validFrom, end: validUntil });
    }
    return isSameDay(selectedDate, validFrom);
  });

  const getDaysWithPlans = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    return daysInMonth.filter(day => {
      return plans.some(plan => {
        // Don't show archived plans
        if (plan.status === 'archived') return false;
        
        const validFrom = new Date(plan.valid_from);
        const validUntil = plan.valid_until ? new Date(plan.valid_until) : null;
        
        if (validUntil) {
          return isWithinInterval(day, { start: validFrom, end: validUntil });
        }
        return isSameDay(day, validFrom);
      });
    });
  };

  const daysWithPlans = getDaysWithPlans();

  const handleMonthChange = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  return (
    <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
      {/* Calendar Section */}
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary" />
                Calendário de Planos
              </CardTitle>
              <CardDescription className="mt-1">
                Selecione uma data para ver os planos ativos
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-2 md:p-6">
          <div className="flex flex-col items-center space-y-4">
            {/* Month Navigation */}
            <div className="flex items-center justify-between w-full px-2 md:px-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleMonthChange('prev')}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-semibold text-lg">
                {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleMonthChange('next')}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Calendar */}
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              locale={ptBR}
              className="rounded-lg border bg-card w-full"
              modifiers={{
                hasPlans: daysWithPlans,
              }}
              modifiersStyles={{
                hasPlans: {
                  fontWeight: 'bold',
                  position: 'relative',
                  textDecoration: 'underline',
                  textDecorationColor: 'hsl(var(--primary))',
                  textDecorationThickness: '2px',
                },
              }}
            />

            {/* Legend */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground w-full px-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <span>Dia selecionado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full border-2 border-primary" />
                <span>Dias com planos</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plans for Selected Date */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Planos para {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
            </CardTitle>
            <CardDescription>
              {plansForSelectedDate.length > 0 
                ? `${plansForSelectedDate.length} plano(s) ativo(s) para esta data`
                : "Nenhum plano ativo para esta data"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {plansForSelectedDate.length > 0 ? (
              <div className="space-y-4">
                {plansForSelectedDate.map((plan) => (
                  <div key={plan.id} className="border rounded-lg p-4 bg-accent/5 hover:bg-accent/10 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-lg">
                          {plan.plan_content?.title || `Plano ${plan.plan_type}`}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {plan.plan_content?.summary || 'Plano personalizado de bem-estar'}
                        </p>
                      </div>
                      {plan.status === 'completed' ? (
                        <Badge variant="outline" className="ml-2 text-green-600 dark:text-green-400 border-green-600">
                          ✓ Concluído
                        </Badge>
                      ) : plan.status === 'active' || plan.is_active ? (
                        <Badge variant="wellness" className="ml-2">
                          ✓ Ativo
                        </Badge>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-3">
                      <CalendarIcon className="h-3 w-3" />
                      <span>
                        Válido de {format(new Date(plan.valid_from), "dd/MM/yyyy")}
                        {plan.valid_until && ` até ${format(new Date(plan.valid_until), "dd/MM/yyyy")}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Nenhum plano ativo para esta data
                </p>
                {onGeneratePlan && (
                  <Button
                    onClick={onGeneratePlan}
                    disabled={generatingPlan}
                    variant="outline"
                    size="sm"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    {generatingPlan ? "Gerando..." : "Gerar Novo Plano"}
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* All Plans Timeline */}
        {plans.filter(p => p.status !== 'archived').length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Todos os Planos</CardTitle>
              <CardDescription>
                {plans.filter(p => p.status !== 'archived').length} plano(s) ativo(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {plans.filter(p => p.status !== 'archived').map((plan) => (
                  <div
                    key={plan.id}
                    className="border-l-4 border-primary pl-4 py-2 hover:bg-accent/5 transition-colors cursor-pointer"
                    onClick={() => setSelectedDate(new Date(plan.valid_from))}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium text-sm">
                          {plan.plan_content?.title || `Plano ${plan.plan_type}`}
                        </h5>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(plan.valid_from), "dd/MM/yyyy")}
                          {plan.valid_until && ` - ${format(new Date(plan.valid_until), "dd/MM/yyyy")}`}
                        </p>
                      </div>
                      {plan.status === 'completed' ? (
                        <Badge variant="outline" className="ml-2 text-xs text-green-600 dark:text-green-400 border-green-600">
                          ✓ Concluído
                        </Badge>
                      ) : plan.status === 'active' || plan.is_active ? (
                        <Badge variant="wellness" className="ml-2 text-xs">
                          ✓ Ativo
                        </Badge>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
