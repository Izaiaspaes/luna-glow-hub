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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Smile } from "lucide-react";

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
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<MoodFormData>({
    resolver: zodResolver(moodSchema),
    defaultValues: {
      mood_level: 3,
    },
  });

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
        <Label>Intensidade: {moodLevel}/5</Label>
        <Slider
          value={[moodLevel]}
          onValueChange={(value) => setMoodLevel(value[0])}
          min={1}
          max={5}
          step={1}
          className="py-4"
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
        />
      </div>

      <Button type="submit" className="w-full" variant="hero" disabled={loading}>
        {loading ? "Salvando..." : "Registrar Humor"}
      </Button>
    </form>
  );
}
