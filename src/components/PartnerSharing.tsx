import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { z } from "zod";
import { Heart, Mail, Trash2, UserPlus, Shield } from "lucide-react";

const emailSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "E-mail inválido" })
    .max(255, { message: "E-mail muito longo" })
    .toLowerCase(),
});

interface PartnerRelationship {
  id: string;
  partner_email: string;
  status: string;
  invited_at: string;
  accepted_at: string | null;
  sharing_settings: {
    cycle: boolean;
    symptoms: boolean;
    mood: boolean;
    energy: boolean;
  };
}

export const PartnerSharing = () => {
  const [partnerEmail, setPartnerEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [relationship, setRelationship] = useState<PartnerRelationship | null>(
    null
  );
  const [sharingSettings, setSharingSettings] = useState({
    cycle: true,
    symptoms: true,
    mood: true,
    energy: true,
  });

  useEffect(() => {
    loadRelationship();
  }, []);

  const loadRelationship = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("partner_relationships")
        .select("*")
        .eq("owner_user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (data) {
        setRelationship(data as unknown as PartnerRelationship);
        setSharingSettings(data.sharing_settings as unknown as typeof sharingSettings);
      }
    } catch (error: any) {
      console.error("Error loading relationship:", error);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = emailSchema.safeParse({ email: partnerEmail });
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    setIsLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      // Get user profile for name
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("user_id", user.id)
        .single();

      // Generate invite token
      const inviteToken = crypto.randomUUID();

      // Create relationship
      const { error: insertError } = await supabase
        .from("partner_relationships")
        .insert({
          owner_user_id: user.id,
          partner_email: validation.data.email,
          invite_token: inviteToken,
          sharing_settings: sharingSettings,
        });

      if (insertError) throw insertError;

      // Send invite email
      console.log("Sending partner invite email...", {
        partnerEmail: validation.data.email,
        ownerName: profile?.full_name || user.email,
        inviteToken,
      });
      
      const { data: emailData, error: emailError } = await supabase.functions.invoke(
        "send-partner-invite",
        {
          body: {
            partnerEmail: validation.data.email,
            ownerName: profile?.full_name || user.email,
            inviteToken,
          },
        }
      );

      console.log("Email response:", { emailData, emailError });

      if (emailError) {
        console.error("Error sending invite email:", emailError);
        toast.warning(
          "Convite criado, mas houve um problema ao enviar o e-mail. O convite está ativo, compartilhe o link manualmente se necessário."
        );
      } else if (emailData?.error) {
        console.error("Email service error:", emailData.error);
        toast.warning(
          "Convite criado, mas o serviço de e-mail retornou um erro. O convite está ativo."
        );
      } else {
        toast.success("Convite enviado com sucesso! O parceiro receberá um e-mail.");
      }

      setPartnerEmail("");
      loadRelationship();
    } catch (error: any) {
      console.error("Error sending invite:", error);
      toast.error("Erro ao enviar convite. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevoke = async () => {
    if (!relationship) return;

    try {
      const { error } = await supabase
        .from("partner_relationships")
        .delete()
        .eq("id", relationship.id);

      if (error) throw error;

      toast.success("Compartilhamento revogado com sucesso");
      setRelationship(null);
    } catch (error: any) {
      console.error("Error revoking relationship:", error);
      toast.error("Erro ao revogar compartilhamento");
    }
  };

  const updateSharingSettings = async (key: string, value: boolean) => {
    if (!relationship) return;

    const newSettings = { ...sharingSettings, [key]: value };
    setSharingSettings(newSettings);

    try {
      const { error } = await supabase
        .from("partner_relationships")
        .update({ sharing_settings: newSettings })
        .eq("id", relationship.id);

      if (error) throw error;

      toast.success("Configurações atualizadas");
    } catch (error: any) {
      console.error("Error updating settings:", error);
      toast.error("Erro ao atualizar configurações");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            <CardTitle>Luna a Dois</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Compartilhe seu ciclo com seu(sua) parceiro(a) de forma segura e
            educativa
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {!relationship && (
            <form onSubmit={handleInvite} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="partner-email">E-mail do(a) Parceiro(a)</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="partner-email"
                      type="email"
                      placeholder="parceiro@email.com"
                      value={partnerEmail}
                      onChange={(e) => setPartnerEmail(e.target.value)}
                      className="pl-10"
                      disabled={isLoading}
                      maxLength={255}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={isLoading}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    {isLoading ? "Enviando..." : "Convidar"}
                  </Button>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Shield className="w-4 h-4" />
                  O que seu(sua) parceiro(a) poderá ver:
                </div>
                <div className="space-y-2">
                  {[
                    { key: "cycle", label: "Fase do ciclo atual" },
                    { key: "symptoms", label: "Sintomas registrados" },
                    { key: "mood", label: "Humor" },
                    { key: "energy", label: "Nível de energia" },
                  ].map(({ key, label }) => (
                    <div
                      key={key}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm">{label}</span>
                      <Switch
                        checked={sharingSettings[key as keyof typeof sharingSettings]}
                        onCheckedChange={(checked) =>
                          setSharingSettings({
                            ...sharingSettings,
                            [key]: checked,
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </form>
          )}

          {relationship && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{relationship.partner_email}</p>
                  <Badge
                    variant={
                      relationship.status === "accepted" ? "default" : "secondary"
                    }
                  >
                    {relationship.status === "accepted"
                      ? "Aceito"
                      : relationship.status === "pending"
                      ? "Aguardando aceite"
                      : "Declinado"}
                  </Badge>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Revogar
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Revogar compartilhamento?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Seu(sua) parceiro(a) perderá acesso às informações
                        compartilhadas. Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleRevoke}>
                        Confirmar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              {relationship.status === "accepted" && (
                <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Shield className="w-4 h-4" />
                    Configurações de compartilhamento:
                  </div>
                  <div className="space-y-2">
                    {[
                      { key: "cycle", label: "Fase do ciclo atual" },
                      { key: "symptoms", label: "Sintomas registrados" },
                      { key: "mood", label: "Humor" },
                      { key: "energy", label: "Nível de energia" },
                    ].map(({ key, label }) => (
                      <div
                        key={key}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm">{label}</span>
                        <Switch
                          checked={
                            sharingSettings[key as keyof typeof sharingSettings]
                          }
                          onCheckedChange={(checked) =>
                            updateSharingSettings(key, checked)
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
