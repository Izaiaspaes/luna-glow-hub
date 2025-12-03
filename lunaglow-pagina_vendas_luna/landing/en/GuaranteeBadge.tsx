import { Shield, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

export const GuaranteeBadgeEN = () => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="inline-flex items-center gap-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-2 border-green-500 rounded-2xl px-6 py-4 shadow-xl"
    >
      <div className="relative">
        <Shield className="w-12 h-12 text-green-600" />
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <RefreshCw className="w-12 h-12 text-green-600 opacity-20" />
        </motion.div>
      </div>
      <div>
        <div className="font-bold text-lg text-green-900 dark:text-green-100">
          7-Day Guarantee
        </div>
        <div className="text-sm text-green-700 dark:text-green-300">
          100% money back
        </div>
      </div>
    </motion.div>
  );
};