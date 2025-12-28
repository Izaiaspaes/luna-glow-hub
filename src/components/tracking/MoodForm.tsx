import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Smile, CheckCircle2, AlertCircle } from "lucide-react";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { HealthAnalysis } from "@/components/HealthAnalysis";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

const getMoodSchema = (t: (key: string) => string) => z.object({
  mood_date: z.string().min(1, t("forms.mood.dateRequired")),
  mood_type: z.string().optional(),
  mood_level: z.number().min(1).max(5),
  notes: z.string().optional(),
});

type MoodFormData = z.infer<ReturnType<typeof getMoodSchema>>;

interface MoodFormProps {
  userId: string;
  onSuccess: () => void;
}

export function MoodForm({ userId, onSuccess }: MoodFormProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [moodLevel, setMoodLevel] = useState(3);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  
  const { register, handleSubmit, setValue, watch, formState: { errors }, trigger } = useForm<MoodFormData>({
    resolver: zodResolver(getMoodSchema(t)),
    defaultValues: {
      mood_level: 3,
    },
    mode: "onChange",
  });

  const handleFieldBlur = async (fieldName: keyof MoodFormData) => {
    setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
    await trigger(fieldName);
  };

  const getFieldStatus = (fieldName: keyof MoodFormData) => {
    const value = watch(fieldName);
    const hasError = !!errors[fieldName];
    const isTouched = touchedFields[fieldName];
    const hasValue = value !== undefined && value !== "";
    
    if (!isTouched) return "default";
    if (hasError) return "error";
    if (hasValue) return "success";
    return "default";
  };

  useEffect(() => {
    if (analysis && submitButtonRef.current) {
      setTimeout(() => {
        submitButtonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 300);
    }
  }, [analysis]);

  const notesValue = watch("notes");

  const handleAnalyzeDescription = async (description: string) => {
    if (!description) return;
    
    setIsAnalyzing(true);
    try {
      const { data: analysisData, error } = await supabase.functions.invoke('analyze-health-description', {
        body: { 
          description,
          trackingType: 'humor'
        }
      });

      if (error) throw error;
      
      if (analysisData?.quality_score) {
        setMoodLevel(analysisData.quality_score);
      }
      
      setAnalysis(analysisData);
      toast.success(t("forms.mood.analysisComplete"));
    } catch (error) {
      console.error('Error analyzing description:', error);
      toast.error(t("forms.mood.analysisError"));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const onSubmit = async (data: MoodFormData) => {
    setLoading(true);

    const { error } = await supabase
      .from('mood_tracking')
      .insert({
        user_id: userId,
        mood_date: data.mood_date,
        mood_type: data.mood_type || null,
        mood_level: moodLevel,
        notes: data.notes || null,
      });

    setLoading(false);

    if (error) {
      toast.error(t("forms.mood.errorMessage") + error.message);
    } else {
      toast.success(t("forms.mood.successMessage"));
      onSuccess();
    }
  };

  const dateStatus = getFieldStatus("mood_date");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 md:space-y-4">
      <div className="space-y-2">
        <Label htmlFor="mood_date" className="text-base md:text-sm font-medium flex items-center gap-2">
          <Smile className="w-4 h-4" />
          {t("forms.mood.date")}
          {dateStatus === "success" && <CheckCircle2 className="w-4 h-4 text-green-500" />}
          {dateStatus === "error" && <AlertCircle className="w-4 h-4 text-destructive" />}
        </Label>
        <div className="relative">
          <Input
            id="mood_date"
            type="date"
            className={cn(
              "h-12 md:h-10 text-base md:text-sm px-4 transition-all duration-200",
              dateStatus === "success" && "border-green-500 focus-visible:ring-green-500/20",
              dateStatus === "error" && "border-destructive focus-visible:ring-destructive/20"
            )}
            {...register("mood_date")}
            onBlur={() => handleFieldBlur("mood_date")}
          />
        </div>
        {errors.mood_date && (
          <p className="text-sm text-destructive flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="w-3 h-3" />
            {errors.mood_date.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="mood_type" className="text-base md:text-sm font-medium">{t("forms.mood.feeling")}</Label>
        <Select onValueChange={(value) => {
          setValue("mood_type", value);
          setTouchedFields(prev => ({ ...prev, mood_type: true }));
        }}>
          <SelectTrigger className="h-12 md:h-10 text-base md:text-sm">
            <SelectValue placeholder={t("forms.mood.feelingPlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="feliz" className="py-3 md:py-2 text-base md:text-sm">{t("forms.mood.feelingHappy")}</SelectItem>
            <SelectItem value="calma" className="py-3 md:py-2 text-base md:text-sm">{t("forms.mood.feelingCalm")}</SelectItem>
            <SelectItem value="ansiosa" className="py-3 md:py-2 text-base md:text-sm">{t("forms.mood.feelingAnxious")}</SelectItem>
            <SelectItem value="triste" className="py-3 md:py-2 text-base md:text-sm">{t("forms.mood.feelingSad")}</SelectItem>
            <SelectItem value="irritada" className="py-3 md:py-2 text-base md:text-sm">{t("forms.mood.feelingIrritated")}</SelectItem>
            <SelectItem value="energizada" className="py-3 md:py-2 text-base md:text-sm">{t("forms.mood.feelingEnergized")}</SelectItem>
            <SelectItem value="cansada" className="py-3 md:py-2 text-base md:text-sm">{t("forms.mood.feelingTired")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label className="text-base md:text-sm font-medium">{t("forms.mood.intensity", { level: moodLevel })} {analysis && t("forms.mood.intensityAdjusted")}</Label>
        <Slider
          value={[moodLevel]}
          onValueChange={(value) => !analysis && setMoodLevel(value[0])}
          min={1}
          max={5}
          step={1}
          className="py-6 md:py-4"
          disabled={!!analysis}
        />
        <div className="flex justify-between text-sm md:text-xs text-muted-foreground">
          <span>{t("forms.mood.intensityLow")}</span>
          <span>{t("forms.mood.intensityHigh")}</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes" className="text-base md:text-sm font-medium">{t("forms.mood.notes")}</Label>
        <Textarea
          id="notes"
          placeholder={t("forms.mood.notesPlaceholder")}
          className="min-h-[100px] md:min-h-[80px] text-base md:text-sm p-4 resize-none"
          {...register("notes")}
          onChange={(e) => setValue("notes", e.target.value)}
        />
        <div className="flex flex-wrap gap-2 mt-3">
          <VoiceRecorder 
            onTranscription={(text) => {
              setValue("notes", text);
              handleAnalyzeDescription(text);
            }}
            disabled={loading}
          />
          {notesValue && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-10 md:h-8 px-4 text-sm"
              onClick={() => handleAnalyzeDescription(notesValue)}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? t("forms.mood.analyzing") : t("forms.mood.analyzeAI")}
            </Button>
          )}
        </div>
      </div>

      {analysis && (
        <>
          <HealthAnalysis analysis={analysis} />
          <div className="pt-2 pb-1 text-center text-sm text-muted-foreground">
            {t("forms.mood.scrollHint")}
          </div>
        </>
      )}

      <Button 
        ref={submitButtonRef}
        type="submit" 
        className="w-full h-12 md:h-10 text-base md:text-sm font-medium mt-2" 
        variant="hero" 
        disabled={loading}
      >
        {loading ? t("forms.mood.saving") : t("forms.mood.save")}
      </Button>
    </form>
  );
}
