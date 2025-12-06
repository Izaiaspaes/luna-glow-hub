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
  updated_at?: string;
  force_display_at?: string;
}

interface DismissedBanner {
  id: string;
  dismissedAt: string;
}

export const AnnouncementBanner = () => {
  const { t } = useTranslation();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissedBanners, setDismissedBanners] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    fetchBanners();
    
    // Load dismissed banners from localStorage (with dismissal timestamps)
    const dismissed = localStorage.getItem("dismissedBannersV2");
    if (dismissed) {
      try {
        const parsed: DismissedBanner[] = JSON.parse(dismissed);
        const map = new Map<string, string>();
        parsed.forEach(item => map.set(item.id, item.dismissedAt));
        setDismissedBanners(map);
      } catch {
        // Clear old format if exists
        localStorage.removeItem("dismissedBanners");
      }
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

  // Filter banners: show if not dismissed OR if updated/forced after being dismissed
  const activeBanners = banners.filter(banner => {
    const dismissedAt = dismissedBanners.get(banner.id);
    if (!dismissedAt) return true; // Never dismissed
    
    const dismissedDate = new Date(dismissedAt);
    
    // Show again if admin forced display after being dismissed
    if (banner.force_display_at && new Date(banner.force_display_at) > dismissedDate) {
      return true;
    }
    
    // Show again if banner was updated after being dismissed
    if (banner.updated_at && new Date(banner.updated_at) > dismissedDate) {
      return true;
    }
    
    return false;
  });

  // Auto-rotate banners
  useEffect(() => {
    if (activeBanners.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [activeBanners.length]);

  const handleDismiss = (bannerId: string) => {
    const newDismissed = new Map(dismissedBanners);
    newDismissed.set(bannerId, new Date().toISOString());
    setDismissedBanners(newDismissed);
    
    // Save as array of DismissedBanner objects
    const toSave: DismissedBanner[] = Array.from(newDismissed.entries()).map(([id, dismissedAt]) => ({
      id,
      dismissedAt
    }));
    localStorage.setItem("dismissedBannersV2", JSON.stringify(toSave));
    
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
      {/* Mobile-optimized Carousel Banner */}
      <div 
        className={`relative w-full h-[120px] sm:h-[160px] md:h-[200px] lg:h-[280px] bg-gradient-to-r ${getBannerGradient(currentBanner.banner_type)}`}
      >
        {/* Background Image or Gradient */}
        {currentBanner.image_url && (
          <div className="absolute inset-0">
            <img 
              src={currentBanner.image_url} 
              alt={currentBanner.title}
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
          </div>
        )}

        {/* Content - Mobile optimized */}
        <div className="relative h-full container mx-auto px-3 sm:px-4 flex items-center">
          <div className="max-w-[85%] sm:max-w-xl space-y-1 sm:space-y-2 md:space-y-3 z-10 pr-8">
            <h2 className="text-base sm:text-xl md:text-2xl lg:text-4xl font-bold text-foreground drop-shadow-lg line-clamp-1 sm:line-clamp-2">
              {currentBanner.title}
            </h2>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-foreground/90 drop-shadow line-clamp-2 sm:line-clamp-3">
              {currentBanner.message}
            </p>
            {currentBanner.link_url && (
              <Button
                size="sm"
                className="bg-gradient-colorful hover:opacity-90 text-white font-semibold shadow-lg text-xs sm:text-sm h-7 sm:h-8 md:h-10 px-3 sm:px-4"
                onClick={() => window.open(currentBanner.link_url, "_blank")}
              >
                {currentBanner.link_text || t("common.learnMore")}
              </Button>
            )}
          </div>
        </div>

        {/* Navigation Arrows - Smaller on mobile */}
        {activeBanners.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-1 sm:left-2 md:left-4 top-1/2 -translate-y-1/2 h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-full bg-background/50 hover:bg-background/80 backdrop-blur-sm"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 sm:right-2 md:right-4 top-1/2 -translate-y-1/2 h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-full bg-background/50 hover:bg-background/80 backdrop-blur-sm"
              onClick={goToNext}
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            </Button>
          </>
        )}

        {/* Close Button - Smaller on mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1 sm:top-2 md:top-4 right-1 sm:right-2 md:right-4 h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 rounded-full bg-background/50 hover:bg-background/80 backdrop-blur-sm"
          onClick={() => handleDismiss(currentBanner.id)}
        >
          <X className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>

        {/* Dots Indicator - Smaller on mobile */}
        {activeBanners.length > 1 && (
          <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 sm:gap-1.5 md:gap-2">
            {activeBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-1.5 sm:h-2 md:h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? "bg-primary w-4 sm:w-5 md:w-8" 
                    : "bg-foreground/30 hover:bg-foreground/50 w-1.5 sm:w-2 md:w-3"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
