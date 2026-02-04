import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Percent, Clock, Save, RefreshCw, AlertCircle } from "lucide-react";

interface CommissionSettings {
  id: string;
  commission_rate: number;
  eligibility_days: number;
  is_active: boolean;
  updated_at: string;
}

export const CommissionSettingsManagement = () => {
  const [settings, setSettings] = useState<CommissionSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [commissionRate, setCommissionRate] = useState("");
  const [eligibilityDays, setEligibilityDays] = useState("");

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("commission_settings")
        .select("*")
        .eq("is_active", true)
        .single();

      if (error) throw error;
      
      setSettings(data);
      setCommissionRate(data.commission_rate.toString());
      setEligibilityDays(data.eligibility_days.toString());
    } catch (err) {
      console.error("Error fetching commission settings:", err);
      toast.error("Erro ao carregar configurações de comissão");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    
    const rate = parseFloat(commissionRate);
    const days = parseInt(eligibilityDays);

    if (isNaN(rate) || rate < 0 || rate > 100) {
      toast.error("A taxa de comissão deve estar entre 0 e 100%");
      return;
    }

    if (isNaN(days) || days < 1 || days > 365) {
      toast.error("O período de elegibilidade deve estar entre 1 e 365 dias");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("commission_settings")
        .update({
          commission_rate: rate,
          eligibility_days: days,
        })
        .eq("id", settings.id);

      if (error) throw error;

      toast.success("Configurações de comissão atualizadas com sucesso!");
      fetchSettings();
    } catch (err) {
      console.error("Error saving commission settings:", err);
      toast.error("Erro ao salvar configurações");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Percent className="w-5 h-5 text-primary" />
          Configurações de Comissão
        </CardTitle>
        <CardDescription>
          Configure a taxa de comissão e período de elegibilidade para o programa de indicações
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Settings Display */}
        <div className="bg-muted/50 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm font-medium">
              Configuração atual: <Badge variant="outline" className="ml-2">{settings?.commission_rate}%</Badge>
            </p>
            <p className="text-xs text-muted-foreground">
              Última atualização: {settings?.updated_at ? new Date(settings.updated_at).toLocaleString('pt-BR') : '-'}
            </p>
          </div>
        </div>

        {/* Commission Rate Input */}
        <div className="space-y-2">
          <Label htmlFor="commission_rate" className="flex items-center gap-2">
            <Percent className="w-4 h-4" />
            Taxa de Comissão (%)
          </Label>
          <div className="flex gap-2">
            <Input
              id="commission_rate"
              type="number"
              min="0"
              max="100"
              step="0.5"
              value={commissionRate}
              onChange={(e) => setCommissionRate(e.target.value)}
              placeholder="Ex: 50"
              className="max-w-[200px]"
            />
            <span className="flex items-center text-muted-foreground">%</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Porcentagem do valor da primeira mensalidade que será paga como comissão
          </p>
        </div>

        {/* Eligibility Days Input */}
        <div className="space-y-2">
          <Label htmlFor="eligibility_days" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Período de Elegibilidade (dias)
          </Label>
          <div className="flex gap-2">
            <Input
              id="eligibility_days"
              type="number"
              min="1"
              max="365"
              value={eligibilityDays}
              onChange={(e) => setEligibilityDays(e.target.value)}
              placeholder="Ex: 30"
              className="max-w-[200px]"
            />
            <span className="flex items-center text-muted-foreground">dias</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Número de dias que a indicada deve permanecer assinante para a comissão ser liberada
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            <Save className="w-4 h-4" />
            {isSaving ? "Salvando..." : "Salvar Alterações"}
          </Button>
          <Button variant="outline" onClick={fetchSettings} disabled={isLoading} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Recarregar
          </Button>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
            Como funciona:
          </h4>
          <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
            <li>A taxa de comissão é aplicada sobre o valor da primeira mensalidade da indicada</li>
            <li>A comissão fica pendente durante o período de elegibilidade</li>
            <li>Após o período, a comissão é liberada para saque via PIX</li>
            <li>Alterações afetam apenas novas indicações</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
