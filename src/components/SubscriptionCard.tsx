import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Crown, Calendar, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const PRODUCT_TIERS = {
  "prod_TU4LGK6XvlFPPV": { name: "Premium Mensal", color: "bg-gradient-hero" },
  "prod_TU4LclTaY8G9Y4": { name: "Premium Anual", color: "bg-gradient-hero" },
};

export function SubscriptionCard() {
  const { subscriptionStatus, checkSubscription } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleManageSubscription = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Erro ao abrir portal",
        description: error.message || "Tente novamente",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshStatus = async () => {
    setLoading(true);
    try {
      await checkSubscription();
      toast({
        title: "Status atualizado",
        description: "Seu status de assinatura foi verificado",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar",
        description: error.message || "Tente novamente",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const tierInfo = subscriptionStatus?.product_id 
    ? PRODUCT_TIERS[subscriptionStatus.product_id as keyof typeof PRODUCT_TIERS]
    : null;

  return (
    <Card className="bg-gradient-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {subscriptionStatus?.subscribed ? (
              <Crown className="w-6 h-6 text-primary" />
            ) : (
              <Sparkles className="w-6 h-6 text-muted-foreground" />
            )}
            <CardTitle>Minha Assinatura</CardTitle>
          </div>
          <Badge variant={subscriptionStatus?.subscribed ? "premium" : "free"}>
            {subscriptionStatus?.subscribed ? "Premium" : "Gratuito"}
          </Badge>
        </div>
        <CardDescription>
          {subscriptionStatus?.subscribed
            ? "Você tem acesso a todos os recursos premium"
            : "Faça upgrade para desbloquear recursos exclusivos"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {subscriptionStatus?.subscribed && tierInfo && (
          <>
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="font-medium">Pacote: {tierInfo.name}</span>
            </div>
            {subscriptionStatus.subscription_end && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>
                  Renova em: {new Date(subscriptionStatus.subscription_end).toLocaleDateString('pt-BR')}
                </span>
              </div>
            )}
          </>
        )}
        
        {!subscriptionStatus?.subscribed && (
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>✨ Transcrição por voz ilimitada</p>
            <p>🤖 Assistente AI conversacional 24/7</p>
            <p>📊 Análises avançadas com insights</p>
            <p>📅 Relatórios semanais detalhados</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        {subscriptionStatus?.subscribed ? (
          <Button 
            onClick={handleManageSubscription}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Abrindo..." : "Gerenciar Assinatura"}
            <ExternalLink className="ml-2 w-4 h-4" />
          </Button>
        ) : (
          <Button 
            onClick={() => window.location.href = "/pricing"}
            variant="hero"
            className="w-full"
          >
            Fazer Upgrade
            <Sparkles className="ml-2 w-4 h-4" />
          </Button>
        )}
        <Button 
          onClick={handleRefreshStatus}
          disabled={loading}
          variant="outline"
          size="icon"
        >
          🔄
        </Button>
      </CardFooter>
    </Card>
  );
}
