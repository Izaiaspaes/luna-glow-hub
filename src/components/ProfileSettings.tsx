import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
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
import { Loader2, Palette } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
  const { profile, updateProfile } = useProfile();
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [selectedTheme, setSelectedTheme] = useState(profile?.theme || "default");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await updateProfile({
      full_name: fullName,
      avatar_url: avatarUrl,
      theme: selectedTheme,
    });
    setSaving(false);
    onOpenChange(false);
    
    // Reload page to apply theme
    if (selectedTheme !== profile?.theme) {
      window.location.reload();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configurações do Perfil</DialogTitle>
          <DialogDescription>
            Personalize seu perfil e escolha o tema de cores do seu dashboard
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Personal Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Informações Pessoais</h3>
            
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
              <Label htmlFor="avatarUrl">URL do Avatar</Label>
              <Input
                id="avatarUrl"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://..."
              />
              {avatarUrl && (
                <div className="flex items-center gap-2 mt-2">
                  <img
                    src={avatarUrl}
                    alt="Preview"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <span className="text-xs text-muted-foreground">Preview</span>
                </div>
              )}
            </div>
          </div>

          {/* Theme Selection */}
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
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Alterações
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
