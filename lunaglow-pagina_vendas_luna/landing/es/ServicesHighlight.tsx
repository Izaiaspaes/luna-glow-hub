import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Zap, 
  Heart, 
  Shield, 
  Shirt, 
  Brain,
  Calendar,
  LineChart
} from "lucide-react";
import { motion } from "framer-motion";

const services = [
  {
    icon: Brain,
    title: "Luna Sense 24/7",
    description: "Asistente de IA disponible en cualquier momento para apoyarte",
    badge: "IA Avanzada",
    color: "from-purple-500/10 to-pink-500/10",
  },
  {
    icon: Shield,
    title: "SOS Femenino",
    description: "Canal de emergencia con orientaciones rápidas y apoyo inmediato",
    badge: "Emergencia",
    color: "from-red-500/10 to-orange-500/10",
  },
  {
    icon: Sparkles,
    title: "Análisis de Belleza",
    description: "Recomendaciones personalizadas de skincare y maquillaje por fase del ciclo",
    badge: "Personalizado",
    color: "from-pink-500/10 to-purple-500/10",
  },
  {
    icon: Shirt,
    title: "Closet Virtual",
    description: "Sugerencias de outfits perfectos para cada momento de tu ciclo",
    badge: "Exclusivo",
    color: "from-blue-500/10 to-purple-500/10",
  },
  {
    icon: LineChart,
    title: "Insights Avanzados",
    description: "Análisis profundos de patrones, síntomas y emociones a lo largo del tiempo",
    badge: "Inteligente",
    color: "from-green-500/10 to-blue-500/10",
  },
  {
    icon: Calendar,
    title: "Planes por Fase",
    description: "Rutinas de bienestar, ejercicios y nutrición adaptados para ti",
    badge: "Adaptativo",
    color: "from-orange-500/10 to-pink-500/10",
  },
  {
    icon: Heart,
    title: "Diario Inteligente",
    description: "Registra tus días y recibe análisis emocionales con IA",
    badge: "IA Empática",
    color: "from-pink-500/10 to-red-500/10",
  },
  {
    icon: Zap,
    title: "Predicciones Precisas",
    description: "Tecnología que aprende de ti para predecir cada fase con exactitud",
    badge: "Machine Learning",
    color: "from-yellow-500/10 to-orange-500/10",
  },
];

export const ServicesHighlight = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-luna-pink-light/20">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="bg-primary/10 text-primary border-0 mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            Funcionalidades Premium
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Mucho más que una{" "}
            <span className="gradient-text">app de ciclo</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Una plataforma completa de bienestar femenino con tecnología de punta
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card 
                  className="group p-6 space-y-4 hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/30 hover:scale-105 relative overflow-hidden h-full"
                >
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                <div className="relative z-10 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <Badge className="bg-primary/10 text-primary border-0 text-xs">
                      {service.badge}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{service.title}</h3>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </div>
                </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-lg text-muted-foreground">
            <span className="font-bold text-primary">Todas estas funciones</span> están disponibles en los paquetes Premium
          </p>
        </motion.div>
      </div>
    </section>
  );
};