import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Gift, X } from "lucide-react";

export const ExitIntentPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      // Detecta quando o mouse está saindo pelo topo da página
      if (e.clientY <= 0 && !hasShown) {
        setIsOpen(true);
        setHasShown(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hasShown]);

  const handleClaim = () => {
    window.location.href = 'https://lunaglow.com.br/auth?promo=PRIMEIRA15';
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-4 border-primary">
        <div className="relative gradient-bg p-8 text-white">
          <Badge className="absolute top-4 right-4 bg-white/20 text-white border-0 backdrop-blur-sm">
            <Sparkles className="w-3 h-3 mr-1" />
            Oferta Exclusiva
          </Badge>
          
          <DialogHeader className="space-y-4 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center animate-bounce">
              <Gift className="w-8 h-8" />
            </div>
            
            <DialogTitle className="text-3xl font-bold text-white">
              Espere! 🎁
            </DialogTitle>
            
            <DialogDescription className="text-white/90 text-lg">
              Não perca essa chance única!
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-8 space-y-6">
          <div className="text-center space-y-4">
            <div className="inline-block">
              <div className="text-5xl font-bold gradient-text mb-2">15% OFF</div>
              <p className="text-sm text-muted-foreground">
                No seu primeiro mês Premium
              </p>
            </div>

            <div className="bg-luna-pink-light/30 border-2 border-primary/20 rounded-lg p-4">
              <p className="font-semibold mb-2">Use o cupom:</p>
              <code className="text-2xl font-mono font-bold gradient-text">
                PRIMEIRA15
              </code>
            </div>

            <ul className="text-left space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Luna Sense 24/7 ilimitado para te acompanhar</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Análises de beleza personalizadas por fase</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>SOS Feminino com respostas instantâneas</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button 
              size="lg" 
              variant="cta" 
              className="w-full text-lg"
              onClick={handleClaim}
            >
              <Gift className="w-5 h-5 mr-2" />
              Resgatar 15% OFF Agora
            </Button>
            
            <button
              onClick={() => setIsOpen(false)}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Não, prefiro pagar preço cheio
            </button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            ⏰ Oferta válida apenas para novos usuários • Cancele quando quiser
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
