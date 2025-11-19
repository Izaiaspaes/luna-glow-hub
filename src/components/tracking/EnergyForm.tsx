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
import { Zap } from "lucide-react";

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
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<EnergyFormData>({
    resolver: zodResolver(energySchema),
    defaultValues: {
      energy_level: 3,
    },
  });

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
        />
      </div>

      <Button type="submit" className="w-full" variant="hero" disabled={loading}>
        {loading ? "Salvando..." : "Registrar Energia"}
      </Button>
    </form>
  );
}
