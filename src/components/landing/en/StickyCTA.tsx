import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const GuaranteeBadge = () => (
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="inline-flex items-center gap-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-2 border-green-500 rounded-2xl px-6 py-4 shadow-xl"
  >
    <Shield className="w-12 h-12 text-green-600" />
    <div>
      <div className="font-bold text-lg text-green-900 dark:text-green-100">7-Day Guarantee</div>
      <div className="text-sm text-green-700 dark:text-green-300">100% money back</div>
    </div>
  </motion.div>
);

export const StickyCTA = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 800);
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
                <div className="hidden lg:block"><GuaranteeBadge /></div>
                <div className="hidden md:block">
                  <div className="font-bold text-lg">Ready to transform your wellness?</div>
                  <div className="text-sm text-muted-foreground">Join thousands of women who trust Luna Glow</div>
                </div>
              </div>
              <Button size="lg" variant="cta" className="w-full md:w-auto text-lg px-8 py-6" onClick={() => window.location.href = '/pricing'}>
                Start Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
