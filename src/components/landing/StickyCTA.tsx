import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GuaranteeBadge } from "./GuaranteeBadge";

export const StickyCTA = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      setIsVisible(scrolled > 800);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t-2 border-primary/20 shadow-2xl"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="hidden lg:block">
                  <GuaranteeBadge />
                </div>
                <div className="hidden md:block">
                  <div className="font-bold text-lg">
                    Pronta para transformar seu bem-estar?
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Junte-se a milhares de mulheres que já confiam no Luna Glow
                  </div>
                </div>
              </div>
              <Button
                size="lg"
                variant="cta"
                className="w-full md:w-auto text-lg px-8 py-6"
                onClick={() => window.location.href = '/auth'}
              >
                Começar Agora
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
