import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertCircle, Heart, Wind, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

interface SOSButtonProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SOSButton({ open: externalOpen, onOpenChange }: SOSButtonProps = {}) {
  const { t } = useTranslation();
  const { subscriptionStatus, userProfile } = useAuth();
  const { profile } = useProfile();
  const [internalOpen, setInternalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Use external control if provided, otherwise use internal state
  const showDialog = externalOpen !== undefined ? externalOpen : internalOpen;
  const setShowDialog = (value: boolean) => {
    if (onOpenChange) {
      onOpenChange(value);
    } else {
      setInternalOpen(value);
    }
  };

  // Reset selection when dialog closes
  useEffect(() => {
    if (!showDialog) {
      setSelectedOption(null);
    }
  }, [showDialog]);

  const sosOptions = [
    {
      id: "physicalPain",
      icon: AlertCircle,
      color: "text-red-500",
    },
    {
      id: "anxiety",
      icon: Wind,
      color: "text-orange-500",
    },
    {
      id: "fatigue",
      icon: Sparkles,
      color: "text-blue-500",
    },
    {
      id: "irritation",
      icon: Heart,
      color: "text-luna-pink",
    },
  ];

  const hasPremiumAccess = 
    subscriptionStatus?.product_id === "prod_TVfx4bH4H0okVe" || 
    subscriptionStatus?.product_id === "prod_TVfxAziuEOC4QN" ||
    userProfile?.subscription_plan === "premium_plus" ||
    profile?.subscription_plan === "premium_plus" ||
    userProfile?.subscription_plan === "premium" ||
    profile?.subscription_plan === "premium";

  const handleSOSClick = () => {
    if (!hasPremiumAccess) {
      toast({
        title: t('sos.premiumRequired'),
        description: t('sos.premiumMessage'),
        variant: "destructive",
      });
      return;
    }
    setShowDialog(true);
  };

  const getSelectedOptionData = () => {
    if (!selectedOption) return null;
    
    // Get all technique keys for the selected option
    const techniques: string[] = [];
    const techniqueKeys = ['breathe', 'compress', 'massage', 'tea', 'grounding', 'breathing', 'walk', 'music', 'nap', 'water', 'stretch', 'fresh', 'write', 'meditate', 'bath', 'laugh'];
    
    for (const key of techniqueKeys) {
      const translationKey = `sos.options.${selectedOption}.techniques.${key}`;
      const translated = t(translationKey);
      // Only add if the translation exists (i.e., not the same as the key)
      if (translated !== translationKey) {
        techniques.push(translated);
      }
    }
    
    return {
      title: t(`sos.options.${selectedOption}.title`),
      message: t(`sos.options.${selectedOption}.message`),
      techniques,
    };
  };

  const selectedData = getSelectedOptionData();

  return (
    <>
      {/* Only render floating button when not externally controlled and user has premium access */}
      {externalOpen === undefined && hasPremiumAccess && (
        <Button
          onClick={handleSOSClick}
          className="fixed bottom-24 right-6 z-50 h-16 w-16 rounded-full bg-gradient-to-r from-red-500 to-pink-500 hover:opacity-90 shadow-lg hover:shadow-xl transition-all animate-pulse"
          size="icon"
          aria-label={t('sos.title')}
        >
          <AlertCircle className="w-8 h-8 text-white" />
        </Button>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl flex items-center gap-2">
              <Heart className="w-5 h-5 md:w-6 md:h-6 text-luna-pink" />
              {t('sos.title')}
            </DialogTitle>
            <DialogDescription className="text-sm">
              {t('sos.description')}
            </DialogDescription>
          </DialogHeader>

          {!selectedOption ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              {sosOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Card
                    key={option.id}
                    className="cursor-pointer hover:border-primary transition-all hover:shadow-md touch-target"
                    onClick={() => setSelectedOption(option.id)}
                  >
                    <CardHeader className="p-4">
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 md:w-6 md:h-6 ${option.color}`} />
                        <CardTitle className="text-base md:text-lg">
                          {t(`sos.options.${option.id}.title`)}
                        </CardTitle>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4 mt-2">
              <Card className="border-2 border-luna-pink/30 bg-luna-pink/5">
                <CardContent className="p-4">
                  <p className="text-sm md:text-base text-muted-foreground italic">{selectedData?.message}</p>
                </CardContent>
              </Card>

              <div>
                <h3 className="font-semibold text-base md:text-lg mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-luna-purple" />
                  {t('sos.techniquesTitle')}
                </h3>
                <div className="space-y-2">
                  {selectedData?.techniques.map((technique, index) => (
                    <Card key={index} className="hover:bg-muted/50 transition-smooth">
                      <CardContent className="p-3 md:py-4">
                        <p className="text-xs md:text-sm flex items-start gap-2 md:gap-3">
                          <span className="text-luna-purple font-bold">{index + 1}.</span>
                          {technique}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedOption(null)}
                  className="flex-1 h-11 md:h-10"
                >
                  {t('sos.backButton')}
                </Button>
                <Button
                  onClick={() => {
                    toast({
                      title: t('sos.successTitle'),
                      description: t('sos.successMessage'),
                    });
                    setShowDialog(false);
                    setSelectedOption(null);
                  }}
                  className="flex-1 h-11 md:h-10 bg-gradient-to-r from-luna-purple to-luna-pink text-white"
                >
                  {t('sos.feelingBetter')}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
