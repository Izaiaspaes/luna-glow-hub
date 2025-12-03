import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Sparkles, Crown } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { 
    category: "Artificial Intelligence",
    items: [
      { name: "24/7 conversational AI", luna: true, competitor: false },
      { name: "Emotional AI analysis", luna: true, competitor: false },
      { name: "Machine Learning predictions", luna: true, competitor: true },
      { name: "Personalized insights", luna: true, competitor: true },
    ]
  },
  {
    category: "Wellness Features",
    items: [
      { name: "Priority Female SOS", luna: true, competitor: false },
      { name: "Beauty analysis by phase", luna: true, competitor: false },
      { name: "Smart Virtual Closet", luna: true, competitor: false },
      { name: "Adaptive nutrition plans", luna: true, competitor: false },
    ]
  },
  {
    category: "Experience",
    items: [
      { name: "Native language interface", luna: true, competitor: true },
      { name: "Local support team", luna: true, competitor: false },
      { name: "Ad-free experience", luna: true, competitor: false },
      { name: "Regional focus", luna: true, competitor: false },
    ]
  },
];

export const CompetitorComparisonEN = () => {
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
            Honest Comparison
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Luna Glow vs{" "}
            <span className="text-muted-foreground">Generic Apps</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            See why Luna Glow is the superior choice for women's wellness
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
                <Badge className="mt-2 bg-primary text-white">Specialized</Badge>
              </div>
              <div className="p-6 text-center">
                <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-muted" />
                <div className="font-bold text-xl text-muted-foreground">Flo Health</div>
                <Badge className="mt-2" variant="secondary">Generic</Badge>
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
                            <span className="text-xs font-semibold text-primary">Yes</span>
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
                Luna Glow has <span className="text-primary text-2xl">2x more features</span> focused on women's wellness
              </p>
              <p className="text-sm text-muted-foreground">
                Designed specifically for women's unique needs
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};