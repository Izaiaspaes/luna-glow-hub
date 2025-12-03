import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import { Sparkles, TrendingDown, Calendar, DollarSign } from "lucide-react";

export const SavingsCalculator = () => {
  const [months, setMonths] = useState([12]);
  
  const monthlyPrice = 19.90;
  const annualPrice = 299.00;
  const annualMonthlyEquivalent = annualPrice / 12;
  
  const totalMonthly = monthlyPrice * months[0];
  const totalAnnual = (months[0] / 12) * annualPrice;
  const savings = totalMonthly - totalAnnual;
  const savingsPercentage = ((savings / totalMonthly) * 100).toFixed(0);

  return (
    <section className="py-24 bg-gradient-to-b from-luna-pink-light/20 to-background">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="bg-primary/10 text-primary border-0 mb-4">
            <DollarSign className="w-4 h-4 mr-2" />
            Calculadora de Ahorro
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            ¿Cuánto puedes{" "}
            <span className="gradient-text">ahorrar</span>?
          </h2>
          <p className="text-xl text-muted-foreground">
            Descubre cuánto dinero ahorras eligiendo el paquete anual
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="max-w-4xl mx-auto p-8 md:p-12 border-2 border-primary/20 shadow-xl">
            <div className="space-y-8">
              {/* Slider */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-lg font-semibold flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Período de uso
                  </label>
                  <span className="text-3xl font-bold gradient-text">
                    {months[0]} {months[0] === 1 ? 'mes' : 'meses'}
                  </span>
                </div>
                <Slider
                  value={months}
                  onValueChange={setMonths}
                  min={3}
                  max={36}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>3 meses</span>
                  <span>36 meses</span>
                </div>
              </div>

              {/* Comparison */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Monthly */}
                <div className="p-6 rounded-xl bg-muted/50 border-2 border-border space-y-3">
                  <div className="text-sm font-medium text-muted-foreground">
                    Paquete Mensual
                  </div>
                  <div className="text-3xl font-bold">
                    R$ {totalMonthly.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    R$ {monthlyPrice.toFixed(2)}/mes × {months[0]} meses
                  </div>
                </div>

                {/* Annual */}
                <div className="p-6 rounded-xl gradient-bg text-white border-2 border-primary shadow-lg space-y-3 relative overflow-hidden">
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-white/20 text-white border-0">
                      Mejor Valor
                    </Badge>
                  </div>
                  <div className="text-sm font-medium opacity-90">
                    Paquete Anual
                  </div>
                  <div className="text-3xl font-bold">
                    R$ {totalAnnual.toFixed(2)}
                  </div>
                  <div className="text-sm opacity-90">
                    R$ {annualMonthlyEquivalent.toFixed(2)}/mes × {months[0]} meses
                  </div>
                </div>
              </div>

              {/* Savings Display */}
              <motion.div 
                className="p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 text-center"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="flex items-center justify-center gap-2 mb-4">
                  <TrendingDown className="w-8 h-8 text-green-600" />
                  <h3 className="text-2xl font-bold text-green-900">
                    Tu Ahorro Total
                  </h3>
                </div>
                <div className="text-5xl md:text-6xl font-bold text-green-600 mb-2">
                  R$ {savings.toFixed(2)}
                </div>
                <div className="text-xl text-green-700 font-medium">
                  ¡Eso representa {savingsPercentage}% de ahorro!
                </div>
              </motion.div>

              {/* CTA */}
              <div className="text-center space-y-4">
                <Button 
                  size="xl" 
                  variant="cta"
                  className="w-full md:w-auto"
                  onClick={() => window.location.href = 'https://lunaglow.com.br/auth'}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Obtener Paquete Anual Ahora
                </Button>
                <p className="text-sm text-muted-foreground">
                  7 días de garantía • Cancela cuando quieras
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};