import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useReferral } from "@/hooks/useReferral";
import { toast } from "sonner";
import { 
  Copy, 
  Gift, 
  Users, 
  CheckCircle, 
  Clock, 
  Share2,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";

export const ReferralSection = () => {
  const { t } = useTranslation();
  const { 
    referralCode, 
    referrals, 
    isLoading, 
    getReferralLink, 
    copyReferralLink, 
    getStats 
  } = useReferral();
  const [isCopying, setIsCopying] = useState(false);

  const handleCopyLink = async () => {
    setIsCopying(true);
    const success = await copyReferralLink();
    if (success) {
      toast.success(t("referral.linkCopied", "Link copiado!"));
    } else {
      toast.error(t("referral.copyError", "Erro ao copiar link"));
    }
    setTimeout(() => setIsCopying(false), 1000);
  };

  const handleShare = async () => {
    const link = getReferralLink();
    if (navigator.share) {
      try {
        await navigator.share({
          title: t("referral.shareTitle", "Conheça a Luna!"),
          text: t("referral.shareText", "Use meu código de indicação e comece sua jornada de bem-estar!"),
          url: link,
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      handleCopyLink();
    }
  };

  const stats = getStats();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "signed_up":
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />{t("referral.status.signedUp", "Cadastrado")}</Badge>;
      case "subscribed":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-600"><Clock className="w-3 h-3 mr-1" />{t("referral.status.subscribed", "Aguardando 30 dias")}</Badge>;
      case "eligible":
        return <Badge variant="outline" className="border-green-500 text-green-600"><CheckCircle className="w-3 h-3 mr-1" />{t("referral.status.eligible", "Elegível")}</Badge>;
      case "rewarded":
        return <Badge className="bg-green-500"><Gift className="w-3 h-3 mr-1" />{t("referral.status.rewarded", "Recompensado")}</Badge>;
      case "expired":
        return <Badge variant="destructive">{t("referral.status.expired", "Expirado")}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
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
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-luna-pink/10 via-luna-purple/10 to-luna-blue/10">
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-luna-pink" />
            {t("referral.title", "Indique e Ganhe")}
          </CardTitle>
          <CardDescription>
            {t("referral.description", "Indique amigas e ganhe 50% de comissão sobre a primeira mensalidade quando elas ficarem 30 dias assinantes!")}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Referral Link */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t("referral.yourLink", "Seu link de indicação")}
            </label>
            <div className="flex gap-2">
              <Input 
                value={getReferralLink()} 
                readOnly 
                className="font-mono text-sm"
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleCopyLink}
                disabled={isCopying}
              >
                <Copy className={`w-4 h-4 ${isCopying ? 'text-green-500' : ''}`} />
              </Button>
              <Button 
                variant="default"
                onClick={handleShare}
                className="gap-2"
              >
                <Share2 className="w-4 h-4" />
                {t("referral.share", "Compartilhar")}
              </Button>
            </div>
            {referralCode && (
              <p className="text-xs text-muted-foreground">
                {t("referral.code", "Código")}: <span className="font-mono font-bold">{referralCode.referral_code}</span>
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-muted/50">
              <CardContent className="pt-4 text-center">
                <Users className="w-6 h-6 mx-auto mb-2 text-luna-blue" />
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">{t("referral.stats.total", "Indicações")}</p>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="pt-4 text-center">
                <Clock className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">{t("referral.stats.pending", "Pendentes")}</p>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="pt-4 text-center">
                <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-500" />
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-xs text-muted-foreground">{t("referral.stats.completed", "Completas")}</p>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="pt-4 text-center">
                <Sparkles className="w-6 h-6 mx-auto mb-2 text-luna-pink" />
                <p className="text-2xl font-bold">{stats.rewarded}</p>
                <p className="text-xs text-muted-foreground">{t("referral.stats.rewarded", "Recompensas")}</p>
              </CardContent>
            </Card>
          </div>

          {/* How it works */}
          <div className="bg-muted/30 rounded-lg p-4">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-luna-purple" />
              {t("referral.howItWorks", "Como funciona")}
            </h4>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>{t("referral.step1", "Compartilhe seu link com amigas")}</li>
              <li>{t("referral.step2", "Ela se cadastra e assina um plano")}</li>
              <li>{t("referral.step3", "Após 30 dias de assinatura ativa, você ganha 50% de comissão!")}</li>
              <li>{t("referral.step4", "O saldo fica disponível para saque via PIX")}</li>
            </ol>
          </div>

          {/* Referrals List */}
          {referrals.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">{t("referral.yourReferrals", "Suas indicações")}</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {referrals.map((referral) => (
                  <div 
                    key={referral.id} 
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {referral.referred_email || t("referral.anonymous", "Usuária")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(referral.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {getStatusBadge(referral.status)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
