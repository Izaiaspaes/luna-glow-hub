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

const energySchema = z.object({
  energy_date: z.string().min(1, "Data obrigatória"),
  time_of_day: z.string().optional(),
  energy_level: z.number().min(1).max(5),
  notes: z.string().optional(),
});

type EnergyFormData = z.infer<typeof energySchema>;

interface EnergyFormProps {
  userId: string;
  onSuccess: () => void;
}

export function EnergyForm({ userId, onSuccess }: EnergyFormProps) {
  const [loading, setLoading] = useState(false);
  const [energyLevel, setEnergyLevel] = useState(3);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<EnergyFormData>({
    resolver: zodResolver(energySchema),
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
      toast.success("Análise concluída! Nível ajustado automaticamente.");
    } catch (error) {
      console.error('Error analyzing description:', error);
      toast.error("Erro ao analisar descrição");
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
      toast.error("Erro ao salvar dados: " + error.message);
    } else {
      toast.success("Energia registrada com sucesso!");
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="energy_date">
          <Zap className="w-4 h-4 inline mr-2" />
          Data *
        </Label>
        <Input
          id="energy_date"
          type="date"
          {...register("energy_date")}
        />
        {errors.energy_date && (
          <p className="text-sm text-destructive">{errors.energy_date.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="time_of_day">Período do dia</Label>
        <Select onValueChange={(value) => setValue("time_of_day", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="manha">🌅 Manhã</SelectItem>
            <SelectItem value="tarde">☀️ Tarde</SelectItem>
            <SelectItem value="noite">🌙 Noite</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Nível de energia: {energyLevel}/5</Label>
        <Slider
          value={[energyLevel]}
          onValueChange={(value) => setEnergyLevel(value[0])}
          min={1}
          max={5}
          step={1}
          className="py-4"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Exausto</span>
          <span>Muito energizado</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">O que afetou sua energia?</Label>
        <Textarea
          id="notes"
          placeholder="Exercícios, alimentação, sono, estresse..."
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

      {analysis && (
        <>
          <HealthAnalysis analysis={analysis} />
          <div className="pt-2 pb-1 text-center text-sm text-muted-foreground">
            ⬇️ Clique em "Registrar Energia" abaixo para salvar
          </div>
        </>
      )}

      <Button 
        ref={submitButtonRef}
        type="submit" 
        className="w-full" 
        variant="hero" 
        disabled={loading}
      >
        {loading ? "Salvando..." : "Registrar Energia"}
      </Button>
    </form>
  );
}
