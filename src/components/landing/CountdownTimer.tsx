import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Sparkles, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const endTime = new Date().getTime() + (24 * 60 * 60 * 1000);
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ hours: 24, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 bg-gradient-to-br from-primary/10 via-luna-pink-light/30 to-luna-peach/20 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-20 right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="max-w-4xl mx-auto p-8 md:p-12 border-4 border-primary shadow-2xl bg-card/95 backdrop-blur-sm">
            <div className="text-center space-y-6">
              <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                <Badge className="gradient-bg text-white border-0 px-6 py-2 text-lg">
                  <Clock className="w-5 h-5 mr-2 animate-pulse" />
                  Oferta por Tempo Limitado
                </Badge>
              </motion.div>

              <div className="space-y-3">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                  Garanta seu desconto{" "}
                  <span className="gradient-text">AGORA</span>
                </h2>
                <p className="text-xl text-muted-foreground">Esta oferta especial expira em:</p>
              </div>

              <div className="flex justify-center gap-4 md:gap-8 py-6">
                {[
                  { value: timeLeft.hours, label: "Horas" },
                  { value: timeLeft.minutes, label: "Minutos" },
                  { value: timeLeft.seconds, label: "Segundos" }
                ].map((item, index) => (
                  <motion.div key={index} className="flex flex-col items-center" whileHover={{ scale: 1.05 }}>
                    <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl bg-gradient-to-br from-luna-pink via-luna-purple to-primary flex items-center justify-center shadow-lg">
                      <span className="text-3xl md:text-5xl font-bold text-white">
                        {String(item.value).padStart(2, '0')}
                      </span>
                    </div>
                    <span className="text-sm md:text-base font-medium text-muted-foreground mt-2">{item.label}</span>
                  </motion.div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-xl p-6 border-2 border-green-200 dark:border-green-800">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl font-bold text-green-900 dark:text-green-100">Por que agir agora?</h3>
                </div>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="text-green-800 dark:text-green-200">
                    <div className="font-bold mb-1">✓ Melhor Preço</div>
                    <div className="text-green-700 dark:text-green-300">Economia de até R$ 139,80/ano</div>
                  </div>
                  <div className="text-green-800 dark:text-green-200">
                    <div className="font-bold mb-1">✓ Sem Reajustes</div>
                    <div className="text-green-700 dark:text-green-300">Preço fixo pelo período contratado</div>
                  </div>
                  <div className="text-green-800 dark:text-green-200">
                    <div className="font-bold mb-1">✓ Acesso Completo</div>
                    <div className="text-green-700 dark:text-green-300">Todos os recursos premium inclusos</div>
                  </div>
                </div>
              </div>

              <Button size="xl" variant="cta" className="w-full md:w-auto text-lg px-12" onClick={() => window.location.href = '/pricing'}>
                <Sparkles className="w-5 h-5 mr-2" />
                Garantir Oferta Especial Agora
              </Button>

              <p className="text-sm text-muted-foreground">🔒 Pagamento 100% seguro • Garantia de 7 dias</p>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
