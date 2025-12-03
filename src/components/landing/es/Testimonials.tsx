import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";
import testimonial1 from "@/assets/testimonial-ana.jpg";
import testimonial2 from "@/assets/testimonial-julia.jpg";
import testimonial3 from "@/assets/testimonial-maria.jpg";

const testimonials = [
  {
    name: "María S.",
    age: 28,
    photo: testimonial1,
    text: "¡Luna Glow cambió mi vida! Finalmente entiendo mi cuerpo y puedo planificar. La asistente IA es como tener una amiga que siempre entiende.",
    rating: 5,
    highlight: "Perdí 5kg siguiendo planes personalizados"
  },
  {
    name: "Julia R.",
    age: 32,
    photo: testimonial2,
    text: "Después de años sufriendo con SPM, Luna me ayudó a identificar patrones y anticipar síntomas. Ahora sé exactamente qué hacer en cada fase.",
    rating: 5,
    highlight: "SPM 80% más leve"
  },
  {
    name: "Carolina P.",
    age: 25,
    photo: testimonial3,
    text: "¡El diario con IA es increíble! Conecta puntos que nunca había percibido entre mi ciclo y mis emociones. Me siento mucho más en control.",
    rating: 5,
    highlight: "100% más autoconocimiento"
  },
  {
    name: "Beatriz M.",
    age: 35,
    photo: testimonial1,
    text: "Luna Sense me acompaña en momentos difíciles. Es reconfortante tener alguien disponible 24/7 que realmente entiende los cambios hormonales.",
    rating: 5,
    highlight: "Ansiedad reducida en 60%"
  },
  {
    name: "Rafaela T.",
    age: 29,
    photo: testimonial2,
    text: "¡El closet virtual cambió mi relación con la moda! Ahora elijo ropa que me hace sentir bien en cada fase. ¡Mi autoestima mejoró muchísimo!",
    rating: 5,
    highlight: "Confianza aumentada en 90%"
  },
  {
    name: "Amanda L.",
    age: 31,
    photo: testimonial3,
    text: "Los análisis de belleza personalizados salvaron mi piel. Adaptar mi rutina al ciclo hizo toda la diferencia. Nunca tuve una piel tan bonita.",
    rating: 5,
    highlight: "Piel 100% más saludable"
  }
];

export const Testimonials = () => {
  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Historias de{" "}
            <span className="gradient-text">transformación</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Mira cómo Luna Glow está ayudando a mujeres a vivir mejor
          </p>
        </motion.div>

        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[plugin.current]}
            className="w-full"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent className="-ml-4">
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="p-8 space-y-4 hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 h-full flex flex-col group">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <img 
                          src={testimonial.photo} 
                          alt={testimonial.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-primary/20 transition-transform group-hover:scale-110"
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center border-2 border-background">
                          <Star className="w-3 h-3 fill-white text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-lg">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.age} años</div>
                      </div>
                    </div>

                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                      ))}
                    </div>
                    
                    <p className="text-foreground/90 leading-relaxed flex-1 text-sm">
                      "{testimonial.text}"
                    </p>
                    
                    <div className="pt-4 border-t border-border">
                      <div className="inline-block bg-gradient-to-r from-primary/10 to-primary/5 text-primary text-xs font-medium px-3 py-1.5 rounded-full">
                        ✨ {testimonial.highlight}
                      </div>
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12" />
            <CarouselNext className="hidden md:flex -right-12" />
          </Carousel>
        </motion.div>

        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 bg-secondary px-6 py-3 rounded-full">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background" />
              ))}
            </div>
            <span className="text-sm font-medium">
              Únete a <span className="text-primary font-bold">500+ mujeres</span> que ya transformaron su bienestar
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
