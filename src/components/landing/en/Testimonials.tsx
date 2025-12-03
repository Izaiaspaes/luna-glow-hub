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
    text: "Luna Glow changed my life! I finally understand my body and can plan ahead. The AI assistant is like having a friend who always understands.",
    rating: 5,
    highlight: "Lost 5kg following personalized plans"
  },
  {
    name: "Julia R.",
    age: 32,
    photo: testimonial2,
    text: "After years of suffering from PMS, Luna helped me identify patterns and anticipate symptoms. Now I know exactly what to do in each phase.",
    rating: 5,
    highlight: "PMS 80% lighter"
  },
  {
    name: "Carolina P.",
    age: 25,
    photo: testimonial3,
    text: "The AI journal is amazing! It connects dots I never noticed between my cycle and emotions. I feel much more in control.",
    rating: 5,
    highlight: "100% more self-awareness"
  },
  {
    name: "Beatriz M.",
    age: 35,
    photo: testimonial1,
    text: "Luna Sense accompanies me in difficult moments. It's comforting to have someone available 24/7 who truly understands hormonal changes.",
    rating: 5,
    highlight: "Anxiety reduced by 60%"
  },
  {
    name: "Rafaela T.",
    age: 29,
    photo: testimonial2,
    text: "The virtual closet changed my relationship with fashion! Now I choose clothes that make me feel good in each phase. My self-esteem improved so much!",
    rating: 5,
    highlight: "Confidence increased by 90%"
  },
  {
    name: "Amanda L.",
    age: 31,
    photo: testimonial3,
    text: "The personalized beauty analyses saved my skin! Adapting my skincare routine to the cycle made all the difference. Never had such beautiful skin.",
    rating: 5,
    highlight: "100% healthier skin"
  }
];

export const Testimonials = () => {
  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));

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
            Stories of{" "}
            <span className="gradient-text">transformation</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            See how Luna Glow is helping women live better
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
            opts={{ align: "start", loop: true }}
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
                        <div className="text-sm text-muted-foreground">{testimonial.age} years old</div>
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
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-luna-pink/20 via-luna-purple/20 to-primary/20 border border-primary/30 px-6 py-3 rounded-full shadow-md">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-luna-pink to-luna-purple border-2 border-background" />
              ))}
            </div>
            <span className="text-sm font-medium text-foreground">
              Join <span className="bg-gradient-to-r from-luna-pink via-luna-purple to-primary bg-clip-text text-transparent font-bold">500+ women</span> who already transformed their wellness
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
