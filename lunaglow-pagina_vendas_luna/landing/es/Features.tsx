import { Brain, BookHeart, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import trackingImage from "@/assets/feature-tracking.jpg";
import aiImage from "@/assets/feature-ai.jpg";
import journalImage from "@/assets/feature-journal.jpg";
import { motion } from "framer-motion";

const features = [
  {
    icon: Sparkles,
    title: "Seguimiento Inteligente",
    description: "Sigue tu ciclo con precisión y recibe predicciones personalizadas para cada fase",
    image: trackingImage,
    benefits: ["Calendario intuitivo", "Predicciones precisas", "Alertas personalizadas"]
  },
  {
    icon: Brain,
    title: "Luna Sense - Asistente IA",
    description: "Conversa 24/7 con tu asistente de bienestar que realmente te entiende",
    image: aiImage,
    benefits: ["Disponible 24/7", "Respuestas empáticas", "Se adapta a tu ciclo"]
  },
  {
    icon: BookHeart,
    title: "Diario con IA",
    description: "Escribe sobre tu día y recibe insights poderosos sobre patrones y emociones",
    image: journalImage,
    benefits: ["Análisis automático", "Identifica patrones", "Sugerencias prácticas"]
  }
];

export const Features = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Herramientas que transforman tu{" "}
            <span className="gradient-text">bienestar</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Tecnología de punta combinada con empatía y privacidad para apoyar cada dimensión de tu salud
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <Card 
                  className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-2 hover:border-primary/20 bg-card h-full"
                >
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
