import { useState, useRef, useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { setEncryptionPassword, clearEncryptionPassword } from "@/lib/encryption";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2, Palette, Upload, User, Mail, Phone, Lock, Heart, Shield, FileText, Watch, Globe } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PartnerSharing } from "@/components/PartnerSharing";
import { OnboardingDataView } from "@/components/OnboardingDataView";
import { WearableIntegration } from "@/components/WearableIntegration";
import { PushNotificationPrompt } from './PushNotificationPrompt';
import { NotificationSettings } from './NotificationSettings';

interface ProfileSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const themes = [
  {
    id: "default",
    name: "Padrão Luna",
    description: "Rosa suave e acolhedor",
    preview: "bg-gradient-to-r from-pink-100 to-purple-100",
  },
  {
    id: "sunset",
    name: "Pôr do Sol",
    description: "Laranja e dourado vibrante",
    preview: "bg-gradient-to-r from-orange-100 to-amber-100",
  },
  {
    id: "ocean",
    name: "Oceano",
    description: "Azul calmo e refrescante",
    preview: "bg-gradient-to-r from-blue-100 to-cyan-100",
  },
  {
    id: "forest",
    name: "Floresta",
    description: "Verde natural e relaxante",
    preview: "bg-gradient-to-r from-green-100 to-emerald-100",
  },
  {
    id: "lavender",
    name: "Lavanda",
    description: "Lilás sereno e elegante",
    preview: "bg-gradient-to-r from-purple-100 to-violet-100",
  },
  {
    id: "rose",
    name: "Rosa Chá",
    description: "Rosa delicado e sofisticado",
    preview: "bg-gradient-to-r from-rose-100 to-pink-100",
  },
];

