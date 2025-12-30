import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote, Heart, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import testimonialMaria from "@/assets/testimonial-maria.jpg";
import testimonialAna from "@/assets/testimonial-ana.jpg";
import testimonialJulia from "@/assets/testimonial-julia.jpg";

const fallbackTestimonials = [
  {
    name: "Maria Silva",
    age: 28,
    photo: testimonialMaria,
    text: "Finalmente encontrei um app que entende as mulheres de verdade! O Luna me ajuda a entender meu corpo de forma simples e a IA realmente personaliza tudo para mim. Estou adorando os planos de bem-estar!",
    rating: 5,
    highlight: "Perdeu 5kg em 3 meses",
    location: "São Paulo, SP",
  },
  {
    name: "Ana Santos",
    age: 32,
    photo: testimonialAna,
    text: "A privacidade que o Luna oferece é incrível. Posso registrar tudo sem medo e as recomendações são sempre no ponto. Sinto que tenho uma amiga especialista me acompanhando todos os dias.",
    rating: 5,
    highlight: "Ciclo regulado em 2 meses",
    location: "Rio de Janeiro, RJ",
  },
  {
    name: "Julia Costa",
    age: 25,
    photo: testimonialJulia,
    text: "O rastreamento de ciclo combinado com humor e energia mudou minha rotina! Agora entendo melhor meus padrões e consigo me cuidar de forma muito mais consciente. Recomendo demais!",
    rating: 5,
    highlight: "Sono melhorou 40%",
    location: "Belo Horizonte, MG",
  },
  {
    name: "Fernanda Lima",
    age: 29,
    photo: testimonialMaria,
    text: "Nunca imaginei que um app pudesse fazer tanta diferença na minha vida. As previsões de sintomas me ajudam a me preparar para os dias difíceis. Simplesmente incrível!",
    rating: 5,
    highlight: "TPM mais controlada",
    location: "Curitiba, PR",
  },
  {
    name: "Camila Oliveira",
    age: 34,
    photo: testimonialAna,
    text: "Como mãe de dois, não tinha tempo para cuidar de mim. O Luna me mostrou que pequenas ações diárias fazem toda diferença. Estou mais disposta e feliz!",
    rating: 5,
    highlight: "Energia aumentou 60%",
    location: "Porto Alegre, RS",
  },
  {
    name: "Beatriz Mendes",
    age: 27,
    photo: testimonialJulia,
    text: "O diário feminino é terapêutico! A IA entende exatamente o que estou passando e me dá insights que nunca imaginaria. É como ter uma amiga que realmente te entende.",
    rating: 5,
    highlight: "Autoconhecimento elevado",
    location: "Salvador, BA",
  },
];

interface Testimonial {
  name: string;
  age: number;
  photo: string;
  text: string;
  rating?: number;
  highlight?: string;
  location?: string;
}

export const Testimonials = () => {
  const { t } = useTranslation();
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("is_featured", true)
      .order("display_order", { ascending: true });

    if (!error && data && data.length > 0) {
      const formattedTestimonials = data.map((t) => ({
        name: t.user_name,
        age: t.user_age || 0,
        photo: t.user_avatar_url || testimonialMaria,
        text: t.testimonial_text,
        rating: 5,
        highlight: "Usuária verificada",
        location: "Brasil",
      }));
      setTestimonials(formattedTestimonials);
    }
  };

  const tx = (key: string, fallback: string) => {
    const result = t(key);
    return result === key || result === "" ? fallback : result;
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background via-primary/5 to-background overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Heart className="w-4 h-4" />
            <span>+50.000 mulheres transformadas</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">Histórias de </span>
            <span className="bg-gradient-to-r from-primary via-primary-glow to-secondary bg-clip-text text-transparent">
              Transformação
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Veja como o Luna está mudando a vida de milhares de mulheres em todo o Brasil
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 4000,
                stopOnInteraction: true,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full relative overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 group">
                    {/* Gradient accent */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary-glow to-secondary" />
                    
                    <CardContent className="p-6 h-full flex flex-col">
                      {/* Rating stars */}
                      <div className="flex gap-1 mb-4">
                        {[...Array(testimonial.rating || 5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>

                      {/* Quote */}
                      <div className="relative flex-1 mb-6">
                        <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary/10" />
                        <p className="text-foreground/90 leading-relaxed pl-4 italic">
                          "{testimonial.text}"
                        </p>
                      </div>

                      {/* Highlight badge */}
                      {testimonial.highlight && (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 text-primary text-sm font-medium mb-4 w-fit">
                          <Sparkles className="w-3.5 h-3.5" />
                          {testimonial.highlight}
                        </div>
                      )}

                      {/* User info */}
                      <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                        <div className="relative">
                          <img
                            src={testimonial.photo}
                            alt={testimonial.name}
                            loading="lazy"
                            className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/30 group-hover:ring-primary/50 transition-all"
                          />
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-card flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            {testimonial.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {testimonial.age} anos • {testimonial.location || "Brasil"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <div className="flex justify-center gap-4 mt-8">
              <CarouselPrevious className="static translate-y-0 bg-card border-border hover:bg-primary hover:text-primary-foreground transition-colors" />
              <CarouselNext className="static translate-y-0 bg-card border-border hover:bg-primary hover:text-primary-foreground transition-colors" />
            </div>
          </Carousel>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex -space-x-3">
              {[testimonialMaria, testimonialAna, testimonialJulia].map((photo, i) => (
                <img
                  key={i}
                  src={photo}
                  alt="Usuária Luna"
                  className="w-10 h-10 rounded-full border-2 border-background object-cover"
                />
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-background bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                +50k
              </div>
            </div>
          </div>
          <p className="text-muted-foreground">
            Junte-se a mais de <span className="text-primary font-semibold">50.000 mulheres</span> que já transformaram suas vidas
          </p>
        </motion.div>
      </div>
    </section>
  );
};
