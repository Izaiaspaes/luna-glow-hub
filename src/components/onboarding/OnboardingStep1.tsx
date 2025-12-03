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

const createStep1Schema = (t: (key: string) => string) => z.object({
  email: z.string()
    .min(1, t('onboarding.form.emailRequired'))
    .email(t('onboarding.form.emailInvalid'))
    .max(255, t('onboarding.form.emailTooLong')),
  password: z.string()
    .min(6, t('onboarding.form.passwordRequired'))
    .max(72, t('onboarding.form.passwordTooLong')),
  confirmPassword: z.string()
    .min(1, t('onboarding.form.confirmPasswordRequired')),
  full_name: z.string()
    .min(1, t('onboarding.form.fullNameRequired'))
    .min(3, t('onboarding.form.fullNameMin'))
    .max(100, t('onboarding.form.fullNameMax'))
    .refine(val => val.trim().split(' ').length >= 2, {
      message: t('onboarding.form.fullNameTwoWords')
    })
    .refine(val => /^[a-zA-ZÀ-ÿ\s'-]+$/.test(val), {
      message: t('onboarding.form.invalidCharacters')
    }),
  preferred_name: z.string()
    .min(1, t('onboarding.form.preferredNameRequired'))
    .min(2, t('onboarding.form.preferredNameMin'))
    .max(50, t('onboarding.form.preferredNameMax'))
    .refine(val => /^[a-zA-ZÀ-ÿ\s'-]+$/.test(val), {
      message: t('onboarding.form.invalidCharacters')
    }),
  age: z.number({
    required_error: t('onboarding.form.ageRequired'),
    invalid_type_error: t('onboarding.form.ageInvalid')
  })
    .int(t('onboarding.form.ageInvalid'))
    .min(13, t('onboarding.form.ageMin'))
    .max(120, t('onboarding.form.ageMax')),
  profession: z.string()
    .max(100, t('onboarding.form.professionMax'))
    .optional()
    .or(z.literal("")),
  current_city: z.string()
    .max(100, t('onboarding.form.currentCityMax'))
    .optional()
    .or(z.literal("")),
  current_country: z.string()
    .max(100, t('onboarding.form.currentCountryMax'))
    .optional()
    .or(z.literal("")),
}).refine((data) => data.password === data.confirmPassword, {
  message: t('onboarding.form.passwordsMismatch'),
  path: ["confirmPassword"],
});

type Step1Data = z.infer<ReturnType<typeof createStep1Schema>>;

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
  
  const step1Schema = createStep1Schema(t);
  
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
        <h2 className="text-2xl font-semibold text-foreground">{t('onboarding.form.createAccount')}</h2>
        <p className="text-muted-foreground">{t('onboarding.form.startJourney')}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>{t('onboarding.form.autoSaveActive')}</span>
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
            {t('onboarding.form.accessData')}
          </h3>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" />
              {t('onboarding.form.email')} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder={t('onboarding.form.emailPlaceholder')}
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
                {t('onboarding.form.password')} <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder={t('onboarding.form.passwordPlaceholder')}
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
                {t('onboarding.form.confirmPassword')} <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  placeholder={t('onboarding.form.confirmPasswordPlaceholder')}
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
          <h3 className="text-sm font-medium text-foreground">{t('onboarding.form.aboutYou')}</h3>
          
          <div className="space-y-2">
            <Label htmlFor="preferred_name" className="flex items-center gap-1">
              {t('onboarding.form.preferredName')} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="preferred_name"
              {...register("preferred_name")}
              placeholder={t('onboarding.form.preferredNamePlaceholder')}
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
              {t('onboarding.form.preferredNameHint')}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="full_name" className="flex items-center gap-1">
              {t('onboarding.form.fullName')} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="full_name"
              {...register("full_name")}
              placeholder={t('onboarding.form.fullNamePlaceholder')}
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
              {t('onboarding.form.fullNameHint')}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="age" className="flex items-center gap-1">
              {t('onboarding.form.age')} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="age"
              type="number"
              {...register("age", { valueAsNumber: true })}
              placeholder={t('onboarding.form.agePlaceholder')}
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
              {t('onboarding.form.ageHint')}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="profession">{t('onboarding.form.profession')}</Label>
            <Input
              id="profession"
              {...register("profession")}
              placeholder={t('onboarding.form.professionPlaceholder')}
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
              <Label htmlFor="current_city">{t('onboarding.form.currentCity')}</Label>
              <Input
                id="current_city"
                {...register("current_city")}
                placeholder={t('onboarding.form.currentCityPlaceholder')}
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
              <Label htmlFor="current_country">{t('onboarding.form.currentCountry')}</Label>
              <Input
                id="current_country"
                {...register("current_country")}
                placeholder={t('onboarding.form.currentCountryPlaceholder')}
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
        {isLoading ? t('onboarding.form.creatingAccount') : t('onboarding.form.createAccountButton')}
      </Button>
      
      <p className="text-xs text-center text-muted-foreground">
        {t('onboarding.form.alreadyHaveAccount')}{" "}
        <a href="/auth" className="text-primary hover:underline">
          {t('onboarding.form.loginLink')}
        </a>
      </p>
    </form>
  );
}
