import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NavLink } from "@/components/NavLink";
import { Play, Check, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export const VideoDemo = () => {
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);

  // Placeholder video - substitua pela URL real do vídeo
  const videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ";

  const benefits = [
    t("videoDemo.benefit1"),
    t("videoDemo.benefit2"),
    t("videoDemo.benefit3"),
    t("videoDemo.benefit4")
  ];

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-luna-pink/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-luna-purple/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-colorful/10 border border-primary/20 mb-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">{t("videoDemo.badge")}</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              {t("videoDemo.title")}{" "}
              <span className="bg-gradient-colorful bg-clip-text text-transparent">
                {t("videoDemo.titleHighlight")}
              </span>
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("videoDemo.subtitle")}
            </p>

            {/* Benefits List */}
            <div className="space-y-3 pt-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-1 p-1 rounded-full bg-luna-green/20">
                    <Check className="h-4 w-4 text-luna-green" />
                  </div>
                  <p className="text-foreground font-medium">{benefit}</p>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <NavLink to="/auth">
                <Button variant="colorful" size="lg" className="w-full sm:w-auto">
                  {t("videoDemo.ctaButton")}
                </Button>
              </NavLink>
              <NavLink to="/pricing">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  {t("videoDemo.ctaSecondary")}
                </Button>
              </NavLink>
            </div>

            <p className="text-sm text-muted-foreground">
              {t("videoDemo.note")}
            </p>
          </div>

          {/* Right: Video Player */}
          <div className="relative">
            <Card className="overflow-hidden border-2 border-primary/20 shadow-hover">
              <div className="relative aspect-video bg-gradient-card">
                {!isPlaying ? (
                  // Video Thumbnail/Placeholder
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-luna-purple/20 via-luna-pink/20 to-luna-blue/20">
                    <button
                      onClick={() => setIsPlaying(true)}
                      className="group relative"
                    >
                      <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-all" />
                      <div className="relative p-6 rounded-full bg-primary hover:bg-primary/90 transition-all transform group-hover:scale-110 shadow-colorful">
                        <Play className="h-12 w-12 text-white fill-white" />
                      </div>
                    </button>
                    
                    {/* Decorative elements */}
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-background/80 backdrop-blur text-xs font-medium">
                      {t("videoDemo.duration")}
                    </div>
                    <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-primary/80 backdrop-blur text-xs font-medium text-white">
                      HD
                    </div>
                  </div>
                ) : (
                  // Embedded Video
                  <iframe
                    className="w-full h-full"
                    src={videoUrl}
                    title="Luna Demo Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>
            </Card>

            {/* Floating Stats */}
            <div className="absolute -bottom-6 -left-6 hidden lg:block">
              <Card className="p-4 shadow-hover bg-card/95 backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-luna-pink/20">
                    <Sparkles className="h-5 w-5 text-luna-pink" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">500+</p>
                    <p className="text-xs text-muted-foreground">{t("videoDemo.statUsers")}</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="absolute -top-6 -right-6 hidden lg:block">
              <Card className="p-4 shadow-hover bg-card/95 backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-luna-blue/20">
                    <Check className="h-5 w-5 text-luna-blue" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">98%</p>
                    <p className="text-xs text-muted-foreground">{t("videoDemo.statSatisfaction")}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
