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
    name: "Mariana S.",
    age: 28,
    photo: testimonial1,
    text: "O Luna Glow mudou minha vida! Finalmente entendo meu corpo e consigo me planejar. A assistente IA é como ter uma amiga que sempre entende.",
    rating: 5,
    highlight: "Perdi 5kg seguindo os planos personalizados"
  },
  {
    name: "Julia R.",
    age: 32,
    photo: testimonial2,
    text: "Depois de anos sofrendo com TPM, o Luna me ajudou a identificar padrões e antecipar sintomas. Agora sei exatamente o que fazer em cada fase.",
    rating: 5,
    highlight: "TPM 80% mais leve"
  },
  {
    name: "Carolina P.",
    age: 25,
    photo: testimonial3,
    text: "O diário com IA é incrível! Ele conecta pontos que eu nunca havia percebido entre meu ciclo e minhas emoções. Me sinto muito mais no controle.",
    rating: 5,
    highlight: "100% mais autoconhecimento"
  },
  {
    name: "Beatriz M.",
    age: 35,
    photo: testimonial1,
    text: "A Luna Sense me acompanha em momentos difíceis. É reconfortante ter alguém disponível 24/7 que realmente entende as mudanças hormonais. Não me sinto mais sozinha.",
    rating: 5,
    highlight: "Ansiedade reduzida em 60%"
  },
  {
    name: "Rafaela T.",
    age: 29,
    photo: testimonial2,
    text: "O closet virtual mudou minha relação com a moda! Agora escolho roupas que me fazem sentir bem em cada fase. Minha autoestima melhorou demais!",
    rating: 5,
    highlight: "Confiança aumentada em 90%"
  },
  {
    name: "Amanda L.",
    age: 31,
    photo: testimonial3,
    text: "As análises de beleza personalizadas salvaram minha pele! Adaptar minha rotina de skincare ao ciclo fez toda diferença. Nunca tive uma pele tão bonita.",
    rating: 5,
    highlight: "Pele 100% mais saudável"
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
            Histórias de{" "}
            <span className="gradient-text">transformação</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Veja como o Luna Glow está ajudando mulheres a viverem melhor
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
                        <div className="text-sm text-muted-foreground">{testimonial.age} anos</div>
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
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-luna-pink/20 via-luna-purple/20 to-primary/20 border border-primary/30 px-6 py-3 rounded-full shadow-md">
            <div className="flex -space-x-3">
              <img src={testimonial1} alt="Usuária" className="w-10 h-10 rounded-full object-cover border-2 border-background" />
              <img src={testimonial2} alt="Usuária" className="w-10 h-10 rounded-full object-cover border-2 border-background" />
              <img src={testimonial3} alt="Usuária" className="w-10 h-10 rounded-full object-cover border-2 border-background" />
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-luna-pink to-luna-purple border-2 border-background flex items-center justify-center text-white text-xs font-bold">
                +497
              </div>
            </div>
            <span className="text-sm font-medium text-foreground">
              Junte-se a <span className="bg-gradient-to-r from-luna-pink via-luna-purple to-primary bg-clip-text text-transparent font-bold">500+ mulheres</span> que já transformaram seu bem-estar
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
