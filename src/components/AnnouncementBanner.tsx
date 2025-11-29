import { useState, useEffect } from "react";
import { X, ExternalLink, Info, AlertTriangle, CheckCircle, Sparkles } from "lucide-react";
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
}

export const AnnouncementBanner = () => {
  const { t } = useTranslation();
  const [banners, setBanners] = useState<Banner[]>([]);
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

  const handleDismiss = (bannerId: string) => {
    const newDismissed = new Set(dismissedBanners);
    newDismissed.add(bannerId);
    setDismissedBanners(newDismissed);
    localStorage.setItem("dismissedBanners", JSON.stringify([...newDismissed]));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-5 w-5" />;
      case "success":
        return <CheckCircle className="h-5 w-5" />;
      case "promo":
        return <Sparkles className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const getBannerClasses = (type: string) => {
    switch (type) {
      case "warning":
        return "bg-amber-500/10 border-amber-500/20 text-amber-900 dark:text-amber-100";
      case "success":
        return "bg-luna-green/10 border-luna-green/20 text-green-900 dark:text-green-100";
      case "promo":
        return "bg-gradient-colorful/10 border-primary/20 text-foreground";
      default:
        return "bg-primary/10 border-primary/20 text-foreground";
    }
  };

  const activeBanners = banners.filter(banner => !dismissedBanners.has(banner.id));

  if (activeBanners.length === 0) return null;

  return (
    <div className="space-y-0">
      {activeBanners.map((banner) => (
        <div
          key={banner.id}
          className={`w-full border-b ${getBannerClasses(banner.banner_type)} transition-all`}
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  {getIcon(banner.banner_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">
                    {banner.title}
                  </p>
                  <p className="text-sm opacity-90">
                    {banner.message}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {banner.link_url && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 hover:bg-background/20"
                    onClick={() => window.open(banner.link_url, "_blank")}
                  >
                    {banner.link_text || t("common.learnMore")}
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-background/20"
                  onClick={() => handleDismiss(banner.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
