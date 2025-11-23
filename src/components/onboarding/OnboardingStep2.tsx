import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OnboardingData } from "@/hooks/useOnboarding";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useState } from "react";

const step2Schema = z.object({
  birth_date: z.string().min(1, "Data de nascimento é obrigatória"),
  birth_time: z.string().optional(),
  birth_city: z.string().min(1, "Cidade de nascimento é obrigatória"),
  birth_country: z.string().min(1, "País de nascimento é obrigatório"),
});

type Step2Data = z.infer<typeof step2Schema>;

interface OnboardingStep2Props {
  data: OnboardingData;
  onNext: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
}

export function OnboardingStep2({ data, onNext, onBack }: OnboardingStep2Props) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    data.birth_date ? new Date(data.birth_date) : undefined
  );

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      birth_date: data.birth_date || "",
      birth_time: data.birth_time || "",
      birth_city: data.birth_city || "",
      birth_country: data.birth_country || "",
    },
  });

  const onSubmit = (formData: Step2Data) => {
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Seu Nascimento</h2>
        <p className="text-muted-foreground">
          Essas informações nos ajudarão a criar seu mini mapa astral
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Data de Nascimento *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? (
                  format(selectedDate, "PPP", { locale: ptBR })
                ) : (
                  <span>Selecione a data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  if (date) {
                    setValue("birth_date", format(date, "yyyy-MM-dd"));
                  }
                }}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          {errors.birth_date && (
            <p className="text-sm text-destructive">{errors.birth_date.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="birth_time">Horário de Nascimento</Label>
          <Input
            id="birth_time"
            type="time"
            {...register("birth_time")}
          />
          <p className="text-xs text-muted-foreground">
            Opcional, mas recomendado para um mapa mais preciso
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="birth_city">Cidade de Nascimento *</Label>
            <Input
              id="birth_city"
              {...register("birth_city")}
              placeholder="Cidade onde nasceu"
            />
            {errors.birth_city && (
              <p className="text-sm text-destructive">{errors.birth_city.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="birth_country">País de Nascimento *</Label>
            <Input
              id="birth_country"
              {...register("birth_country")}
              placeholder="País onde nasceu"
            />
            {errors.birth_country && (
              <p className="text-sm text-destructive">{errors.birth_country.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={onBack} className="w-full">
          Voltar
        </Button>
        <Button type="submit" variant="hero" className="w-full">
          Próximo
        </Button>
      </div>
    </form>
  );
}
