import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ArrowLeft, Calendar, AlertCircle, Book } from "lucide-react";
import NotificationBell from "@/components/partner/NotificationBell";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { WhatsAppButton } from "@/components/WhatsAppButton";

interface PartnerData {
  ownerName: string;
  currentPhase: string;
  nextPeriodDate: string | null;
  sharingSettings: {
    cycle: boolean;
    symptoms: boolean;
    mood: boolean;
    energy: boolean;
  };
}

const phaseInfo: Record<string, {
  title: string;
  description: string;
  tips: string[];
  emoji: string;
}> = {
  menstrual: {
    title: "Fase Menstrual",
    emoji: "🩸",
    description: "É a fase da menstruação, onde os níveis hormonais estão baixos. Ela pode se sentir mais cansada e precisar de mais descanso.",
    tips: [
      "Seja compreensivo e ofereça apoio emocional",
      "Ajude com tarefas domésticas se possível",
      "Respeite se ela quiser ficar mais em casa e descansar",
      "Ofereça um chá quente ou bolsa térmica para cólicas",
      "Evite cobranças ou discussões importantes",
    ],
  },
  folicular: {
    title: "Fase Folicular",
    emoji: "🌱",
    description: "Após a menstruação, os níveis de estrogênio começam a subir. Ela terá mais energia, criatividade e motivação.",
    tips: [
      "É um ótimo momento para atividades em casal",
      "Aproveite a energia dela para programas especiais",
      "Apoie novos projetos e ideias dela",
      "Faça planos para o futuro juntos",
      "Ela estará mais comunicativa e social",
    ],
  },
  ovulatoria: {
    title: "Fase Ovulatória",
    emoji: "✨",
    description: "É o pico de energia e confiança! Os níveis hormonais estão no auge. Ela se sentirá mais atraente e sociável.",
    tips: [
      "É a fase de maior conexão e intimidade",
      "Planeje um encontro romântico especial",
      "Ela estará mais receptiva a conversas profundas",
      "Aproveite a energia positiva dela",
      "É um bom momento para resolver pendências juntos",
    ],
  },
  lutea: {
    title: "Fase Lútea",
    emoji: "🌙",
    description: "A progesterona aumenta e pode trazer sintomas de TPM: irritabilidade, sensibilidade emocional, inchaço. Ela pode precisar de mais espaço.",
    tips: [
      "Seja especialmente paciente e compreensivo",
      "Evite críticas e discussões desnecessárias",
      "Ofereça apoio sem ser invasivo",
      "Pergunte como pode ajudar",
      "Respeite se ela precisar de tempo sozinha",
      "Pequenos gestos de carinho fazem diferença",
    ],
  },
};

export default function PartnerDashboard() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [partnerData, setPartnerData] = useState<PartnerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    } else if (user) {
      loadPartnerData();
    }
  }, [user, loading, navigate]);

  const loadPartnerData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Get relationship
      const { data: relationship, error: relError } = await supabase
        .from("partner_relationships")
        .select("*")
        .eq("partner_user_id", user.id)
        .eq("status", "accepted")
        .single();

      if (relError || !relationship) {
        navigate("/");
        return;
      }

      // Get owner profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("user_id", relationship.owner_user_id)
        .single();

      // Get latest cycle data
      const { data: cycleData } = await supabase
        .from("cycle_tracking")
        .select("*")
        .eq("user_id", relationship.owner_user_id)
        .order("cycle_start_date", { ascending: false })
        .limit(1)
        .single();

      setPartnerData({
        ownerName: profile?.full_name || "Sua parceira",
        currentPhase: getCurrentPhase(cycleData),
        nextPeriodDate: cycleData?.cycle_start_date
          ? calculateNextPeriod(cycleData.cycle_start_date, cycleData.cycle_length || 28)
          : null,
        sharingSettings: relationship.sharing_settings as unknown as PartnerData["sharingSettings"],
      });
    } catch (error: any) {
      console.error("Error loading partner data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentPhase = (cycleData: any): string => {
    if (!cycleData) return "unknown";
    
    const cycleStart = new Date(cycleData.cycle_start_date);
    const today = new Date();
    const daysSinceStart = Math.floor((today.getTime() - cycleStart.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceStart <= 5) return "menstrual";
    if (daysSinceStart <= 13) return "folicular";
    if (daysSinceStart <= 17) return "ovulatoria";
    return "lutea";
  };

  const calculateNextPeriod = (lastPeriod: string, cycleLength: number): string => {
    const lastDate = new Date(lastPeriod);
    lastDate.setDate(lastDate.getDate() + cycleLength);
    return lastDate.toISOString();
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!partnerData) {
    return null;
  }

  const currentPhaseData = phaseInfo[partnerData.currentPhase] || phaseInfo.menstrual;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary fill-primary" />
              <span className="text-xl font-semibold">Luna a Dois</span>
            </div>
            <div className="flex items-center gap-2">
              <NotificationBell />
              <Button onClick={() => navigate("/")} variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <Button onClick={handleSignOut} variant="outline" size="sm">
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Acompanhando o ciclo de {partnerData.ownerName}
          </h1>
          <p className="text-muted-foreground">
            Entenda melhor o ciclo menstrual e saiba como oferecer apoio em cada fase
          </p>
        </div>

        <div className="grid gap-6">
          {/* Current Phase Card */}
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <span className="text-3xl">{currentPhaseData.emoji}</span>
                  {currentPhaseData.title}
                </CardTitle>
                <Badge variant="default">Fase Atual</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                {currentPhaseData.description}
              </p>

              {partnerData.nextPeriodDate && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>
                    Próxima menstruação prevista:{" "}
                    <strong>
                      {format(new Date(partnerData.nextPeriodDate), "dd 'de' MMMM", {
                        locale: ptBR,
                      })}
                    </strong>
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary" />
                Como você pode apoiar agora
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {currentPhaseData.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-primary">
                        {index + 1}
                      </span>
                    </div>
                    <span className="text-sm leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Educational Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="w-5 h-5 text-primary" />
                Entendendo as 4 fases do ciclo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {Object.entries(phaseInfo).map(([key, info]) => (
                  <div
                    key={key}
                    className={`p-4 rounded-lg border ${
                      key === partnerData.currentPhase
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{info.emoji}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{info.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <WhatsAppButton />
    </div>
  );
}
