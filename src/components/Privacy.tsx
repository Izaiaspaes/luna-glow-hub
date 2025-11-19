import { Shield, Lock, Eye, Download } from "lucide-react";
import { Card } from "@/components/ui/card";

const privacyFeatures = [
  {
    icon: Shield,
    title: "Dados Criptografados",
    description: "Todas as suas informações são protegidas com criptografia de ponta a ponta.",
  },
  {
    icon: Lock,
    title: "Controle Total",
    description: "Você decide o que compartilhar e pode excluir seus dados a qualquer momento.",
  },
  {
    icon: Eye,
    title: "Transparência Completa",
    description: "Audit logs disponíveis para você ver exatamente como seus dados são usados.",
  },
  {
    icon: Download,
    title: "Seus Dados, Suas Regras",
    description: "Exporte ou elimine suas informações quando quiser, sem complicações.",
  },
];

export const Privacy = () => {
  return (
    <section className="py-20 lg:py-32 bg-gradient-soft">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/20 text-secondary mb-4">
              <Shield className="w-8 h-8" />
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Privacidade não é{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                negociável
              </span>
            </h2>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Em um mundo onde dados reprodutivos são cada vez mais expostos, 
              Luna foi construída com privacidade desde o primeiro dia. 
              Seus dados de saúde são seus — e sempre serão.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {privacyFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="p-6 bg-card hover:shadow-soft transition-smooth border-2"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="mt-12 p-8 bg-card rounded-2xl border-2 border-border">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-2 h-2 bg-secondary rounded-full mt-2"></div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Compromisso de transparência:</strong> 
                {" "}Trabalhamos com auditorias independentes e seguimos as melhores práticas 
                de segurança. Dados agregados e anônimos só são compartilhados para pesquisa 
                com seu consentimento explícito e opt-in.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
