import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { HealthAnalysis } from "@/components/HealthAnalysis";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";

interface CycleFormProps {
  userId: string;
  onSuccess: () => void;
}

export function CycleForm({ userId, onSuccess }: CycleFormProps) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const cycleSchema = z.object({
    cycleStartDate: z.string().min(1, t('forms.cycle.dateRequired')),
    flowIntensity: z.enum(["leve", "moderado", "intenso"]).optional(),
    symptoms: z.string().optional(),
    notes: z.string().optional(),
  });

  type CycleFormData = z.infer<typeof cycleSchema>;

  const form = useForm<CycleFormData>({
    resolver: zodResolver(cycleSchema),
    defaultValues: {
      cycleStartDate: "",
      symptoms: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (analysis && submitButtonRef.current) {
      setTimeout(() => {
        submitButtonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 300);
    }
  }, [analysis]);

  const handleAnalyzeDescription = async (description: string) => {
    if (!description) return;
    
    setIsAnalyzing(true);
    try {
      const { data: analysisData, error } = await supabase.functions.invoke('analyze-health-description', {
        body: { 
          description,
          trackingType: 'ciclo menstrual'
        }
      });

      if (error) throw error;
      setAnalysis(analysisData);
      toast.success(t('forms.cycle.analysisComplete'));
    } catch (error) {
      console.error('Error analyzing description:', error);
      toast.error(t('forms.cycle.analysisError'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const onSubmit = async (data: CycleFormData) => {
    setIsSubmitting(true);
    try {
      const symptomsArray = data.symptoms
        ? data.symptoms.split(',').map(s => s.trim()).filter(Boolean)
        : [];

      const { error } = await supabase.from('cycle_tracking').insert({
        user_id: userId,
        cycle_start_date: data.cycleStartDate,
        flow_intensity: data.flowIntensity,
        symptoms: symptomsArray,
        notes: data.notes,
      });

      if (error) throw error;

      toast.success(t('forms.cycle.successMessage'));
      form.reset();
      setAnalysis(null);
      onSuccess();
    } catch (error) {
      console.error("Error saving cycle tracking:", error);
      toast.error(t('forms.cycle.errorMessage'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="cycleStartDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('forms.cycle.startDate')}</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="flowIntensity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('forms.cycle.flowIntensity')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('forms.cycle.flowPlaceholder')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="leve">{t('forms.cycle.flowLight')}</SelectItem>
                  <SelectItem value="moderado">{t('forms.cycle.flowModerate')}</SelectItem>
                  <SelectItem value="intenso">{t('forms.cycle.flowHeavy')}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="symptoms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('forms.cycle.symptoms')}</FormLabel>
              <FormControl>
                <Input placeholder={t('forms.cycle.symptomsPlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('forms.cycle.notes')}</FormLabel>
              <FormControl>
                <Textarea placeholder={t('forms.cycle.notesPlaceholder')} {...field} />
              </FormControl>
              <div className="flex gap-2 mt-2">
                <VoiceRecorder 
                  onTranscription={(text) => {
                    field.onChange(text);
                    handleAnalyzeDescription(text);
                  }}
                  disabled={isSubmitting}
                />
                {field.value && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAnalyzeDescription(field.value)}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? t('forms.cycle.analyzing') : t('forms.cycle.analyzeAI')}
                  </Button>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {analysis && (
          <>
            <HealthAnalysis analysis={analysis} />
            <div className="pt-2 pb-1 text-center text-sm text-muted-foreground">
              {t('forms.cycle.scrollHint')}
            </div>
          </>
        )}

        <Button 
          ref={submitButtonRef}
          type="submit" 
          className="w-full" 
          disabled={isSubmitting}
        >
          {isSubmitting ? t('forms.cycle.saving') : t('forms.cycle.save')}
        </Button>
      </form>
    </Form>
  );
}
