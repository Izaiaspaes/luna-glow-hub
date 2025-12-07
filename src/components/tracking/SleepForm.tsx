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
import { toast } from "sonner";
import { Moon } from "lucide-react";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { HealthAnalysis } from "@/components/HealthAnalysis";
import { useTranslation } from "react-i18next";

interface SleepFormProps {
  userId: string;
  onSuccess: () => void;
}

export function SleepForm({ userId, onSuccess }: SleepFormProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [sleepQuality, setSleepQuality] = useState(3);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const sleepSchema = z.object({
    sleep_date: z.string().min(1, t('forms.sleep.dateRequired')),
    bedtime: z.string().optional(),
    wake_time: z.string().optional(),
    sleep_quality: z.number().min(1).max(5),
    notes: z.string().optional(),
  });

  type SleepFormData = z.infer<typeof sleepSchema>;
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<SleepFormData>({
    resolver: zodResolver(sleepSchema),
    defaultValues: {
      sleep_quality: 3,
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
          trackingType: 'sono'
        }
      });

      if (error) throw error;
      
      if (analysisData?.quality_score) {
        setSleepQuality(analysisData.quality_score);
      }
      
      setAnalysis(analysisData);
      toast.success(t('forms.sleep.analysisComplete'));
    } catch (error) {
      console.error('Error analyzing description:', error);
      toast.error(t('forms.sleep.analysisError'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const onSubmit = async (data: SleepFormData) => {
    setLoading(true);
    
    // Calculate duration if both times are provided
    let duration = null;
    if (data.bedtime && data.wake_time) {
      const bedTime = new Date(`2000-01-01T${data.bedtime}`);
      let wakeTime = new Date(`2000-01-01T${data.wake_time}`);
      
      // If wake time is before bed time, assume next day
      if (wakeTime < bedTime) {
        wakeTime = new Date(`2000-01-02T${data.wake_time}`);
      }
      
      duration = (wakeTime.getTime() - bedTime.getTime()) / (1000 * 60 * 60); // hours
    }

    const { error } = await supabase
      .from('sleep_tracking')
      .insert({
        user_id: userId,
        sleep_date: data.sleep_date,
        bedtime: data.bedtime || null,
        wake_time: data.wake_time || null,
        sleep_duration_hours: duration,
        sleep_quality: sleepQuality,
        notes: data.notes || null,
      });

    setLoading(false);

    if (error) {
      toast.error(t('forms.sleep.errorMessage') + error.message);
    } else {
      toast.success(t('forms.sleep.successMessage'));
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 md:space-y-4">
      <div className="space-y-2">
        <Label htmlFor="sleep_date" className="text-base md:text-sm font-medium">
          <Moon className="w-4 h-4 inline mr-2" />
          {t('forms.sleep.date')}
        </Label>
        <Input
          id="sleep_date"
          type="date"
          className="h-12 md:h-10 text-base md:text-sm px-4"
          {...register("sleep_date")}
        />
        {errors.sleep_date && (
          <p className="text-sm text-destructive">{errors.sleep_date.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <div className="space-y-2">
          <Label htmlFor="bedtime" className="text-base md:text-sm font-medium">{t('forms.sleep.bedtime')}</Label>
          <Input
            id="bedtime"
            type="time"
            className="h-12 md:h-10 text-base md:text-sm px-4"
            {...register("bedtime")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="wake_time" className="text-base md:text-sm font-medium">{t('forms.sleep.wakeTime')}</Label>
          <Input
            id="wake_time"
            type="time"
            className="h-12 md:h-10 text-base md:text-sm px-4"
            {...register("wake_time")}
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-base md:text-sm font-medium">
          {t('forms.sleep.quality', { quality: sleepQuality })} {analysis && t('forms.sleep.qualityAdjusted')}
        </Label>
        <Slider
          value={[sleepQuality]}
          onValueChange={(value) => !analysis && setSleepQuality(value[0])}
          min={1}
          max={5}
          step={1}
          className="py-6 md:py-4"
          disabled={!!analysis}
        />
        <div className="flex justify-between text-sm md:text-xs text-muted-foreground">
          <span>{t('forms.sleep.qualityVeryBad')}</span>
          <span>{t('forms.sleep.qualityExcellent')}</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes" className="text-base md:text-sm font-medium">{t('forms.sleep.notes')}</Label>
        <Textarea
          id="notes"
          placeholder={t('forms.sleep.notesPlaceholder')}
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
              {isAnalyzing ? t('forms.sleep.analyzing') : t('forms.sleep.analyzeAI')}
            </Button>
          )}
        </div>
      </div>

      {analysis && (
        <>
          <HealthAnalysis analysis={analysis} />
          <div className="pt-2 pb-1 text-center text-sm text-muted-foreground">
            {t('forms.sleep.scrollHint')}
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
        {loading ? t('forms.sleep.saving') : t('forms.sleep.save')}
      </Button>
    </form>
  );
}
