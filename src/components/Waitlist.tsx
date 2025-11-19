import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const Waitlist = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "✨ Bem-vinda à lista!",
        description: "Você receberá um email assim que Luna estiver disponível.",
      });
      setEmail("");
    }
  };

  return (
    <section className="py-20 lg:py-32 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero opacity-5"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Seja uma das primeiras a experimentar{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Luna
            </span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Entre para a lista de espera e ganhe acesso antecipado exclusivo, 
            recursos premium gratuitos por 3 meses e ajude a moldar o futuro do bem-estar feminino.
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-12 px-4 bg-card border-2"
                required
              />
              <Button type="submit" variant="hero" size="lg" className="group">
                Entrar na lista
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Prometemos não enviar spam. Seus dados estão seguros conosco. 🔒
            </p>
          </form>

          <div className="pt-8 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">5k+</p>
              <p className="text-sm text-muted-foreground mt-1">Na lista</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-secondary">4.9★</p>
              <p className="text-sm text-muted-foreground mt-1">Beta Score</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">Q1</p>
              <p className="text-sm text-muted-foreground mt-1">Lançamento</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
