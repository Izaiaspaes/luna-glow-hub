import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OnboardingData } from "@/hooks/useOnboarding";

const step1Schema = z.object({
  full_name: z.string()
    .min(1, "Nome completo é obrigatório")
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome muito longo (máximo 100 caracteres)")
    .refine(val => val.trim().split(' ').length >= 2, {
      message: "Por favor, informe nome e sobrenome"
    })
    .refine(val => /^[a-zA-ZÀ-ÿ\s'-]+$/.test(val), {
      message: "Nome contém caracteres inválidos"
    }),
  social_name: z.string()
    .max(50, "Nome social muito longo (máximo 50 caracteres)")
    .optional()
    .or(z.literal("")),
  age: z.number({
    required_error: "Idade é obrigatória",
    invalid_type_error: "Digite um número válido"
  })
    .int("Idade deve ser um número inteiro")
    .min(13, "Você deve ter pelo menos 13 anos para usar o Luna")
    .max(120, "Por favor, verifique a idade digitada"),
  profession: z.string()
    .max(100, "Profissão muito longa (máximo 100 caracteres)")
    .optional()
    .or(z.literal("")),
  current_city: z.string()
    .max(100, "Nome da cidade muito longo")
    .optional()
    .or(z.literal("")),
  current_country: z.string()
    .max(100, "Nome do país muito longo")
    .optional()
    .or(z.literal("")),
});

type Step1Data = z.infer<typeof step1Schema>;

interface OnboardingStep1Props {
  data: OnboardingData;
  onNext: (data: Partial<OnboardingData>) => void;
}

export function OnboardingStep1({ data, onNext }: OnboardingStep1Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      full_name: data.full_name || "",
      social_name: data.social_name || "",
      age: data.age || undefined,
      profession: data.profession || "",
      current_city: data.current_city || "",
      current_country: data.current_country || "",
    },
  });

  const onSubmit = (formData: Step1Data) => {
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Sobre Você</h2>
        <p className="text-muted-foreground">Vamos começar com suas informações básicas</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="full_name" className="flex items-center gap-1">
            Nome Completo <span className="text-destructive">*</span>
          </Label>
          <Input
            id="full_name"
            {...register("full_name")}
            placeholder="Ex: Maria Silva Santos"
            className={errors.full_name ? "border-destructive focus-visible:ring-destructive" : ""}
            maxLength={100}
          />
          {errors.full_name && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <span className="text-base">⚠️</span>
              {errors.full_name.message}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Nome e sobrenome para personalizar sua experiência
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="social_name">Nome Social / Como gosta de ser chamada</Label>
          <Input
            id="social_name"
            {...register("social_name")}
            placeholder="Apelido ou nome social"
            className={errors.social_name ? "border-destructive focus-visible:ring-destructive" : ""}
            maxLength={50}
          />
          {errors.social_name && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <span className="text-base">⚠️</span>
              {errors.social_name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="age" className="flex items-center gap-1">
            Idade <span className="text-destructive">*</span>
          </Label>
          <Input
            id="age"
            type="number"
            {...register("age", { valueAsNumber: true })}
            placeholder="Digite sua idade"
            className={errors.age ? "border-destructive focus-visible:ring-destructive" : ""}
            min={13}
            max={120}
          />
          {errors.age && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <span className="text-base">⚠️</span>
              {errors.age.message}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Idade mínima: 13 anos
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="profession">Profissão / Área de Atuação</Label>
          <Input
            id="profession"
            {...register("profession")}
            placeholder="Ex: Professora, Designer, Estudante..."
            className={errors.profession ? "border-destructive focus-visible:ring-destructive" : ""}
            maxLength={100}
          />
          {errors.profession && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <span className="text-base">⚠️</span>
              {errors.profession.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="current_city">Cidade Atual</Label>
            <Input
              id="current_city"
              {...register("current_city")}
              placeholder="Ex: São Paulo"
              className={errors.current_city ? "border-destructive focus-visible:ring-destructive" : ""}
              maxLength={100}
            />
            {errors.current_city && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <span className="text-base">⚠️</span>
                {errors.current_city.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="current_country">País Atual</Label>
            <Input
              id="current_country"
              {...register("current_country")}
              placeholder="Ex: Brasil"
              className={errors.current_country ? "border-destructive focus-visible:ring-destructive" : ""}
              maxLength={100}
            />
            {errors.current_country && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <span className="text-base">⚠️</span>
                {errors.current_country.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" variant="hero">
        Próximo
      </Button>
    </form>
  );
}
