import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, X, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface PlanLimitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PlanLimitModal({ open, onOpenChange }: PlanLimitModalProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleUpgrade = () => {
    onOpenChange(false);
    navigate("/pricing");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-to-r from-luna-pink via-luna-purple to-luna-orange bg-clip-text text-transparent">
            {t('planLimit.title')}
          </DialogTitle>
          <DialogDescription className="text-base">
            {t('planLimit.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6">
          {/* Free Plan Card */}
          <div className="border-2 border-border rounded-lg p-6 bg-muted/30">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-2 w-2 rounded-full bg-muted-foreground/50" />
              <h3 className="font-semibold text-lg">{t('planLimit.free')}</h3>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm">{t('planLimit.basicTracking')}</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm">{t('planLimit.symptomAnalysis')}</span>
              </div>
              <div className="flex items-start gap-2">
                <X className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  <strong className="text-foreground">{t('planLimit.onePlan')}</strong> {t('planLimit.atATime')}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <X className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">{t('planLimit.voiceTranscription')}</span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-2xl font-bold">{t('planLimit.freePrice')}</p>
              <p className="text-xs text-muted-foreground">{t('planLimit.perMonth')}</p>
            </div>
          </div>

          {/* Premium Plan Card */}
          <div className="border-2 border-primary rounded-lg p-6 bg-gradient-to-br from-luna-pink/10 via-luna-purple/10 to-luna-orange/10 relative overflow-hidden">
            <div className="absolute top-2 right-2">
              <span className="bg-gradient-to-r from-luna-pink to-luna-purple text-white text-xs font-bold px-3 py-1 rounded-full">
                {t('planLimit.popular')}
              </span>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-luna-purple" />
              <h3 className="font-semibold text-lg bg-gradient-to-r from-luna-pink to-luna-purple bg-clip-text text-transparent">
                Premium
              </h3>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm">{t('planLimit.allFreeFeatures')}</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm">
                  <strong>{t('planLimit.unlimitedPlans')}</strong> {t('planLimit.ofWellness')}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm">{t('planLimit.voiceTranscription')}</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm">{t('planLimit.symptomPredictions')}</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm">{t('planLimit.partnerSharing')}</span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-2xl font-bold">{t('planLimit.premiumPrice')}</p>
              <p className="text-xs text-muted-foreground">{t('planLimit.perMonth')}</p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            {t('planLimit.continueWithFree')}
          </Button>
          <Button
            onClick={handleUpgrade}
            className="w-full sm:w-auto bg-gradient-to-r from-luna-pink via-luna-purple to-luna-orange hover:opacity-90"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {t('planLimit.manageSubscription')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
