import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Sparkles, 
  Calendar,
  Mic,
  Users,
  TrendingUp,
  ArrowRight
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const PricingSuccess = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, subscriptionStatus } = useAuth();

  useEffect(() => {
    // If not logged in, redirect to auth
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const premiumFeatures = [
    {
      icon: Sparkles,
      title: "Planos Ilimitados",
      description: "Crie quantos planos de bem-estar personalizados quiser simultaneamente"
    },
    {
      icon: Mic,
      title: "Transcrição por Voz",
      description: "Registre seus dados usando voz em todos os formulários de rastreamento"
    },
    {
      icon: Calendar,
      title: "Previsões Inteligentes",
      description: "Receba previsões de sintomas baseadas em IA e histórico"
    },
    {
      icon: Users,
      title: "Luna a Dois",
      description: "Compartilhe seu ciclo com parceiro(a) e receba dicas de apoio"
    },
    {
      icon: TrendingUp,
      title: "Análises Avançadas",
      description: "Acesse relatórios detalhados e insights sobre sua saúde"
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-luna-pink/10 via-luna-purple/10 to-background py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Success Header */}
          <div className="text-center space-y-4 animate-fade-in">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-luna-pink via-luna-purple to-luna-blue rounded-full blur-2xl opacity-30 animate-pulse"></div>
                <CheckCircle2 className="w-24 h-24 text-luna-purple relative z-10" strokeWidth={1.5} />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-luna-pink via-luna-purple to-luna-blue bg-clip-text text-transparent">
              Bem-vinda ao Premium! 🎉
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Sua assinatura foi confirmada com sucesso. Agora você tem acesso a todos os recursos premium da Luna!
            </p>

            <Badge variant="secondary" className="text-lg px-6 py-2">
              <Sparkles className="w-5 h-5 mr-2" />
              Plano Premium Ativo
            </Badge>
          </div>

          {/* Premium Features Grid */}
          <Card className="border-luna-purple/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">O que você desbloqueia agora:</CardTitle>
              <CardDescription>
                Explore todos os recursos exclusivos do plano Premium
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {premiumFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div 
                      key={index}
                      className="flex gap-4 p-4 rounded-lg border border-border/50 hover:border-luna-purple/30 transition-all hover:shadow-md"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-luna-pink/20 to-luna-purple/20 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-luna-purple" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold text-lg">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="border-luna-blue/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Próximos Passos</CardTitle>
              <CardDescription>
                Comece a aproveitar sua experiência Premium
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-luna-purple/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-luna-purple font-semibold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Complete seu Onboarding</h4>
                    <p className="text-sm text-muted-foreground">
                      Se ainda não fez, complete suas informações para receber recomendações mais personalizadas
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-luna-purple/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-luna-purple font-semibold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Comece a Rastrear seus Dados</h4>
                    <p className="text-sm text-muted-foreground">
                      Use a transcrição por voz para registrar ciclo, sono, humor e nutrição de forma rápida
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-luna-purple/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-luna-purple font-semibold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Gere seus Planos Personalizados</h4>
                    <p className="text-sm text-muted-foreground">
                      Crie múltiplos planos de bem-estar com IA e organize-os no calendário
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-luna-purple/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-luna-purple font-semibold">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Explore Luna a Dois</h4>
                    <p className="text-sm text-muted-foreground">
                      Convide seu/sua parceiro(a) para compartilhar insights e receber dicas de apoio
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Button */}
          <div className="text-center space-y-4">
            <Button
              size="lg"
              onClick={() => navigate("/dashboard")}
              className="bg-gradient-to-r from-luna-pink via-luna-purple to-luna-blue hover:opacity-90 text-white px-8 py-6 text-lg group"
            >
              Ir para o Dashboard
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <p className="text-sm text-muted-foreground">
              Alguma dúvida? Entre em contato via WhatsApp ou e-mail
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PricingSuccess;
