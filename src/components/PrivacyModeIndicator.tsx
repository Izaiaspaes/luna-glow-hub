import { Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useProfile } from "@/hooks/useProfile";

export function PrivacyModeIndicator() {
  const { profile } = useProfile();

  if (!profile?.privacy_mode) {
    return null;
  }

  return (
    <Badge variant="outline" className="gap-1.5 border-primary/50 bg-primary/10">
      <Shield className="w-3 h-3" />
      Modo Privacidade Ultra
    </Badge>
  );
}
