import { Users, Heart, Calendar, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Statistics = () => {
  const { t } = useTranslation();

  const statistics = [
    {
      icon: Users,
      value: t('statistics.usersValue'),
      label: t('statistics.usersLabel'),
      description: t('statistics.usersDesc'),
    },
    {
      icon: Heart,
      value: t('statistics.plansValue'),
      label: t('statistics.plansLabel'),
      description: t('statistics.plansDesc'),
    },
    {
      icon: Calendar,
      value: t('statistics.cyclesValue'),
      label: t('statistics.cyclesLabel'),
      description: t('statistics.cyclesDesc'),
    },
    {
      icon: Sparkles,
      value: t('statistics.satisfactionValue'),
      label: t('statistics.satisfactionLabel'),
      description: t('statistics.satisfactionDesc'),
    },
  ];
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background via-primary/5 to-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-grid-white/5 bg-[size:20px_20px]" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-primary-glow to-secondary bg-clip-text text-transparent">
            {t('statistics.title')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('statistics.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statistics.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group relative"
              >
                <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 text-center hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-glow mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  
                  <div className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  
                  <div className="text-foreground font-semibold mb-1">
                    {stat.label}
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    {stat.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground italic">
            {t('statistics.disclaimer')}
          </p>
        </div>
      </div>
    </section>
  );
};
