import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Calendar } from "lucide-react";

const cycleSchema = z.object({
  cycle_start_date: z.string().min(1, "Data obrigatória"),
  flow_intensity: z.string().optional(),
  symptoms: z.string().optional(),
  notes: z.string().optional(),
});

type CycleFormData = z.infer<typeof cycleSchema>;

interface CycleFormProps {
  userId: string;
  onSuccess: () => void;
}

export function CycleForm({ userId, onSuccess }: CycleFormProps) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<CycleFormData>({
    resolver: zodResolver(cycleSchema),
  });

  const onSubmit = async (data: CycleFormData) => {
    setLoading(true);
    
    const symptomsArray = data.symptoms 
      ? data.symptoms.split(",").map(s => s.trim()).filter(Boolean)
      : null;

    const { error } = await supabase
      .from('cycle_tracking')
      .insert({
        user_id: userId,
        cycle_start_date: data.cycle_start_date,
        flow_intensity: data.flow_intensity || null,
        symptoms: symptomsArray,
        notes: data.notes || null,
      });

    setLoading(false);

    if (error) {
      toast.error("Erro ao salvar dados: " + error.message);
    } else {
      toast.success("Ciclo registrado com sucesso!");
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cycle_start_date">
          <Calendar className="w-4 h-4 inline mr-2" />
          Data de início do ciclo *
        </Label>
        <Input
          id="cycle_start_date"
          type="date"
          {...register("cycle_start_date")}
        />
        {errors.cycle_start_date && (
          <p className="text-sm text-destructive">{errors.cycle_start_date.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="flow_intensity">Intensidade do fluxo</Label>
        <Select onValueChange={(value) => setValue("flow_intensity", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="leve">Leve</SelectItem>
            <SelectItem value="moderado">Moderado</SelectItem>
            <SelectItem value="intenso">Intenso</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="symptoms">Sintomas (separados por vírgula)</Label>
        <Input
          id="symptoms"
          placeholder="Ex: cólicas, dor de cabeça, inchaço"
          {...register("symptoms")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          placeholder="Anotações adicionais..."
          {...register("notes")}
        />
      </div>

      <Button type="submit" className="w-full" variant="hero" disabled={loading}>
        {loading ? "Salvando..." : "Registrar Ciclo"}
      </Button>
    </form>
  );
}
