import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Shield, Cookie } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export const CookieConsent = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  const tx = (key: string, fallback: string) => {
    const value = t(key, { defaultValue: fallback });
    return value === key ? fallback : value;
  };

  useEffect(() => {
    const consent = localStorage.getItem("luna-cookie-consent");
    if (!consent) {
      // Show banner after 1 second delay for better UX
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("luna-cookie-consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("luna-cookie-consent", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-in slide-in-from-bottom duration-500">
      <div className="container mx-auto max-w-6xl">
        <div className="relative bg-card/95 backdrop-blur-xl border-2 border-border rounded-2xl shadow-elegant p-6 md:p-8">
          <button
            onClick={handleDecline}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={tx("common.close", "Fechar")}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-gradient-colorful flex items-center justify-center">
                <Cookie className="w-8 h-8 text-white" />
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-semibold">{tx("cookies.title", "Sua Privacidade Importa")}</h3>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/20 text-secondary text-xs font-medium">
                  <Shield className="w-3.5 h-3.5" />
                  {tx("cookies.lgpdBadge", "Conforme LGPD")}
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground leading-relaxed">
                {tx("cookies.description", "Usamos cookies essenciais para o funcionamento do site e cookies analíticos para melhorar sua experiência. Você pode aceitar todos ou apenas os essenciais.")}
              </p>

              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <Link to="/privacy-policy" className="hover:text-foreground transition-colors underline">
                  {tx("cookies.privacyPolicy", "Política de Privacidade")}
                </Link>
                <Link to="/terms" className="hover:text-foreground transition-colors underline">
                  {tx("cookies.terms", "Termos de Uso")}
                </Link>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto md:flex-shrink-0">
              <Button
                variant="outline"
                onClick={handleDecline}
                className="w-full sm:w-auto"
              >
                {tx("cookies.decline", "Apenas Essenciais")}
              </Button>
              <Button
                onClick={handleAccept}
                className="w-full sm:w-auto bg-gradient-colorful text-white hover:opacity-90"
              >
                {tx("cookies.accept", "Aceitar Todos")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