export function ProfileSettings({ open, onOpenChange }: ProfileSettingsProps) {
  const { profile, updateProfile, refreshProfile } = useProfile();
  const { user } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [email, setEmail] = useState(user?.email || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedTheme, setSelectedTheme] = useState(profile?.theme || "default");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url || "");
  const [privacyMode, setPrivacyMode] = useState(profile?.privacy_mode || false);
  const [encryptionPassword, setEncryptionPasswordLocal] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setPrivacyMode(profile.privacy_mode || false);
    }
  }, [profile]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, selecione uma imagem.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O tamanho máximo é 2MB.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Delete old avatar if exists
      if (profile?.avatar_url) {
        const oldPath = profile.avatar_url.split('/').slice(-2).join('/');
        await supabase.storage.from('avatars').remove([oldPath]);
      }

      // Upload new avatar
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      setAvatarPreview(publicUrl);

      // Update profile with new avatar URL
      await updateProfile({ avatar_url: publicUrl });
      await refreshProfile();

      toast({
        title: "Avatar atualizado",
        description: "Sua foto de perfil foi atualizada com sucesso.",
      });
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Erro ao fazer upload",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    await updateProfile({
      full_name: fullName,
      phone: phone,
      theme: selectedTheme,
    });
    setSaving(false);
    
    // Reload page to apply theme
    if (selectedTheme !== profile?.theme) {
      window.location.reload();
    }
  };

  const handleSaveAccount = async () => {
    setSaving(true);

    try {
      // Update email if changed
      if (email !== user?.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: email,
        });

        if (emailError) throw emailError;

        toast({
          title: "Email atualizado",
          description: "Um email de confirmação foi enviado para o novo endereço.",
        });
      }

      // Update password if provided
      if (newPassword) {
        if (newPassword !== confirmPassword) {
          toast({
            title: "Senhas não coincidem",
            description: "As senhas digitadas não são iguais.",
            variant: "destructive",
          });
          setSaving(false);
          return;
        }

        if (newPassword.length < 6) {
          toast({
            title: "Senha muito curta",
            description: "A senha deve ter pelo menos 6 caracteres.",
            variant: "destructive",
          });
          setSaving(false);
          return;
        }

        const { error: passwordError } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (passwordError) throw passwordError;

        toast({
          title: "Senha atualizada",
          description: "Sua senha foi alterada com sucesso.",
        });

        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePrivacyModeToggle = async (enabled: boolean) => {
    if (enabled && !encryptionPassword) {
      toast({
        title: "Senha necessária",
        description: "Configure uma senha de criptografia para ativar o Modo Privacidade Ultra",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await updateProfile({
        privacy_mode: enabled,
        encryption_enabled: enabled,
      });

      if (error) throw error;

      setPrivacyMode(enabled);

      if (enabled && encryptionPassword) {
        setEncryptionPassword(encryptionPassword);
        toast({
          title: "Modo Privacidade Ultra ativado",
          description: "Seus dados sensíveis agora são criptografados com sua senha pessoal",
        });
      } else {
        clearEncryptionPassword();
        toast({
          title: "Modo Privacidade Ultra desativado",
          description: "A criptografia adicional foi removida",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configurações</DialogTitle>
          <DialogDescription>
            Gerencie seu perfil, dados da conta e preferências
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="flex w-full flex-wrap gap-1 h-auto p-2">
            <TabsTrigger value="profile" className="flex-1 min-w-[120px]">
              <User className="h-4 w-4 mr-2" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="account" className="flex-1 min-w-[120px]">
              <Lock className="h-4 w-4 mr-2" />
              Conta
            </TabsTrigger>
            <TabsTrigger value="onboarding" className="flex-1 min-w-[140px]">
              <FileText className="h-4 w-4 mr-2" />
              Dados Pessoais
            </TabsTrigger>
            <TabsTrigger value="sharing" data-tour="partner" className="flex-1 min-w-[140px]">
              <Heart className="h-4 w-4 mr-2" />
              Compartilhar
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex-1 min-w-[130px]">
              <Palette className="h-4 w-4 mr-2" />
              Aparência
            </TabsTrigger>
            <TabsTrigger value="wearables" className="flex-1 min-w-[130px]">
              <Watch className="h-4 w-4 mr-2" />
              Wearables
            </TabsTrigger>
            <TabsTrigger value="language" className="flex-1 min-w-[120px]">
              <Globe className="h-4 w-4 mr-2" />
              Idioma
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex-1 min-w-[130px]">
              <Shield className="h-4 w-4 mr-2" />
              Privacidade
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4 py-4">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Foto de Perfil</h3>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                      <Loader2 className="h-6 w-6 animate-spin text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading ? "Enviando..." : "Escolher Imagem"}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    JPG, PNG ou GIF. Máximo 2MB.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="fullName">Nome Completo</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Seu nome completo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  <Phone className="h-4 w-4 inline mr-2" />
                  Telefone
                </Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(00) 00000-0000"
                  type="tel"
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveProfile} disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Salvar Perfil
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-4 py-4">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Dados da Conta</h3>

              <div className="space-y-2">
                <Label htmlFor="email">
                  <Mail className="h-4 w-4 inline mr-2" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                />
                <p className="text-xs text-muted-foreground">
                  Ao alterar o email, você receberá uma confirmação.
                </p>
              </div>

              <Separator />

              <h3 className="text-sm font-semibold">Alterar Senha</h3>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova Senha</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a nova senha"
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveAccount} disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Salvar Alterações
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Onboarding Data Tab */}
          <TabsContent value="onboarding" className="space-y-4 py-4">
            <OnboardingDataView />
          </TabsContent>

          {/* Sharing Tab */}
          <TabsContent value="sharing" className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <h3 className="text-sm font-semibold">Compartilhamento</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Compartilhe seu ciclo com seu(sua) parceiro(a) de forma segura
              </p>
              <PartnerSharing />
            </div>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <h3 className="text-sm font-semibold">Tema de Cores</h3>
              </div>
              
              <RadioGroup value={selectedTheme} onValueChange={setSelectedTheme}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {themes.map((theme) => (
                    <div key={theme.id} className="relative">
                      <RadioGroupItem
                        value={theme.id}
                        id={theme.id}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={theme.id}
                        className="flex flex-col gap-2 rounded-lg border-2 border-muted p-4 hover:bg-accent cursor-pointer peer-data-[state=checked]:border-primary"
                      >
                        <div className={`h-16 rounded-md ${theme.preview}`} />
                        <div>
                          <p className="font-semibold text-sm">{theme.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {theme.description}
                          </p>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveProfile} disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Aplicar Tema
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Wearables Tab */}
          <TabsContent value="wearables" className="space-y-4 py-4">
            <WearableIntegration />
          </TabsContent>

          {/* Language Tab */}
          <TabsContent value="language" className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <h3 className="text-sm font-semibold">Idioma da Interface</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Escolha o idioma de sua preferência para a interface do aplicativo
              </p>
              
              <LanguageSelector />
            </div>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <h3 className="text-sm font-semibold">Modo Privacidade Ultra</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Ative criptografia adicional para seus dados mais sensíveis
              </p>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="privacy-mode">Criptografia Adicional</Label>
                  <p className="text-sm text-muted-foreground">
                    Seus dados de rastreamento serão criptografados com sua senha pessoal
                  </p>
                </div>
                <Switch
                  id="privacy-mode"
                  checked={privacyMode}
                  onCheckedChange={handlePrivacyModeToggle}
                />
              </div>

              {!privacyMode && (
                <div className="space-y-2">
                  <Label htmlFor="encryption-password">Senha de Criptografia</Label>
                  <Input
                    id="encryption-password"
                    type="password"
                    placeholder="Crie uma senha forte"
                    value={encryptionPassword}
                    onChange={(e) => setEncryptionPasswordLocal(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    ⚠️ Importante: Se você esquecer esta senha, não será possível recuperar seus dados criptografados.
                  </p>
                </div>
              )}

              {privacyMode && (
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-start gap-2">
                    <Shield className="w-5 h-5 text-primary mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Modo Privacidade Ultra Ativo</p>
                      <p className="text-xs text-muted-foreground">
                        Seus dados de ciclo, humor, energia e sono estão sendo criptografados com segurança máxima.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            <PushNotificationPrompt />
            
            <Separator />

            <NotificationSettings />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
