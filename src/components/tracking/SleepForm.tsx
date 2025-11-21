import { useState } from "react";
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

const sleepSchema = z.object({
  sleep_date: z.string().min(1, "Data obrigatória"),
  bedtime: z.string().optional(),
  wake_time: z.string().optional(),
  sleep_quality: z.number().min(1).max(5),
  notes: z.string().optional(),
});

type SleepFormData = z.infer<typeof sleepSchema>;

interface SleepFormProps {
  userId: string;
  onSuccess: () => void;
}

export function SleepForm({ userId, onSuccess }: SleepFormProps) {
  const [loading, setLoading] = useState(false);
  const [sleepQuality, setSleepQuality] = useState(3);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<SleepFormData>({
    resolver: zodResolver(sleepSchema),
    defaultValues: {
      sleep_quality: 3,
    },
  });

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
      toast.success("Análise concluída! Qualidade ajustada automaticamente.");
    } catch (error) {
      console.error('Error analyzing description:', error);
      toast.error("Erro ao analisar descrição");
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
      toast.error("Erro ao salvar dados: " + error.message);
    } else {
      toast.success("Sono registrado com sucesso!");
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="sleep_date">
          <Moon className="w-4 h-4 inline mr-2" />
          Data do sono *
        </Label>
        <Input
          id="sleep_date"
          type="date"
          {...register("sleep_date")}
        />
        {errors.sleep_date && (
          <p className="text-sm text-destructive">{errors.sleep_date.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="bedtime">Hora de dormir</Label>
          <Input
            id="bedtime"
            type="time"
            {...register("bedtime")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="wake_time">Hora de acordar</Label>
          <Input
            id="wake_time"
            type="time"
            {...register("wake_time")}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Qualidade do sono: {sleepQuality}/5</Label>
        <Slider
          value={[sleepQuality]}
          onValueChange={(value) => setSleepQuality(value[0])}
          min={1}
          max={5}
          step={1}
          className="py-4"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Muito ruim</span>
          <span>Excelente</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          placeholder="Como você se sentiu ao acordar..."
          {...register("notes")}
          onChange={(e) => setValue("notes", e.target.value)}
        />
        <div className="flex gap-2 mt-2">
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
              onClick={() => handleAnalyzeDescription(notesValue)}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? "Analisando..." : "Analisar com IA"}
            </Button>
          )}
        </div>
      </div>

      {analysis && <HealthAnalysis analysis={analysis} />}

      <Button type="submit" className="w-full" variant="hero" disabled={loading}>
        {loading ? "Salvando..." : "Registrar Sono"}
      </Button>
    </form>
  );
}
