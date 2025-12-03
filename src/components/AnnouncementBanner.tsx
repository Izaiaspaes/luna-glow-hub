import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";

interface Banner {
  id: string;
  title: string;
  message: string;
  banner_type: string;
  link_url?: string;
  link_text?: string;
  image_url?: string;
}

export const AnnouncementBanner = () => {
  const { t } = useTranslation();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissedBanners, setDismissedBanners] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchBanners();
    
    // Load dismissed banners from localStorage
    const dismissed = localStorage.getItem("dismissedBanners");
    if (dismissed) {
      setDismissedBanners(new Set(JSON.parse(dismissed)));
    }
  }, []);

  const fetchBanners = async () => {
    const { data, error } = await supabase
      .from("announcement_banners")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching banners:", error);
      return;
    }

    if (data) {
      setBanners(data);
    }
  };

  const activeBanners = banners.filter(banner => !dismissedBanners.has(banner.id));

  // Auto-rotate banners
  useEffect(() => {
    if (activeBanners.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [activeBanners.length]);

  const handleDismiss = (bannerId: string) => {
    const newDismissed = new Set(dismissedBanners);
    newDismissed.add(bannerId);
    setDismissedBanners(newDismissed);
    localStorage.setItem("dismissedBanners", JSON.stringify([...newDismissed]));
    
    // Adjust current index if needed
    if (currentIndex >= activeBanners.length - 1) {
      setCurrentIndex(0);
    }
  };

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => 
      prev === 0 ? activeBanners.length - 1 : prev - 1
    );
  }, [activeBanners.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => 
      (prev + 1) % activeBanners.length
    );
  }, [activeBanners.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (activeBanners.length === 0) return null;

  const currentBanner = activeBanners[currentIndex];

  const getBannerGradient = (type: string) => {
    switch (type) {
      case "warning":
        return "from-amber-500/20 via-orange-500/20 to-amber-600/20";
      case "success":
        return "from-emerald-500/20 via-green-500/20 to-teal-500/20";
      case "promo":
        return "from-luna-pink/30 via-luna-purple/30 to-luna-blue/30";
      default:
        return "from-primary/20 via-luna-purple/20 to-luna-pink/20";
    }
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Widescreen Carousel Banner */}
      <div 
        className={`relative w-full h-[200px] md:h-[280px] lg:h-[320px] bg-gradient-to-r ${getBannerGradient(currentBanner.banner_type)}`}
      >
        {/* Background Image or Gradient */}
        {currentBanner.image_url && (
          <div className="absolute inset-0">
            <img 
              src={currentBanner.image_url} 
              alt={currentBanner.title}
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />
          </div>
        )}

        {/* Content */}
        <div className="relative h-full container mx-auto px-4 flex items-center">
          <div className="max-w-xl space-y-4 z-10">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground drop-shadow-lg">
              {currentBanner.title}
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-foreground/90 drop-shadow">
              {currentBanner.message}
            </p>
            {currentBanner.link_url && (
              <Button
                size="lg"
                className="bg-gradient-colorful hover:opacity-90 text-white font-semibold shadow-lg"
                onClick={() => window.open(currentBanner.link_url, "_blank")}
              >
                {currentBanner.link_text || t("common.learnMore")}
              </Button>
            )}
          </div>
        </div>

        {/* Navigation Arrows */}
        {activeBanners.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/50 hover:bg-background/80 backdrop-blur-sm"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/50 hover:bg-background/80 backdrop-blur-sm"
              onClick={goToNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}

        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 h-8 w-8 rounded-full bg-background/50 hover:bg-background/80 backdrop-blur-sm"
          onClick={() => handleDismiss(currentBanner.id)}
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Dots Indicator */}
        {activeBanners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {activeBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? "bg-primary w-8" 
                    : "bg-foreground/30 hover:bg-foreground/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
