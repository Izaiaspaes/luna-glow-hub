import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OnboardingData } from "@/hooks/useOnboarding";

const step1Schema = z.object({
  full_name: z.string().min(1, "Nome completo é obrigatório"),
  social_name: z.string().optional(),
  age: z.number().min(13, "Idade mínima: 13 anos").max(120),
  profession: z.string().optional(),
  current_city: z.string().optional(),
  current_country: z.string().optional(),
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
          <Label htmlFor="full_name">Nome Completo *</Label>
          <Input
            id="full_name"
            {...register("full_name")}
            placeholder="Seu nome completo"
          />
          {errors.full_name && (
            <p className="text-sm text-destructive">{errors.full_name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="social_name">Nome Social / Como gosta de ser chamada</Label>
          <Input
            id="social_name"
            {...register("social_name")}
            placeholder="Apelido ou nome social"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="age">Idade *</Label>
          <Input
            id="age"
            type="number"
            {...register("age", { valueAsNumber: true })}
            placeholder="Sua idade"
          />
          {errors.age && (
            <p className="text-sm text-destructive">{errors.age.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="profession">Profissão / Área de Atuação</Label>
          <Input
            id="profession"
            {...register("profession")}
            placeholder="Sua profissão"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="current_city">Cidade Atual</Label>
            <Input
              id="current_city"
              {...register("current_city")}
              placeholder="Sua cidade"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="current_country">País Atual</Label>
            <Input
              id="current_country"
              {...register("current_country")}
              placeholder="Seu país"
            />
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" variant="hero">
        Próximo
      </Button>
    </form>
  );
}
