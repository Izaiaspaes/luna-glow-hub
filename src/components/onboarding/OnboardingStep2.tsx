import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OnboardingData } from "@/hooks/useOnboarding";
import { DatePicker } from "@/components/ui/date-picker";
import { format } from "date-fns";
import { useState } from "react";

const step2Schema = z.object({
  birth_date: z.string()
    .min(1, "Data de nascimento é obrigatória")
    .refine(val => {
      const date = new Date(val);
      const now = new Date();
      const minDate = new Date("1900-01-01");
      return date <= now && date >= minDate;
    }, {
      message: "Data de nascimento inválida"
    }),
  birth_time: z.string()
    .optional()
    .refine(val => !val || /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val), {
      message: "Horário inválido (use formato HH:MM)"
    })
    .or(z.literal("")),
  birth_city: z.string()
    .min(1, "Cidade de nascimento é obrigatória")
    .min(2, "Nome da cidade deve ter pelo menos 2 caracteres")
    .max(100, "Nome da cidade muito longo"),
  birth_country: z.string()
    .min(1, "País de nascimento é obrigatório")
    .min(2, "Nome do país deve ter pelo menos 2 caracteres")
    .max(100, "Nome do país muito longo"),
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
          <Label className="flex items-center gap-1">
            Data de Nascimento <span className="text-destructive">*</span>
          </Label>
          <DatePicker
            date={selectedDate}
            onDateChange={(date) => {
              setSelectedDate(date);
              if (date) {
                setValue("birth_date", format(date, "yyyy-MM-dd"), { shouldValidate: true });
              }
            }}
            disabled={(date) =>
              date > new Date() || date < new Date("1900-01-01")
            }
            placeholder="Selecione sua data de nascimento"
          />
          {errors.birth_date && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <span className="text-base">⚠️</span>
              {errors.birth_date.message}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            💡 Digite manualmente (dd/mm/aaaa) ou clique no calendário
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="birth_time">Horário de Nascimento</Label>
          <Input
            id="birth_time"
            type="time"
            {...register("birth_time")}
            className={errors.birth_time ? "border-destructive focus-visible:ring-destructive" : ""}
          />
          {errors.birth_time && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <span className="text-base">⚠️</span>
              {errors.birth_time.message}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            ✨ Opcional, mas recomendado para um mapa astral mais preciso
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="birth_city" className="flex items-center gap-1">
              Cidade de Nascimento <span className="text-destructive">*</span>
            </Label>
            <Input
              id="birth_city"
              {...register("birth_city")}
              placeholder="Ex: Rio de Janeiro"
              className={errors.birth_city ? "border-destructive focus-visible:ring-destructive" : ""}
              maxLength={100}
            />
            {errors.birth_city && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <span className="text-base">⚠️</span>
                {errors.birth_city.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="birth_country" className="flex items-center gap-1">
              País de Nascimento <span className="text-destructive">*</span>
            </Label>
            <Input
              id="birth_country"
              {...register("birth_country")}
              placeholder="Ex: Brasil"
              className={errors.birth_country ? "border-destructive focus-visible:ring-destructive" : ""}
              maxLength={100}
            />
            {errors.birth_country && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <span className="text-base">⚠️</span>
                {errors.birth_country.message}
              </p>
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
