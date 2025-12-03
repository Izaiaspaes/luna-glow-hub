import { Shield, Lock, CheckCircle, RefreshCw, FileCheck, Award } from "lucide-react";
import { Card } from "@/components/ui/card";

const trustBadges = [
  {
    icon: RefreshCw,
    title: "7 Días de Garantía",
    description: "¿No te gustó? Devolvemos el 100% de tu dinero, sin preguntas"
  },
  {
    icon: Lock,
    title: "Datos Encriptados",
    description: "Encriptación de extremo a extremo. Tus datos nunca se comparten"
  },
  {
    icon: Shield,
    title: "Conformidad GDPR",
    description: "Total conformidad con la Ley General de Protección de Datos"
  },
  {
    icon: FileCheck,
    title: "Certificado SSL",
    description: "Conexión segura y protegida en todas tus interacciones"
  },
  {
    icon: Award,
    title: "Auditoría Regular",
    description: "Seguridad probada y aprobada por expertos independientes"
  },
  {
    icon: CheckCircle,
    title: "Pago Seguro",
    description: "Procesamiento a través de plataformas certificadas y reconocidas"
  }
];

export const TrustSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tu Confianza es Nuestra Prioridad
          </h2>
          <p className="text-lg text-muted-foreground">
            Comprometidos con tu seguridad, privacidad y satisfacción
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
              Más de 10.000 mujeres confían en Luna Glow
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};