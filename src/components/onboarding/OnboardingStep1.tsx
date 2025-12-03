import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OnboardingData } from "@/hooks/useOnboarding";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";

const step1Schema = z.object({
  email: z.string()
    .min(1, "E-mail é obrigatório")
    .email("E-mail inválido")
    .max(255, "E-mail muito longo"),
  password: z.string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .max(72, "Senha muito longa"),
  confirmPassword: z.string()
    .min(1, "Confirme sua senha"),
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
  preferred_name: z.string()
    .min(1, "Nome preferido é obrigatório")
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(50, "Nome muito longo (máximo 50 caracteres)")
    .refine(val => /^[a-zA-ZÀ-ÿ\s'-]+$/.test(val), {
      message: "Nome contém caracteres inválidos"
    }),
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
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type Step1Data = z.infer<typeof step1Schema>;

interface OnboardingStep1Props {
  data: OnboardingData;
  onNext: (data: Partial<OnboardingData> & { email?: string; password?: string }) => void;
  onAutoSave: (data: Partial<OnboardingData>) => void;
  isLoading?: boolean;
  authError?: string | null;
}

export function OnboardingStep1({ data, onNext, onAutoSave, isLoading, authError }: OnboardingStep1Props) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      full_name: data.full_name || "",
      preferred_name: data.preferred_name || "",
      age: data.age || undefined,
      profession: data.profession || "",
      current_city: data.current_city || "",
      current_country: data.current_country || "",
    },
  });

  // Auto-save on field changes (excluding email/password)
  const watchedFields = watch();
  useEffect(() => {
    const subscription = watch((value) => {
      const { email, password, confirmPassword, ...profileData } = value;
      onAutoSave(profileData as Partial<OnboardingData>);
    });
    return () => subscription.unsubscribe();
  }, [watch, onAutoSave]);

  const onSubmit = (formData: Step1Data) => {
    const { confirmPassword, ...dataToSend } = formData;
    onNext(dataToSend);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Crie sua conta</h2>
        <p className="text-muted-foreground">Comece sua jornada de bem-estar com a Luna</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Auto-salvamento ativo</span>
          </div>
        </div>
      </div>

      {/* Auth Error Display */}
      {authError && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
          <p className="text-sm text-destructive flex items-center gap-2">
            <span className="text-base">⚠️</span>
            {authError}
          </p>
        </div>
      )}

      <div className="space-y-4">
        {/* Email & Password Section */}
        <div className="p-4 rounded-lg bg-muted/30 border border-border/50 space-y-4">
          <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Dados de Acesso
          </h3>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" />
              E-mail <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="seu@email.com"
              className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
              maxLength={255}
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <span className="text-base">⚠️</span>
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" />
                Senha <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="Mínimo 6 caracteres"
                  className={`pr-10 ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  maxLength={72}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <span className="text-base">⚠️</span>
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="flex items-center gap-1">
                Confirmar Senha <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  placeholder="Digite a senha novamente"
                  className={`pr-10 ${errors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  maxLength={72}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <span className="text-base">⚠️</span>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <div className="p-4 rounded-lg bg-muted/30 border border-border/50 space-y-4">
          <h3 className="text-sm font-medium text-foreground">Sobre Você</h3>
          
          <div className="space-y-2">
            <Label htmlFor="preferred_name" className="flex items-center gap-1">
              Como gostaria de ser chamada? <span className="text-destructive">*</span>
            </Label>
            <Input
              id="preferred_name"
              {...register("preferred_name")}
              placeholder="Ex: Maria, Mari, Má..."
              className={errors.preferred_name ? "border-destructive focus-visible:ring-destructive" : ""}
              maxLength={50}
            />
            {errors.preferred_name && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <span className="text-base">⚠️</span>
                {errors.preferred_name.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              💬 Este será o nome que usaremos para te chamar no app
            </p>
          </div>

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
      </div>

      <Button type="submit" className="w-full" variant="hero" disabled={isLoading}>
        {isLoading ? "Criando conta..." : "Criar Conta e Continuar"}
      </Button>
      
      <p className="text-xs text-center text-muted-foreground">
        Já tem uma conta?{" "}
        <a href="/auth" className="text-primary hover:underline">
          Faça login
        </a>
      </p>
    </form>
  );
}
