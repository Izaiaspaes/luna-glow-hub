import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertCircle, Heart, Wind, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "@/hooks/use-toast";

const sosOptions = [
  {
    title: "Dor Física",
    icon: AlertCircle,
    color: "text-red-500",
    techniques: [
      "Respire profundamente por 5 minutos",
      "Aplique uma compressa morna na região",
      "Faça uma leve massagem circular",
      "Tome um chá de camomila",
    ],
    message: "Eu sei que está doendo. Você é forte e vai passar por isso. Que tal tentar uma dessas técnicas para aliviar?"
  },
  {
    title: "Ansiedade/Estresse",
    icon: Wind,
    color: "text-orange-500",
    techniques: [
      "Técnica 5-4-3-2-1: Identifique 5 coisas que vê, 4 que toca, 3 que ouve, 2 que cheira, 1 que saboreia",
      "Respiração 4-7-8: Inspire por 4s, segure 7s, expire por 8s",
      "Caminhe por 10 minutos",
      "Ouça uma música relaxante",
    ],
    message: "Está tudo bem sentir isso. Você não está sozinha. Vamos tentar acalmar juntas?"
  },
  {
    title: "Cansaço Extremo",
    icon: Sparkles,
    color: "text-blue-500",
    techniques: [
      "Tire um cochilo de 20 minutos",
      "Beba um copo de água gelada",
      "Faça alongamentos suaves",
      "Saia para tomar um ar fresco",
    ],
    message: "Seu corpo está pedindo descanso. Não há problema em pausar. Você merece esse cuidado."
  },
  {
    title: "Irritação/TPM",
    icon: Heart,
    color: "text-luna-pink",
    techniques: [
      "Escreva seus sentimentos em um papel",
      "Faça uma meditação guiada de 5 minutos",
      "Tome um banho relaxante",
      "Assista algo que te faça rir",
    ],
    message: "Seus sentimentos são válidos. É normal se sentir assim nesta fase. Vamos encontrar uma forma de te ajudar?"
  },
];

export function SOSButton() {
  const { subscriptionStatus, userProfile } = useAuth();
  const { profile } = useProfile();
  const [showDialog, setShowDialog] = useState(false);
  const [selectedOption, setSelectedOption] = useState<typeof sosOptions[0] | null>(null);

  const hasPremiumPlus = 
    subscriptionStatus?.product_id === "prod_TVfx4bH4H0okVe" || 
    subscriptionStatus?.product_id === "prod_TVfxAziuEOC4QN" ||
    userProfile?.subscription_plan === "premium_plus" ||
    profile?.subscription_plan === "premium_plus";

  const handleSOSClick = () => {
    if (!hasPremiumPlus) {
      toast({
        title: "Recurso Premium Plus",
        description: "O SOS Feminino está disponível apenas no plano Premium Plus",
        variant: "destructive",
      });
      return;
    }
    setShowDialog(true);
  };

  return (
    <>
      <Button
        onClick={handleSOSClick}
        className="fixed bottom-24 right-6 z-50 h-16 w-16 rounded-full bg-gradient-to-r from-red-500 to-pink-500 hover:opacity-90 shadow-lg hover:shadow-xl transition-all animate-pulse"
        size="icon"
      >
        <AlertCircle className="w-8 h-8 text-white" />
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Heart className="w-6 h-6 text-luna-pink" />
              SOS Feminino
            </DialogTitle>
            <DialogDescription>
              Estou aqui para te ajudar. O que você está sentindo agora?
            </DialogDescription>
          </DialogHeader>

          {!selectedOption ? (
            <div className="grid grid-cols-2 gap-4 mt-4">
              {sosOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Card
                    key={option.title}
                    className="cursor-pointer hover:border-primary transition-all hover:shadow-md"
                    onClick={() => setSelectedOption(option)}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Icon className={`w-6 h-6 ${option.color}`} />
                        <CardTitle className="text-lg">{option.title}</CardTitle>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="space-y-6 mt-4">
              <Card className="border-2 border-luna-pink/30 bg-luna-pink/5">
                <CardContent className="pt-6">
                  <p className="text-muted-foreground italic">{selectedOption.message}</p>
                </CardContent>
              </Card>

              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-luna-purple" />
                  Técnicas para ajudar agora
                </h3>
                <div className="space-y-3">
                  {selectedOption.techniques.map((technique, index) => (
                    <Card key={index} className="hover:bg-muted/50 transition-smooth">
                      <CardContent className="py-4">
                        <p className="text-sm flex items-start gap-3">
                          <span className="text-luna-purple font-bold">{index + 1}.</span>
                          {technique}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedOption(null)}
                  className="flex-1"
                >
                  Voltar
                </Button>
                <Button
                  onClick={() => {
                    toast({
                      title: "💜 Você consegue!",
                      description: "Lembre-se: você é forte e merece cuidado",
                    });
                    setShowDialog(false);
                    setSelectedOption(null);
                  }}
                  className="flex-1 bg-gradient-to-r from-luna-purple to-luna-pink text-white"
                >
                  Estou melhor agora
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
