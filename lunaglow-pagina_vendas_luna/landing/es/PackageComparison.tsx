import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Crown, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { category: "Básico", items: [
    { name: "Seguimiento del ciclo menstrual", premium: true, premiumPlus: true },
    { name: "Calendario y predicciones", premium: true, premiumPlus: true },
    { name: "Recordatorios personalizados", premium: true, premiumPlus: true },
  ]},
  { category: "Inteligencia Artificial", items: [
    { name: "Luna Sense 24/7 ilimitado", premium: true, premiumPlus: true },
    { name: "Diario con análisis de IA", premium: true, premiumPlus: true },
    { name: "Insights de patrones emocionales", premium: true, premiumPlus: true },
    { name: "Predicciones avanzadas con ML", premium: false, premiumPlus: true },
  ]},
  { category: "Bienestar", items: [
    { name: "SOS Femenino prioritario", premium: true, premiumPlus: true },
    { name: "Análisis de belleza personalizados", premium: true, premiumPlus: true },
    { name: "Planes de nutrición por fase", premium: false, premiumPlus: true },
    { name: "Rutinas de ejercicios adaptadas", premium: false, premiumPlus: true },
  ]},
  { category: "Estilo & Lifestyle", items: [
    { name: "Consejos de skincare por fase", premium: true, premiumPlus: true },
    { name: "Closet Virtual inteligente", premium: false, premiumPlus: true },
    { name: "Sugerencias de looks personalizadas", premium: false, premiumPlus: true },
  ]},
  { category: "Comunidad & Soporte", items: [
    { name: "Comunidad exclusiva VIP", premium: false, premiumPlus: true },
    { name: "Contenido premium mensual", premium: false, premiumPlus: true },
    { name: "Soporte prioritario 24/7", premium: false, premiumPlus: true },
    { name: "Acceso anticipado a nuevos recursos", premium: false, premiumPlus: true },
  ]},
];

export const PackageComparison = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="bg-primary/10 text-primary border-0 mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            Comparación Completa
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Compara los{" "}
            <span className="gradient-text">paquetes</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Ve todas las diferencias entre Premium y Premium Plus
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="max-w-5xl mx-auto overflow-hidden border-2 shadow-xl">
            {/* Header */}
            <div className="grid grid-cols-3 bg-muted/50">
              <div className="p-6"></div>
              <div className="p-6 text-center border-x border-border">
                <div className="font-bold text-lg mb-2">Premium Mensual</div>
                <div className="text-2xl font-bold text-primary">R$ 19,90</div>
                <div className="text-sm text-muted-foreground">/mes</div>
              </div>
              <div className="p-6 text-center bg-gradient-to-br from-primary/5 to-primary/10 relative">
                <Badge className="absolute top-2 right-2 bg-primary text-white">
                  Mejor Valor
                </Badge>
                <Crown className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="font-bold text-lg mb-2">Premium Plus Anual</div>
                <div className="text-2xl font-bold gradient-text">R$ 299,00</div>
                <div className="text-sm text-muted-foreground">/año</div>
              </div>
            </div>

            {/* Features */}
            <div className="divide-y divide-border">
              {features.map((category, idx) => (
                <div key={idx}>
                  <div className="bg-muted/30 px-6 py-3">
                    <h3 className="font-bold text-sm uppercase tracking-wide text-primary">
                      {category.category}
                    </h3>
                  </div>
                  {category.items.map((feature, featureIdx) => (
                    <div 
                      key={featureIdx} 
                      className="grid grid-cols-3 hover:bg-muted/20 transition-colors"
                    >
                      <div className="p-4 text-sm">
                        {feature.name}
                      </div>
                      <div className="p-4 flex items-center justify-center border-x border-border">
                        {feature.premium ? (
                          <Check className="w-5 h-5 text-green-600" />
                        ) : (
                          <X className="w-5 h-5 text-muted-foreground/30" />
                        )}
                      </div>
                      <div className="p-4 flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
                        {feature.premiumPlus ? (
                          <Check className="w-5 h-5 text-primary" />
                        ) : (
                          <X className="w-5 h-5 text-muted-foreground/30" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* CTA Footer */}
            <div className="grid grid-cols-3 bg-muted/50 p-6">
              <div></div>
              <div className="flex items-center justify-center border-x border-border">
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = 'https://lunaglow.com.br/pricing'}
                >
                  Suscribir Mensual
                </Button>
              </div>
              <div className="flex items-center justify-center">
                <Button 
                  variant="cta"
                  onClick={() => window.location.href = 'https://lunaglow.com.br/pricing'}
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Suscribir Anual
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};