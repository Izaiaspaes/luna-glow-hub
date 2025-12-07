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
import { Checkbox } from "@/components/ui/checkbox";
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
    isDelayed: z.boolean().optional(),
    delayDays: z.number().min(1).max(90).optional(),
    symptoms: z.string().optional(),
    notes: z.string().optional(),
  });

  type CycleFormData = z.infer<typeof cycleSchema>;

  const form = useForm<CycleFormData>({
    resolver: zodResolver(cycleSchema),
    defaultValues: {
      cycleStartDate: "",
      isDelayed: false,
      delayDays: undefined,
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 md:space-y-4">
        <FormField
          control={form.control}
          name="cycleStartDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base md:text-sm font-medium">{t('forms.cycle.startDate')}</FormLabel>
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
          name="flowIntensity"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base md:text-sm font-medium">{t('forms.cycle.flowIntensity')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12 md:h-10 text-base md:text-sm">
                    <SelectValue placeholder={t('forms.cycle.flowPlaceholder')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="leve" className="py-3 md:py-2 text-base md:text-sm">{t('forms.cycle.flowLight')}</SelectItem>
                  <SelectItem value="moderado" className="py-3 md:py-2 text-base md:text-sm">{t('forms.cycle.flowModerate')}</SelectItem>
                  <SelectItem value="intenso" className="py-3 md:py-2 text-base md:text-sm">{t('forms.cycle.flowHeavy')}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isDelayed"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    if (!checked) {
                      form.setValue('delayDays', undefined);
                    }
                  }}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-base md:text-sm font-medium cursor-pointer">
                  {t('forms.cycle.isDelayed')}
                </FormLabel>
                <p className="text-sm text-muted-foreground">
                  {t('forms.cycle.isDelayedHint')}
                </p>
              </div>
            </FormItem>
          )}
        />

        {form.watch('isDelayed') && (
          <FormField
            control={form.control}
            name="delayDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base md:text-sm font-medium">{t('forms.cycle.delayDays')}</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min={1}
                    max={90}
                    placeholder={t('forms.cycle.delayDaysPlaceholder')}
                    className="h-12 md:h-10 text-base md:text-sm px-4"
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="symptoms"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base md:text-sm font-medium">{t('forms.cycle.symptoms')}</FormLabel>
              <FormControl>
                <Input 
                  placeholder={t('forms.cycle.symptomsPlaceholder')} 
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
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base md:text-sm font-medium">{t('forms.cycle.notes')}</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder={t('forms.cycle.notesPlaceholder')} 
                  className="min-h-[100px] md:min-h-[80px] text-base md:text-sm p-4 resize-none"
                  {...field} 
                />
              </FormControl>
              <div className="flex flex-wrap gap-2 mt-3">
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
                    className="h-10 md:h-8 px-4 text-sm"
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
          className="w-full h-12 md:h-10 text-base md:text-sm font-medium mt-2" 
          disabled={isSubmitting}
        >
          {isSubmitting ? t('forms.cycle.saving') : t('forms.cycle.save')}
        </Button>
      </form>
    </Form>
  );
}
