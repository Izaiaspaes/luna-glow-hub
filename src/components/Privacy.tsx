import { Shield, Lock, Eye, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

export const Privacy = () => {
  const { t } = useTranslation();

  const privacyFeatures = [
    {
      icon: Shield,
      title: t('privacy.encrypted'),
      description: t('privacy.encryptedDesc'),
    },
    {
      icon: Lock,
      title: t('privacy.control'),
      description: t('privacy.controlDesc'),
    },
    {
      icon: Eye,
      title: t('privacy.transparency'),
      description: t('privacy.transparencyDesc'),
    },
    {
      icon: Download,
      title: t('privacy.yourData'),
      description: t('privacy.yourDataDesc'),
    },
  ];
  return (
    <section className="py-20 lg:py-32 bg-gradient-soft">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/20 text-secondary mb-4">
              <Shield className="w-8 h-8" />
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              {t('privacy.title')}{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                {t('privacy.titleHighlight')}
              </span>
            </h2>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('privacy.subtitle')}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {privacyFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="p-6 bg-card hover:shadow-soft transition-smooth border-2"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="mt-12 p-8 bg-card rounded-2xl border-2 border-border">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-2 h-2 bg-secondary rounded-full mt-2"></div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground">{t('privacy.commitment')}</strong> 
                {" "}{t('privacy.commitmentText')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
