import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Sparkles, Crown } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { 
    category: "Inteligência Artificial",
    items: [
      { name: "IA conversacional 24/7", luna: true, competitor: false },
      { name: "Análise emocional com IA", luna: true, competitor: false },
      { name: "Previsões com Machine Learning", luna: true, competitor: true },
      { name: "Insights personalizados", luna: true, competitor: true },
    ]
  },
  {
    category: "Recursos de Bem-estar",
    items: [
      { name: "SOS Feminino prioritário", luna: true, competitor: false },
      { name: "Análises de beleza por fase", luna: true, competitor: false },
      { name: "Closet Virtual inteligente", luna: true, competitor: false },
      { name: "Planos de nutrição adaptados", luna: true, competitor: false },
    ]
  },
  {
    category: "Experiência",
    items: [
      { name: "Interface em português", luna: true, competitor: true },
      { name: "Suporte em português", luna: true, competitor: false },
      { name: "Sem anúncios", luna: true, competitor: false },
      { name: "Foco no mercado brasileiro", luna: true, competitor: false },
    ]
  },
];

export const CompetitorComparison = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30">
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
            Comparação Honesta
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Luna Glow vs{" "}
            <span className="text-muted-foreground">Apps Genéricos</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Veja por que Luna Glow é a escolha superior para o bem-estar feminino
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="max-w-5xl mx-auto overflow-hidden border-2 shadow-2xl">
            <div className="grid grid-cols-3 bg-muted/50">
              <div className="p-6"></div>
              <div className="p-6 text-center bg-gradient-to-br from-primary/10 to-primary/20 border-x border-border relative">
                <Crown className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="font-bold text-xl gradient-text">Luna Glow</div>
                <Badge className="mt-2 bg-primary text-white">Brasileira</Badge>
              </div>
              <div className="p-6 text-center">
                <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-muted" />
                <div className="font-bold text-xl text-muted-foreground">Flo Health</div>
                <Badge className="mt-2" variant="secondary">Internacional</Badge>
              </div>
            </div>

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
                      <div className="p-4 text-sm font-medium">
                        {feature.name}
                      </div>
                      <div className="p-4 flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 border-x border-border">
                        {feature.luna ? (
                          <div className="flex items-center gap-2">
                            <Check className="w-6 h-6 text-primary" />
                            <span className="text-xs font-semibold text-primary">Sim</span>
                          </div>
                        ) : (
                          <X className="w-5 h-5 text-muted-foreground/30" />
                        )}
                      </div>
                      <div className="p-4 flex items-center justify-center">
                        {feature.competitor ? (
                          <Check className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <X className="w-5 h-5 text-muted-foreground/30" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-primary/10 to-primary/20 p-8 text-center">
              <p className="text-lg font-semibold mb-2">
                Luna Glow tem <span className="text-primary text-2xl">2x mais recursos</span> focados no bem-estar feminino
              </p>
              <p className="text-sm text-muted-foreground">
                Desenvolvido especialmente para mulheres brasileiras
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};