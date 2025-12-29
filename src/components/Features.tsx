import { Card } from "@/components/ui/card";
import { Heart, Users, ShoppingBag } from "lucide-react";
import { useTranslation } from "react-i18next";
import featureHealth from "@/assets/feature-health.jpg";
import featureCommunity from "@/assets/feature-community.jpg";
import featureShop from "@/assets/feature-shop.jpg";

export const Features = () => {
  const { t, i18n } = useTranslation();

  const tx = (key: string, fallback: string) => {
    const value = t(key, { defaultValue: fallback });
    return value === key ? fallback : value;
  };

  const features = [
    {
      icon: Heart,
      title: tx("features.health.title", "Saúde & Bem-estar"),
      description: tx("features.health.description", "Acompanhe seu ciclo menstrual, sono e energia com IA personalizada"),
      image: featureHealth,
      color: "primary",
    },
    {
      icon: Users,
      title: tx("features.community.title", "Comunidade"),
      description: tx("features.community.description", "Conecte-se com outras mulheres em uma comunidade segura e acolhedora"),
      image: featureCommunity,
      color: "secondary",
    },
    {
      icon: ShoppingBag,
      title: tx("features.shop.title", "Marketplace"),
      description: tx("features.shop.description", "Produtos selecionados para seu bem-estar feminino"),
      image: featureShop,
      color: "accent",
    },
  ];

  return (
    <section className="py-20 lg:py-32 bg-background" key={i18n.language} aria-labelledby="features-heading">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 id="features-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold">
            {tx("features.sectionTitle", "Tudo que você precisa para")}{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              {tx("features.sectionTitleHighlight", "seu bem-estar")}
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{tx("features.sectionDescription", "Descubra ferramentas criadas especialmente para você")}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={`${feature.title}-${index}`}
                className="group relative overflow-hidden border-2 hover:shadow-colorful transition-all duration-300 bg-gradient-card hover:scale-105"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-hero opacity-5 rounded-full blur-3xl" />

                <div className="relative p-8 space-y-6">
                  <div className="relative w-full h-48 -mx-8 -mt-8 mb-6 overflow-hidden">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card" />
                  </div>

                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-colorful text-white shadow-colorful">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-2xl font-bold">{feature.title}</h3>

                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
