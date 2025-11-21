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
import { Smile } from "lucide-react";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { HealthAnalysis } from "@/components/HealthAnalysis";

const moodSchema = z.object({
  mood_date: z.string().min(1, "Data obrigatória"),
  mood_type: z.string().optional(),
  mood_level: z.number().min(1).max(5),
  notes: z.string().optional(),
});

type MoodFormData = z.infer<typeof moodSchema>;

interface MoodFormProps {
  userId: string;
  onSuccess: () => void;
}

export function MoodForm({ userId, onSuccess }: MoodFormProps) {
  const [loading, setLoading] = useState(false);
  const [moodLevel, setMoodLevel] = useState(3);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<MoodFormData>({
    resolver: zodResolver(moodSchema),
    defaultValues: {
      mood_level: 3,
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
          trackingType: 'humor'
        }
      });

      if (error) throw error;
      
      if (analysisData?.quality_score) {
        setMoodLevel(analysisData.quality_score);
      }
      
      setAnalysis(analysisData);
      toast.success("Análise concluída! Intensidade ajustada automaticamente.");
    } catch (error) {
      console.error('Error analyzing description:', error);
      toast.error("Erro ao analisar descrição");
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
      toast.error("Erro ao salvar dados: " + error.message);
    } else {
      toast.success("Humor registrado com sucesso!");
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="mood_date">
          <Smile className="w-4 h-4 inline mr-2" />
          Data *
        </Label>
        <Input
          id="mood_date"
          type="date"
          {...register("mood_date")}
        />
        {errors.mood_date && (
          <p className="text-sm text-destructive">{errors.mood_date.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="mood_type">Como você está se sentindo?</Label>
        <Select onValueChange={(value) => setValue("mood_type", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="feliz">😊 Feliz</SelectItem>
            <SelectItem value="calma">😌 Calma</SelectItem>
            <SelectItem value="ansiosa">😰 Ansiosa</SelectItem>
            <SelectItem value="triste">😢 Triste</SelectItem>
            <SelectItem value="irritada">😤 Irritada</SelectItem>
            <SelectItem value="energizada">⚡ Energizada</SelectItem>
            <SelectItem value="cansada">😴 Cansada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Intensidade: {moodLevel}/5 {analysis && "✓ Ajustado pela IA"}</Label>
        <Slider
          value={[moodLevel]}
          onValueChange={(value) => !analysis && setMoodLevel(value[0])}
          min={1}
          max={5}
          step={1}
          className="py-4"
          disabled={!!analysis}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Muito baixo</span>
          <span>Muito alto</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">O que pode ter influenciado seu humor?</Label>
        <Textarea
          id="notes"
          placeholder="Eventos, pessoas, situações..."
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
            ⬇️ Clique em "Registrar Humor" abaixo para salvar
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
        {loading ? "Salvando..." : "Registrar Humor"}
      </Button>
    </form>
  );
}
