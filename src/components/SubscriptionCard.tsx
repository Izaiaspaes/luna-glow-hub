import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Crown, Calendar, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useTranslation } from "react-i18next";

const PRODUCT_TIERS = {
  "prod_TU4LGK6XvlFPPV": { name: "Premium Mensal", color: "bg-gradient-hero" },
  "prod_TU4LclTaY8G9Y4": { name: "Premium Anual", color: "bg-gradient-hero" },
  // Premium Plus products
  "prod_TVfx4bH4H0okVe": { name: "Premium Plus Mensal", color: "bg-gradient-hero" },
  "prod_TVfxAziuEOC4QN": { name: "Premium Plus Anual", color: "bg-gradient-hero" },
};

export function SubscriptionCard() {
  const { t } = useTranslation();
  const { subscriptionStatus, checkSubscription } = useAuth();
  const { profile } = useProfile();
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
        title: t("subscription.messages.errorOpening"),
        description: error.message || t("subscription.messages.tryAgain"),
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
        title: t("subscription.messages.statusUpdated"),
        description: t("subscription.messages.statusUpdatedDesc"),
      });
    } catch (error: any) {
      toast({
        title: t("subscription.messages.errorRefreshing"),
        description: error.message || t("subscription.messages.tryAgain"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const effectiveSubscribed =
    !!subscriptionStatus?.subscribed ||
    profile?.subscription_plan === "premium" ||
    profile?.subscription_plan === "premium_plus";
  
  const isPremiumPlus = 
    profile?.subscription_plan === "premium_plus" ||
    subscriptionStatus?.product_id === 'prod_TVfx4bH4H0okVe' ||
    subscriptionStatus?.product_id === 'prod_TVfxAziuEOC4QN';

  // Check if subscription is manual (admin-assigned) vs paid (Stripe)
  const isManualSubscription = effectiveSubscribed && !subscriptionStatus?.subscribed;

  const displayedPlanName = (() => {
    if (profile?.subscription_plan === "premium_plus") return "Premium Plus";
    if (profile?.subscription_plan === "premium") return "Premium";
    if (subscriptionStatus?.product_id) {
      const tier = PRODUCT_TIERS[subscriptionStatus.product_id as keyof typeof PRODUCT_TIERS];
      return tier?.name || null;
    }
    return null;
  })();

  return (
    <Card className="bg-gradient-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {effectiveSubscribed ? (
              <Crown className="w-6 h-6 text-primary" />
            ) : (
              <Sparkles className="w-6 h-6 text-muted-foreground" />
            )}
            <CardTitle>{t('subscription.currentPlan')}</CardTitle>
          </div>
          <Badge variant={effectiveSubscribed ? "premium" : "free"}>
             {effectiveSubscribed ? (displayedPlanName || t('subscription.subscribed')) : t('subscription.notSubscribed')}
           </Badge>
        </div>
        <CardDescription>
          {effectiveSubscribed
            ? t('subscription.hasAccess')
            : t('subscription.upgradeDesc')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {effectiveSubscribed && (
          <>
            {displayedPlanName && (
              <div className="flex items-center gap-2 text-sm">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="font-medium">{t('subscription.package')} {displayedPlanName}</span>
              </div>
            )}
            {subscriptionStatus?.subscription_end && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>
                  {t('subscription.renewsOn')} {new Date(subscriptionStatus.subscription_end).toLocaleDateString('pt-BR')}
                </span>
              </div>
            )}
          </>
        )}
        
        {!effectiveSubscribed && (
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>✨ {t('subscription.features.unlimitedPlans')}</p>
            <p>🎤 {t('subscription.features.voiceTranscription')}</p>
            <p>🤖 {t('subscription.features.aiAssistant')}</p>
            <p>📊 {t('subscription.features.advancedAnalysis')}</p>
            <p>📅 {t('subscription.features.weeklyReports')}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        {effectiveSubscribed ? (
          isManualSubscription ? (
            <Button 
              disabled
              className="w-full"
              variant="outline"
            >
              {t("subscription.testPlan")}
            </Button>
          ) : (
            <Button 
              onClick={handleManageSubscription}
              disabled={loading}
              className="w-full"
            >
              {loading ? t("subscription.opening") : t("subscription.manageSubscription")}
              <ExternalLink className="ml-2 w-4 h-4" />
            </Button>
          )
        ) : (
          <Button 
            onClick={() => window.location.href = "/pricing"}
            variant="hero"
            className="w-full"
          >
            {t('subscription.upgrade')}
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
