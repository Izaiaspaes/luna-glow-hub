import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const PROOF_MESSAGES_ES = [
  { name: "María", city: "Madrid", action: "suscribió Premium Plus" },
  { name: "Carmen", city: "Barcelona", action: "comenzó período de prueba" },
  { name: "Laura", city: "Valencia", action: "suscribió Premium Mensual" },
  { name: "Ana", city: "Sevilla", action: "suscribió Premium Plus" },
  { name: "Isabel", city: "Zaragoza", action: "comenzó período de prueba" },
  { name: "Sofia", city: "Málaga", action: "suscribió Premium Plus" },
  { name: "Elena", city: "Murcia", action: "suscribió Premium Mensual" },
  { name: "Paula", city: "Bilbao", action: "comenzó período de prueba" },
];

export const SocialProof = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % PROOF_MESSAGES_ES.length);
        setIsVisible(true);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentMessage = PROOF_MESSAGES_ES[currentIndex];

  return (
    <div className="fixed bottom-24 left-6 z-40 max-w-sm hidden md:block">
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: -100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-card rounded-2xl shadow-2xl border-2 border-primary/20 p-4 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm">{currentMessage.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {currentMessage.city}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {currentMessage.action}
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <TrendingUp className="w-3 h-3" />
                    <span>Hace unos minutos</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
