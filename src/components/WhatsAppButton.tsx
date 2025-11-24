import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const WhatsAppButton = () => {
  const whatsappNumber = "5511963697488";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20a%20Luna.`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Falar no WhatsApp"
    >
      <Button
        size="lg"
        className="h-14 w-14 rounded-full shadow-hover bg-[#25D366] hover:bg-[#20BD5A] text-white border-0 transition-all duration-300 hover:scale-110"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
      
      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block animate-in fade-in slide-in-from-bottom-2 duration-200">
        <div className="bg-card text-card-foreground px-3 py-2 rounded-lg shadow-lg text-sm whitespace-nowrap border border-border">
          Fale conosco no WhatsApp
        </div>
      </div>
    </a>
  );
};
