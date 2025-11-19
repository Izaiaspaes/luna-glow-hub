import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-wellness.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-soft">
      <div className="container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-block">
              <span className="px-4 py-2 bg-accent/50 text-accent-foreground rounded-full text-sm font-medium">
                🌙 Lançamento em breve
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Seu bem-estar,{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                sua comunidade
              </span>
              , seu estilo
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
              Luna é a plataforma completa para mulheres que buscam equilíbrio: 
              rastreamento de saúde hormonal e mental, comunidade segura e curadoria 
              consciente de produtos — tudo em um lugar privado e personalizado.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="lg" className="group">
                Entrar na lista de espera
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="lg">
                Saiba mais
              </Button>
            </div>

            <div className="flex items-center gap-8 justify-center lg:justify-start pt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">100%</p>
                <p className="text-sm text-muted-foreground">Privado</p>
              </div>
              <div className="h-12 w-px bg-border"></div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">Gratuito</p>
                <p className="text-sm text-muted-foreground">Para começar</p>
              </div>
              <div className="h-12 w-px bg-border"></div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">24/7</p>
                <p className="text-sm text-muted-foreground">Assistente AI</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative lg:order-last">
            <div className="relative rounded-3xl overflow-hidden shadow-hover">
              <img 
                src={heroImage} 
                alt="Mulher praticando bem-estar" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent"></div>
            </div>
            
            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-2xl shadow-hover max-w-xs hidden lg:block">
              <p className="text-sm text-muted-foreground mb-2">Última análise</p>
              <p className="font-semibold text-lg">Seus padrões de sono melhoraram 23%</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
