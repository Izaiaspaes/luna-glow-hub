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
import { Zap } from "lucide-react";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { HealthAnalysis } from "@/components/HealthAnalysis";
import { useTranslation } from "react-i18next";

const getEnergySchema = (t: (key: string) => string) => z.object({
  energy_date: z.string().min(1, t("forms.energy.dateRequired")),
  time_of_day: z.string().optional(),
  energy_level: z.number().min(1).max(5),
  notes: z.string().optional(),
});

type EnergyFormData = z.infer<ReturnType<typeof getEnergySchema>>;

interface EnergyFormProps {
  userId: string;
  onSuccess: () => void;
}

export function EnergyForm({ userId, onSuccess }: EnergyFormProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [energyLevel, setEnergyLevel] = useState(3);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<EnergyFormData>({
    resolver: zodResolver(getEnergySchema(t)),
    defaultValues: {
      energy_level: 3,
    },
  });

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
          trackingType: 'energia'
        }
      });

      if (error) throw error;
      
      if (analysisData?.quality_score) {
        setEnergyLevel(analysisData.quality_score);
      }
      
      setAnalysis(analysisData);
      toast.success(t("forms.energy.analysisComplete"));
    } catch (error) {
      console.error('Error analyzing description:', error);
      toast.error(t("forms.energy.analysisError"));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const onSubmit = async (data: EnergyFormData) => {
    setLoading(true);

    const { error } = await supabase
      .from('energy_tracking')
      .insert({
        user_id: userId,
        energy_date: data.energy_date,
        time_of_day: data.time_of_day || null,
        energy_level: energyLevel,
        notes: data.notes || null,
      });

    setLoading(false);

    if (error) {
      toast.error(t("forms.energy.errorMessage") + error.message);
    } else {
      toast.success(t("forms.energy.successMessage"));
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 md:space-y-4">
      <div className="space-y-2">
        <Label htmlFor="energy_date" className="text-base md:text-sm font-medium">
          <Zap className="w-4 h-4 inline mr-2" />
          {t("forms.energy.date")}
        </Label>
        <Input
          id="energy_date"
          type="date"
          className="h-12 md:h-10 text-base md:text-sm px-4"
          {...register("energy_date")}
        />
        {errors.energy_date && (
          <p className="text-sm text-destructive">{errors.energy_date.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="time_of_day" className="text-base md:text-sm font-medium">{t("forms.energy.timeOfDay")}</Label>
        <Select onValueChange={(value) => setValue("time_of_day", value)}>
          <SelectTrigger className="h-12 md:h-10 text-base md:text-sm">
            <SelectValue placeholder={t("forms.energy.timePlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="manha" className="py-3 md:py-2 text-base md:text-sm">{t("forms.energy.timeMorning")}</SelectItem>
            <SelectItem value="tarde" className="py-3 md:py-2 text-base md:text-sm">{t("forms.energy.timeAfternoon")}</SelectItem>
            <SelectItem value="noite" className="py-3 md:py-2 text-base md:text-sm">{t("forms.energy.timeNight")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label className="text-base md:text-sm font-medium">{t("forms.energy.level", { level: energyLevel })} {analysis && t("forms.energy.levelAdjusted")}</Label>
        <Slider
          value={[energyLevel]}
          onValueChange={(value) => !analysis && setEnergyLevel(value[0])}
          min={1}
          max={5}
          step={1}
          className="py-6 md:py-4"
          disabled={!!analysis}
        />
        <div className="flex justify-between text-sm md:text-xs text-muted-foreground">
          <span>{t("forms.energy.levelExhausted")}</span>
          <span>{t("forms.energy.levelEnergized")}</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes" className="text-base md:text-sm font-medium">{t("forms.energy.notes")}</Label>
        <Textarea
          id="notes"
          placeholder={t("forms.energy.notesPlaceholder")}
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
              {isAnalyzing ? t("forms.energy.analyzing") : t("forms.energy.analyzeAI")}
            </Button>
          )}
        </div>
      </div>

      {analysis && (
        <>
          <HealthAnalysis analysis={analysis} />
          <div className="pt-2 pb-1 text-center text-sm text-muted-foreground">
            {t("forms.energy.scrollHint")}
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
        {loading ? t("forms.energy.saving") : t("forms.energy.save")}
      </Button>
    </form>
  );
}
