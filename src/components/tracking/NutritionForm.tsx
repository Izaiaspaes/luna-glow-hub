import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState, useRef, useEffect } from "react";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { HealthAnalysis } from "@/components/HealthAnalysis";
import { Sparkles, CheckCircle2, AlertCircle, Utensils } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

const getNutritionSchema = (t: (key: string) => string) => z.object({
  nutritionDate: z.string(),
  mealType: z.string().optional(),
  foodsConsumed: z.string().min(1, t("forms.nutrition.foodsRequired")),
  portionSize: z.string().optional(),
  notes: z.string().optional(),
});

type NutritionFormData = z.infer<ReturnType<typeof getNutritionSchema>>;

interface NutritionFormProps {
  userId: string;
  onSuccess: () => void;
}

export function NutritionForm({ userId, onSuccess }: NutritionFormProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [nutritionQuality, setNutritionQuality] = useState<number>(3);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  const form = useForm<NutritionFormData>({
    resolver: zodResolver(getNutritionSchema(t)),
    defaultValues: {
      nutritionDate: new Date().toISOString().split('T')[0],
      mealType: "",
      foodsConsumed: "",
      portionSize: "",
      notes: "",
    },
    mode: "onChange",
  });

  const getFieldStatus = (fieldName: keyof NutritionFormData) => {
    const value = form.watch(fieldName);
    const hasError = !!form.formState.errors[fieldName];
    const isTouched = touchedFields[fieldName];
    const hasValue = value !== undefined && value !== "";
    
    if (!isTouched) return "default";
    if (hasError) return "error";
    if (hasValue) return "success";
    return "default";
  };

  useEffect(() => {
    if (analysis && submitButtonRef.current) {
      submitButtonRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [analysis]);

  const handleAnalyzeDescription = async () => {
    const foodsConsumed = form.getValues('foodsConsumed');
    const notes = form.getValues('notes');
    const description = `${foodsConsumed}${notes ? ` - ${notes}` : ''}`;
    
    if (!description.trim()) {
      toast({
        title: t("forms.nutrition.errorMessage"),
        description: t("forms.nutrition.analysisRequirement"),
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-health-description', {
        body: {
          description,
          trackingType: 'nutrition'
        }
      });

      if (error) throw error;

      if (data.qualityScore) {
        setNutritionQuality(data.qualityScore);
      }
      
      setAnalysis(data);
      
      toast({
        title: t("forms.nutrition.analysisComplete"),
        description: t("forms.nutrition.analysisCompleteDesc"),
      });
    } catch (error: any) {
      console.error('Error analyzing description:', error);
      toast({
        title: t("forms.nutrition.analysisError"),
        description: error.message || t("forms.nutrition.analysisErrorRetry"),
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const onSubmit = async (data: NutritionFormData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.from("nutrition_tracking").insert({
        user_id: userId,
        nutrition_date: data.nutritionDate,
        meal_type: data.mealType,
        foods_consumed: data.foodsConsumed,
        portion_size: data.portionSize,
        notes: data.notes,
        nutrition_quality: nutritionQuality,
      });

      if (error) throw error;

      toast({
        title: t("forms.nutrition.successMessage"),
        description: t("forms.nutrition.successDesc"),
      });

      form.reset();
      setAnalysis(null);
      setNutritionQuality(3);
      onSuccess();
    } catch (error: any) {
      toast({
        title: t("forms.nutrition.errorMessage"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const foodsStatus = getFieldStatus("foodsConsumed");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 md:space-y-6">
        <FormField
          control={form.control}
          name="nutritionDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base md:text-sm font-medium flex items-center gap-2">
                <Utensils className="w-4 h-4" />
                {t("forms.nutrition.date")}
              </FormLabel>
              <FormControl>
                <Input 
                  type="date" 
                  className="h-12 md:h-10 text-base md:text-sm px-4"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mealType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base md:text-sm font-medium">{t("forms.nutrition.mealType")}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12 md:h-10 text-base md:text-sm">
                    <SelectValue placeholder={t("forms.nutrition.mealPlaceholder")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="breakfast" className="py-3 md:py-2 text-base md:text-sm">{t("forms.nutrition.breakfast")}</SelectItem>
                  <SelectItem value="lunch" className="py-3 md:py-2 text-base md:text-sm">{t("forms.nutrition.lunch")}</SelectItem>
                  <SelectItem value="dinner" className="py-3 md:py-2 text-base md:text-sm">{t("forms.nutrition.dinner")}</SelectItem>
                  <SelectItem value="snack" className="py-3 md:py-2 text-base md:text-sm">{t("forms.nutrition.snack")}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="foodsConsumed"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base md:text-sm font-medium flex items-center gap-2">
                {t("forms.nutrition.foodsConsumed")}
                {foodsStatus === "success" && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                {foodsStatus === "error" && <AlertCircle className="w-4 h-4 text-destructive" />}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("forms.nutrition.foodsPlaceholder")}
                  className={cn(
                    "min-h-[120px] md:min-h-[100px] text-base md:text-sm p-4 resize-none transition-all duration-200",
                    foodsStatus === "success" && "border-green-500 focus-visible:ring-green-500/20",
                    foodsStatus === "error" && "border-destructive focus-visible:ring-destructive/20"
                  )}
                  {...field}
                  onBlur={() => setTouchedFields(prev => ({ ...prev, foodsConsumed: true }))}
                />
              </FormControl>
              <FormMessage className="flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                {form.formState.errors.foodsConsumed && <AlertCircle className="w-3 h-3" />}
              </FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="portionSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base md:text-sm font-medium">{t("forms.nutrition.portionSize")}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12 md:h-10 text-base md:text-sm">
                    <SelectValue placeholder={t("forms.nutrition.portionPlaceholder")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="small" className="py-3 md:py-2 text-base md:text-sm">{t("forms.nutrition.portionSmall")}</SelectItem>
                  <SelectItem value="medium" className="py-3 md:py-2 text-base md:text-sm">{t("forms.nutrition.portionMedium")}</SelectItem>
                  <SelectItem value="large" className="py-3 md:py-2 text-base md:text-sm">{t("forms.nutrition.portionLarge")}</SelectItem>
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
              <FormLabel className="text-base md:text-sm font-medium">{t("forms.nutrition.notes")}</FormLabel>
              <div className="space-y-3">
                <FormControl>
                  <Textarea
                    placeholder={t("forms.nutrition.notesPlaceholder")}
                    className="min-h-[100px] md:min-h-[80px] text-base md:text-sm p-4 resize-none"
                    {...field}
                  />
                </FormControl>
                <VoiceRecorder
                  onTranscription={(text) => {
                    const currentNotes = form.getValues('notes') || '';
                    form.setValue('notes', currentNotes ? `${currentNotes} ${text}` : text);
                  }}
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="button"
          variant="outline"
          onClick={handleAnalyzeDescription}
          disabled={isAnalyzing}
          className="w-full h-12 md:h-10 text-base md:text-sm"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          {isAnalyzing ? t("forms.nutrition.analyzing") : t("forms.nutrition.analyzeAI")}
        </Button>

        {analysis && (
          <HealthAnalysis analysis={analysis} />
        )}

        <FormItem>
          <FormLabel className="text-base md:text-sm font-medium">{t("forms.nutrition.quality", { quality: nutritionQuality })}</FormLabel>
          <FormControl>
            <Slider
              value={[nutritionQuality]}
              onValueChange={(value) => setNutritionQuality(value[0])}
              max={5}
              min={1}
              step={1}
              className="w-full py-6 md:py-4"
              disabled={!!analysis}
            />
          </FormControl>
        </FormItem>

        <Button 
          ref={submitButtonRef}
          type="submit" 
          disabled={isLoading} 
          className="w-full h-12 md:h-10 text-base md:text-sm font-medium mt-2"
        >
          {isLoading ? t("forms.nutrition.registering") : t("forms.nutrition.save")}
        </Button>
      </form>
    </Form>
  );
}
