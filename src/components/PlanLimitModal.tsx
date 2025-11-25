import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, X, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PlanLimitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PlanLimitModal({ open, onOpenChange }: PlanLimitModalProps) {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    onOpenChange(false);
    navigate("/pricing");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-to-r from-luna-pink via-luna-purple to-luna-orange bg-clip-text text-transparent">
            Limite de Planos Atingido
          </DialogTitle>
          <DialogDescription className="text-base">
            Você atingiu o limite de planos ativos do plano gratuito. Compare as opções:
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6">
          {/* Free Plan Card */}
          <div className="border-2 border-border rounded-lg p-6 bg-muted/30">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-2 w-2 rounded-full bg-muted-foreground/50" />
              <h3 className="font-semibold text-lg">Gratuito</h3>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm">Rastreamento básico</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm">Análise de sintomas</span>
              </div>
              <div className="flex items-start gap-2">
                <X className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  <strong className="text-foreground">1 plano de bem-estar</strong> ativo por vez
                </span>
              </div>
              <div className="flex items-start gap-2">
                <X className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">Transcrição por voz</span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-2xl font-bold">R$ 0</p>
              <p className="text-xs text-muted-foreground">por mês</p>
            </div>
          </div>

          {/* Premium Plan Card */}
          <div className="border-2 border-primary rounded-lg p-6 bg-gradient-to-br from-luna-pink/10 via-luna-purple/10 to-luna-orange/10 relative overflow-hidden">
            <div className="absolute top-2 right-2">
              <span className="bg-gradient-to-r from-luna-pink to-luna-purple text-white text-xs font-bold px-3 py-1 rounded-full">
                POPULAR
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
                <span className="text-sm">Tudo do gratuito</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm">
                  <strong>Planos ilimitados</strong> de bem-estar
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm">Transcrição por voz</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm">Previsões de sintomas</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm">Compartilhamento com parceiro(a)</span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-2xl font-bold">R$ 29,90</p>
              <p className="text-xs text-muted-foreground">por mês</p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Continuar com Gratuito
          </Button>
          <Button
            onClick={handleUpgrade}
            className="w-full sm:w-auto bg-gradient-to-r from-luna-pink via-luna-purple to-luna-orange hover:opacity-90"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Fazer Upgrade
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
