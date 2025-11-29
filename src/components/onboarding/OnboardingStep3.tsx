import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { OnboardingData } from "@/hooks/useOnboarding";

const step3Schema = z.object({
  weight: z.number({
    invalid_type_error: "Digite um número válido"
  })
    .min(30, "Peso deve ser no mínimo 30kg")
    .max(300, "Peso deve ser no máximo 300kg")
    .optional()
    .or(z.nan()),
  height: z.number({
    invalid_type_error: "Digite um número válido"
  })
    .int("Altura deve ser um número inteiro")
    .min(100, "Altura deve ser no mínimo 100cm")
    .max(250, "Altura deve ser no máximo 250cm")
    .optional()
    .or(z.nan()),
  body_shapes: z.array(z.string())
    .max(3, "Selecione no máximo 3 formatos de corpo")
    .optional(),
  skin_tone: z.string().optional(),
  skin_types: z.array(z.string())
    .max(4, "Selecione no máximo 4 tipos de pele")
    .optional(),
  eye_color: z.string().optional(),
  hair_color: z.string()
    .max(50, "Descrição muito longa")
    .optional()
    .or(z.literal("")),
  hair_type: z.string().optional(),
  hair_length: z.string().optional(),
  nail_preference: z.string().optional(),
});

type Step3Data = z.infer<typeof step3Schema>;

interface OnboardingStep3Props {
  data: OnboardingData;
  onNext: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
  onAutoSave: (data: Partial<OnboardingData>) => void;
}

const bodyShapes = ["Retângulo", "Ampulheta", "Pêra/Triangular", "Triângulo Invertido", "Oval/Redondo"];
const skinTones = ["Muito Clara", "Clara", "Morena Clara", "Morena", "Negra", "Outra"];
const skinTypes = ["Normal", "Seca", "Oleosa", "Mista", "Sensível", "Acneica"];
const eyeColors = ["Castanhos Claros", "Castanhos Escuros", "Verdes", "Azuis", "Mel", "Pretos", "Outra"];
const hairTypes = ["Liso", "Ondulado", "Cacheado", "Crespo"];
const hairLengths = ["Curto", "Médio", "Longo"];

export function OnboardingStep3({ data, onNext, onBack, onAutoSave }: OnboardingStep3Props) {
  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      weight: data.weight,
      height: data.height,
      body_shapes: data.body_shapes || [],
      skin_tone: data.skin_tone || "",
      skin_types: data.skin_types || [],
      eye_color: data.eye_color || "",
      hair_color: data.hair_color || "",
      hair_type: data.hair_type || "",
      hair_length: data.hair_length || "",
      nail_preference: data.nail_preference || "",
    },
  });

  // Auto-save on field changes
  useEffect(() => {
    const subscription = watch((value) => {
      onAutoSave(value as Partial<OnboardingData>);
    });
    return () => subscription.unsubscribe();
  }, [watch, onAutoSave]);

  const selectedBodyShapes = watch("body_shapes") || [];
  const selectedSkinTypes = watch("skin_types") || [];

  const onSubmit = (formData: Step3Data) => {
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Sua Aparência</h2>
        <p className="text-muted-foreground">
          Essas informações são opcionais e nos ajudam a personalizar recomendações
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="weight">Peso (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              {...register("weight", { valueAsNumber: true })}
              placeholder="Ex: 65.5"
              className={errors.weight ? "border-destructive focus-visible:ring-destructive" : ""}
              min={30}
              max={300}
            />
            {errors.weight && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <span className="text-base">⚠️</span>
                {errors.weight.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Opcional (30-300kg)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="height">Altura (cm)</Label>
            <Input
              id="height"
              type="number"
              {...register("height", { valueAsNumber: true })}
              placeholder="Ex: 165"
              className={errors.height ? "border-destructive focus-visible:ring-destructive" : ""}
              min={100}
              max={250}
            />
            {errors.height && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <span className="text-base">⚠️</span>
                {errors.height.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Opcional (100-250cm)
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Formato do Corpo</Label>
          <div className="grid grid-cols-2 gap-2">
            {bodyShapes.map((shape) => (
              <div key={shape} className="flex items-center space-x-2">
                <Checkbox
                  id={`body-${shape}`}
                  checked={selectedBodyShapes.includes(shape)}
                  disabled={selectedBodyShapes.length >= 3 && !selectedBodyShapes.includes(shape)}
                  onCheckedChange={(checked) => {
                    const newShapes = checked
                      ? [...selectedBodyShapes, shape]
                      : selectedBodyShapes.filter((s) => s !== shape);
                    setValue("body_shapes", newShapes, { shouldValidate: true });
                  }}
                />
                <Label htmlFor={`body-${shape}`} className="font-normal cursor-pointer">
                  {shape}
                </Label>
              </div>
            ))}
          </div>
          {errors.body_shapes && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <span className="text-base">⚠️</span>
              {errors.body_shapes.message}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Opcional - Selecione até 3 opções
          </p>
        </div>

        <div className="space-y-2">
          <Label>Tom de Pele</Label>
          <Controller
            control={control}
            name="skin_tone"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {skinTones.map((tone) => (
                    <SelectItem key={tone} value={tone}>
                      {tone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label>Tipo de Pele</Label>
          <div className="grid grid-cols-2 gap-2">
            {skinTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`skin-${type}`}
                  checked={selectedSkinTypes.includes(type)}
                  disabled={selectedSkinTypes.length >= 4 && !selectedSkinTypes.includes(type)}
                  onCheckedChange={(checked) => {
                    const newTypes = checked
                      ? [...selectedSkinTypes, type]
                      : selectedSkinTypes.filter((t) => t !== type);
                    setValue("skin_types", newTypes, { shouldValidate: true });
                  }}
                />
                <Label htmlFor={`skin-${type}`} className="font-normal cursor-pointer">
                  {type}
                </Label>
              </div>
            ))}
          </div>
          {errors.skin_types && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <span className="text-base">⚠️</span>
              {errors.skin_types.message}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Opcional - Selecione até 4 opções
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Cor dos Olhos</Label>
            <Controller
              control={control}
              name="eye_color"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {eyeColors.map((color) => (
                      <SelectItem key={color} value={color}>
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hair_color">Cor do Cabelo Atual</Label>
            <Input
              id="hair_color"
              {...register("hair_color")}
              placeholder="Ex: castanho, loiro..."
              className={errors.hair_color ? "border-destructive focus-visible:ring-destructive" : ""}
              maxLength={50}
            />
            {errors.hair_color && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <span className="text-base">⚠️</span>
                {errors.hair_color.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Tipo de Cabelo</Label>
            <Controller
              control={control}
              name="hair_type"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {hairTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Comprimento do Cabelo</Label>
            <Controller
              control={control}
              name="hair_length"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {hairLengths.map((length) => (
                      <SelectItem key={length} value={length}>
                        {length}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
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
