import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Briefcase } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useWorkTracking } from "@/hooks/useWorkTracking";

const workFormSchema = z.object({
  work_date: z.date({
    required_error: "Selecione uma data",
  }),
  routine_type: z.enum(['fixed', 'variable', 'shift'], {
    required_error: "Selecione o tipo de rotina",
  }),
  hours_worked: z.number({
    required_error: "Informe as horas trabalhadas",
  }).min(0).max(24),
  shift_type: z.enum(['day', 'night', 'mixed', 'off']).optional(),
  notes: z.string().optional(),
});

type WorkFormValues = z.infer<typeof workFormSchema>;

export function WorkForm() {
  const { saveWorkData } = useWorkTracking();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<WorkFormValues>({
    resolver: zodResolver(workFormSchema),
    defaultValues: {
      work_date: new Date(),
      routine_type: 'fixed',
      hours_worked: 8,
      shift_type: 'day',
      notes: '',
    },
  });

  const onSubmit = async (values: WorkFormValues) => {
    setIsSubmitting(true);
    try {
      await saveWorkData({
        work_date: values.work_date.toISOString().split('T')[0],
        routine_type: values.routine_type,
        hours_worked: values.hours_worked,
        shift_type: values.shift_type,
        notes: values.notes,
      });
      form.reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Registrar Rotina de Trabalho
        </CardTitle>
        <CardDescription>
          Registre suas horas de trabalho e receba orientações automáticas de autocuidado
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="work_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP", { locale: ptBR })
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        locale={ptBR}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="routine_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Rotina</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="fixed">Horário Fixo</SelectItem>
                      <SelectItem value="variable">Horários Variáveis</SelectItem>
                      <SelectItem value="shift">Escala de Plantão</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hours_worked"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Horas Trabalhadas</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max="24"
                      step="0.5"
                      placeholder="8"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shift_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Turno (Opcional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o turno" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="day">Diurno</SelectItem>
                      <SelectItem value="night">Noturno</SelectItem>
                      <SelectItem value="mixed">Misto</SelectItem>
                      <SelectItem value="off">Folga / Não trabalhei</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Como foi seu dia de trabalho?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar Registro"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
