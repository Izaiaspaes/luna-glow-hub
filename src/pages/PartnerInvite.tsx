import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Heart, Check, X, Loader2 } from "lucide-react";
import { Footer } from "@/components/Footer";

export default function PartnerInvite() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inviteData, setInviteData] = useState<any>(null);
  const [ownerProfile, setOwnerProfile] = useState<any>(null);

  useEffect(() => {
    loadInvite();
  }, []);

  const loadInvite = async () => {
    const token = searchParams.get("token");
    if (!token) {
      toast.error("Token de convite inválido");
      navigate("/");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("partner_relationships")
        .select("*")
        .eq("invite_token", token)
        .eq("status", "pending")
        .single();

      if (error || !data) {
        toast.error("Convite não encontrado ou já foi processado");
        navigate("/");
        return;
      }

      setInviteData(data);

      // Load owner profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("user_id", data.owner_user_id)
        .single();

      setOwnerProfile(profile);
    } catch (error: any) {
      console.error("Error loading invite:", error);
      toast.error("Erro ao carregar convite");
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResponse = async (accept: boolean) => {
    if (!inviteData) return;

    setIsProcessing(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Você precisa estar logado para aceitar o convite");
        navigate("/auth");
        return;
      }

      const { error } = await supabase
        .from("partner_relationships")
        .update({
          status: accept ? "accepted" : "declined",
          partner_user_id: user.id,
          accepted_at: accept ? new Date().toISOString() : null,
        })
        .eq("id", inviteData.id);

      if (error) throw error;

      if (accept) {
        toast.success("Convite aceito! Bem-vindo(a) ao Luna a Dois");
        navigate("/partner-dashboard");
      } else {
        toast.success("Convite recusado");
        navigate("/");
      }
    } catch (error: any) {
      console.error("Error responding to invite:", error);
      toast.error("Erro ao processar resposta");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">Luna</span>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
        <Card className="max-w-lg w-full">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-white fill-white" />
            </div>
            <CardTitle className="text-2xl">Luna a Dois</CardTitle>
            <p className="text-muted-foreground">
              Você recebeu um convite especial
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-muted/50 p-4 rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Convite de:
              </p>
              <p className="text-lg font-semibold">
                {ownerProfile?.full_name || inviteData?.partner_email}
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Ao aceitar, você poderá acompanhar o ciclo menstrual de forma
                educativa e respeitosa, com acesso a:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>
                    Visualização do ciclo atual e previsão das próximas fases
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>
                    Conteúdo educativo sobre cada fase do ciclo menstrual
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>
                    Dicas personalizadas de apoio emocional e comportamental
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Notificações sobre mudanças importantes no ciclo</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => handleResponse(true)}
                disabled={isProcessing}
                className="flex-1"
                size="lg"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Check className="w-4 h-4 mr-2" />
                )}
                Aceitar Convite
              </Button>
              <Button
                onClick={() => handleResponse(false)}
                disabled={isProcessing}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                <X className="w-4 h-4 mr-2" />
                Recusar
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Seus dados sempre permanecerão privados e você poderá cancelar o
              compartilhamento a qualquer momento.
            </p>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
