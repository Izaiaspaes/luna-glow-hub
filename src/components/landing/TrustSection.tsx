import { Shield, Lock, CheckCircle, RefreshCw, FileCheck, Award } from "lucide-react";
import { Card } from "@/components/ui/card";

const trustBadges = [
  {
    icon: RefreshCw,
    title: "7 Dias de Garantia",
    description: "Não gostou? Devolvemos 100% do seu dinheiro, sem perguntas"
  },
  {
    icon: Lock,
    title: "Dados Criptografados",
    description: "Criptografia de ponta a ponta. Seus dados nunca são compartilhados"
  },
  {
    icon: Shield,
    title: "Conformidade LGPD",
    description: "Total conformidade com Lei Geral de Proteção de Dados"
  },
  {
    icon: FileCheck,
    title: "Certificado SSL",
    description: "Conexão segura e protegida em todas as suas interações"
  },
  {
    icon: Award,
    title: "Auditoria Regular",
    description: "Segurança testada e aprovada por especialistas independentes"
  },
  {
    icon: CheckCircle,
    title: "Pagamento Seguro",
    description: "Processamento via plataformas certificadas e reconhecidas"
  }
];

export const TrustSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Sua Confiança é Nossa Prioridade
          </h2>
          <p className="text-lg text-muted-foreground">
            Comprometidos com sua segurança, privacidade e satisfação
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {trustBadges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <Card 
                key={index}
                className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2"
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg">{badge.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {badge.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-luna-pink-light/30 border-2 border-primary/20 rounded-full px-6 py-3">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-semibold">
              Mais de 10.000 mulheres confiam no Luna Glow
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
