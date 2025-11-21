import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";
import testimonialMaria from "@/assets/testimonial-maria.jpg";
import testimonialAna from "@/assets/testimonial-ana.jpg";
import testimonialJulia from "@/assets/testimonial-julia.jpg";

const testimonials = [
  {
    name: "Maria Silva",
    age: 28,
    photo: testimonialMaria,
    text: "Finalmente encontrei um app que entende as mulheres de verdade! O Luna me ajuda a entender meu corpo de forma simples e a IA realmente personaliza tudo para mim. Estou adorando os planos de bem-estar!",
  },
  {
    name: "Ana Santos",
    age: 32,
    photo: testimonialAna,
    text: "A privacidade que o Luna oferece é incrível. Posso registrar tudo sem medo e as recomendações são sempre no ponto. Sinto que tenho uma amiga especialista me acompanhando todos os dias.",
  },
  {
    name: "Julia Costa",
    age: 25,
    photo: testimonialJulia,
    text: "O rastreamento de ciclo combinado com humor e energia mudou minha rotina! Agora entendo melhor meus padrões e consigo me cuidar de forma muito mais consciente. Recomendo demais!",
  },
];

export const Testimonials = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-primary-glow to-secondary bg-clip-text text-transparent">
            O que nossas testadoras estão dizendo
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Conheça mulheres que estão transformando seu bem-estar com o Luna
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="relative overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 backdrop-blur-sm bg-card/80"
            >
              <CardContent className="pt-6">
                <Quote className="w-10 h-10 text-primary/20 mb-4" />
                <p className="text-foreground mb-6 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-4 mt-6 pt-6 border-t border-border/50">
                  <img
                    src={testimonial.photo}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/20"
                  />
                  <div>
                    <p className="font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.age} anos
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
