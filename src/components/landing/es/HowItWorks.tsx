import { motion } from "framer-motion";
import { ShineBorder } from "@/components/ui/shine-border";
import { cn } from "@/lib/utils";
import { DIcons, type ValidIcon } from "dicons";

interface Event {
  label: string;
  message: string;
  icon: {
    name: ValidIcon;
    textColor: string;
    borderColor: string;
  };
}

const timeline: Event[] = [
  {
    label: "Crea tu Cuenta",
    message: "Regístrate gratis y accede a tu panel personalizado en segundos.",
    icon: {
      name: "Shapes",
      textColor: "text-orange-500",
      borderColor: "border-orange-500/40",
    },
  },
  {
    label: "Completa tu Perfil",
    message: "Comparte tus preferencias y objetivos de bienestar con nosotros.",
    icon: {
      name: "Send",
      textColor: "text-amber-500",
      borderColor: "border-amber-500/40",
    },
  },
  {
    label: "Recibe Insights con IA",
    message: "En 24h, Luna Sense empieza a ofrecer recomendaciones personalizadas.",
    icon: {
      name: "Check",
      textColor: "text-blue-500",
      borderColor: "border-blue-500/40",
    },
  },
  {
    label: "Sigue tu Evolución",
    message: "Monitorea ciclo, ánimo, sueño y nutrición — todo en un solo lugar.",
    icon: {
      name: "Repeat",
      textColor: "text-green-500",
      borderColor: "border-green-500/40",
    },
  },
  {
    label: "Alcanza tus Objetivos",
    message: "Recibe planes de bienestar adaptativos y ve resultados reales.",
    icon: {
      name: "Download",
      textColor: "text-green-500",
      borderColor: "border-green-500/40",
    },
  },
];

function TimelineEvent({
  label,
  message,
  icon,
  isLast = false,
}: Event & { isLast?: boolean }) {
  const Icon = DIcons[icon.name];
  return (
    <div className="flex flex-row gap-4 pb-8 last:pb-0">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "flex size-10 items-center justify-center rounded-full border-2",
            icon.borderColor
          )}
        >
          <Icon className={cn("size-5", icon.textColor)} />
        </div>
        {!isLast && <div className="h-full w-px bg-border" />}
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section className="py-16 md:py-24 px-4 bg-gradient-soft">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            ¿Cómo Funciona?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Comienza tu viaje de bienestar en pocos pasos simples
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center"
        >
          <ShineBorder
            borderRadius={16}
            borderWidth={2}
            duration={10}
            color={["hsl(320, 85%, 60%)", "hsl(280, 70%, 55%)", "hsl(210, 85%, 60%)"]}
            className="w-full max-w-lg p-6 md:p-8"
          >
            <div className="relative z-10">
              {timeline.map((event, i) => (
                <TimelineEvent
                  key={i}
                  {...event}
                  isLast={i === timeline.length - 1}
                />
              ))}
            </div>
          </ShineBorder>
        </motion.div>
      </div>
    </section>
  );
}
