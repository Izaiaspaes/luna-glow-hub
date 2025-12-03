import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Crown, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { category: "Basics", items: [
    { name: "Menstrual cycle tracking", premium: true, premiumPlus: true },
    { name: "Calendar and predictions", premium: true, premiumPlus: true },
    { name: "Personalized reminders", premium: true, premiumPlus: true },
  ]},
  { category: "Artificial Intelligence", items: [
    { name: "Luna Sense 24/7 unlimited", premium: true, premiumPlus: true },
    { name: "Journal with AI analysis", premium: true, premiumPlus: true },
    { name: "Emotional patterns insights", premium: true, premiumPlus: true },
    { name: "Advanced ML predictions", premium: false, premiumPlus: true },
  ]},
  { category: "Wellness", items: [
    { name: "Priority Female SOS", premium: true, premiumPlus: true },
    { name: "Personalized beauty analysis", premium: true, premiumPlus: true },
    { name: "Nutrition plans by phase", premium: false, premiumPlus: true },
    { name: "Adapted exercise routines", premium: false, premiumPlus: true },
  ]},
  { category: "Style & Lifestyle", items: [
    { name: "Skincare tips by phase", premium: true, premiumPlus: true },
    { name: "Smart Virtual Closet", premium: false, premiumPlus: true },
    { name: "Personalized outfit suggestions", premium: false, premiumPlus: true },
  ]},
  { category: "Community & Support", items: [
    { name: "Exclusive VIP community", premium: false, premiumPlus: true },
    { name: "Monthly premium content", premium: false, premiumPlus: true },
    { name: "24/7 priority support", premium: false, premiumPlus: true },
    { name: "Early access to new features", premium: false, premiumPlus: true },
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
            Complete Comparison
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Compare the{" "}
            <span className="gradient-text">packages</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            See all the differences between Premium and Premium Plus
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
                <div className="font-bold text-lg mb-2">Monthly Premium</div>
                <div className="text-2xl font-bold text-primary">R$ 19.90</div>
                <div className="text-sm text-muted-foreground">/month</div>
              </div>
              <div className="p-6 text-center bg-gradient-to-br from-primary/5 to-primary/10 relative">
                <Badge className="absolute top-2 right-2 bg-primary text-white">
                  Best Value
                </Badge>
                <Crown className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="font-bold text-lg mb-2">Annual Premium Plus</div>
                <div className="text-2xl font-bold gradient-text">R$ 299.00</div>
                <div className="text-sm text-muted-foreground">/year</div>
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
                  Subscribe Monthly
                </Button>
              </div>
              <div className="flex items-center justify-center">
                <Button 
                  variant="cta"
                  onClick={() => window.location.href = 'https://lunaglow.com.br/pricing'}
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Subscribe Annual
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};