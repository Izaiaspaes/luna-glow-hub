import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export const FinalCTA = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-bg opacity-5" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 bg-card/50 backdrop-blur-sm border-2 border-primary/20 rounded-3xl p-12 md:p-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Oferta por tempo limitado
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Pronta para transformar seu{" "}
            <span className="gradient-text">bem-estar?</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comece gratuitamente hoje e descubra como é viver em harmonia com seu ciclo. Sem cartão de crédito necessário.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="xl" 
              variant="cta"
              className="group"
              onClick={() => window.location.href = '/onboarding'}
            >
              Começar Grátis Agora
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="xl" 
              variant="ctaOutline"
              onClick={() => window.location.href = '/onboarding'}
            >
              Ver Todos os Recursos
            </Button>
          </div>

          <div className="flex flex-wrap gap-8 justify-center text-sm text-muted-foreground pt-8">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                ✓
              </div>
              <span>Grátis para sempre</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                ✓
              </div>
              <span>Sem cartão necessário</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                ✓
              </div>
              <span>Cancele quando quiser</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
