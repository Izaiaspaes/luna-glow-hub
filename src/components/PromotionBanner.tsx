import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Gift, X, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const PromotionBanner = () => {
  const { t, i18n } = useTranslation();
  const [isVisible, setIsVisible] = useState(() => {
    const dismissed = localStorage.getItem("promotion-banner-dismissed");
    return !dismissed;
  });

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("promotion-banner-dismissed", "true");
  };

  if (!isVisible) return null;

  const messages = {
    pt: {
      title: "Indique e Ganhe 10% OFF!",
      description: "Convide amigas para a Luna e ganhe desconto na sua assinatura.",
      cta: "Ver Regras"
    },
    en: {
      title: "Refer and Get 10% OFF!",
      description: "Invite friends to Luna and get a discount on your subscription.",
      cta: "View Rules"
    },
    es: {
      title: "¡Indica y Gana 10% OFF!",
      description: "Invita amigas a Luna y gana descuento en tu suscripción.",
      cta: "Ver Reglas"
    }
  };

  const lang = i18n.language?.substring(0, 2) as keyof typeof messages;
  const content = messages[lang] || messages.pt;

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-luna-purple via-luna-pink to-luna-orange text-white">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00em0wLTMwYzAtMi4yIDEuOC00IDQtNHM0IDEuOCA0IDQtMS44IDQtNCA0LTQtMS44LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
      
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm">
              <Gift className="w-5 h-5" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 sm:hidden" />
                <span className="font-bold text-sm sm:text-base">{content.title}</span>
              </div>
              <span className="text-white/90 text-xs sm:text-sm hidden sm:block">{content.description}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Link to="/promotion-rules">
              <Button 
                size="sm" 
                variant="secondary" 
                className="bg-white/20 hover:bg-white/30 text-white border-0 text-xs sm:text-sm whitespace-nowrap backdrop-blur-sm"
              >
                {content.cta}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <button
              onClick={handleDismiss}
              className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionBanner;
