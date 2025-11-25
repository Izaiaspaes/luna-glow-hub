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
import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

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

  const form = useForm<NutritionFormData>({
    resolver: zodResolver(getNutritionSchema(t)),
    defaultValues: {
      nutritionDate: new Date().toISOString().split('T')[0],
      mealType: "",
      foodsConsumed: "",
      portionSize: "",
      notes: "",
    },
  });

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nutritionDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("forms.nutrition.date")}</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
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
              <FormLabel>{t("forms.nutrition.mealType")}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("forms.nutrition.mealPlaceholder")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="breakfast">{t("forms.nutrition.breakfast")}</SelectItem>
                  <SelectItem value="lunch">{t("forms.nutrition.lunch")}</SelectItem>
                  <SelectItem value="dinner">{t("forms.nutrition.dinner")}</SelectItem>
                  <SelectItem value="snack">{t("forms.nutrition.snack")}</SelectItem>
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
              <FormLabel>{t("forms.nutrition.foodsConsumed")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("forms.nutrition.foodsPlaceholder")}
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="portionSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("forms.nutrition.portionSize")}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("forms.nutrition.portionPlaceholder")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="small">{t("forms.nutrition.portionSmall")}</SelectItem>
                  <SelectItem value="medium">{t("forms.nutrition.portionMedium")}</SelectItem>
                  <SelectItem value="large">{t("forms.nutrition.portionLarge")}</SelectItem>
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
              <FormLabel>{t("forms.nutrition.notes")}</FormLabel>
              <div className="space-y-2">
                <FormControl>
                  <Textarea
                    placeholder={t("forms.nutrition.notesPlaceholder")}
                    className="min-h-[80px]"
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
          className="w-full"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          {isAnalyzing ? t("forms.nutrition.analyzing") : t("forms.nutrition.analyzeAI")}
        </Button>

        {analysis && (
          <HealthAnalysis analysis={analysis} />
        )}

        <FormItem>
          <FormLabel>{t("forms.nutrition.quality", { quality: nutritionQuality })}</FormLabel>
          <FormControl>
            <Slider
              value={[nutritionQuality]}
              onValueChange={(value) => setNutritionQuality(value[0])}
              max={5}
              min={1}
              step={1}
              className="w-full"
              disabled={!!analysis}
            />
          </FormControl>
        </FormItem>

        <Button 
          ref={submitButtonRef}
          type="submit" 
          disabled={isLoading} 
          className="w-full"
        >
          {isLoading ? t("forms.nutrition.registering") : t("forms.nutrition.save")}
        </Button>
      </form>
    </Form>
  );
}
