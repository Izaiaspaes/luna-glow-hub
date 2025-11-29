import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { ArrowRight, LogIn, User, LogOut, LayoutDashboard, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { MobileNav } from "@/components/MobileNav";
import { LanguageSelector } from "@/components/LanguageSelector";
import heroImage from "@/assets/hero-woman-phone.jpg";
import logoLuna from "@/assets/logo-luna.png";
export const Hero = () => {
  const {
    user,
    signOut,
    isAdmin
  } = useAuth();
  const navigate = useNavigate();
  const {
    t
  } = useTranslation();
  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };
  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-soft">
      <div className="container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-block">
              
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              {t('hero.title')}
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <NavLink to="/auth">
                <Button variant="colorful" size="lg" className="group">
                  {t('hero.cta')}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </NavLink>
              <NavLink to="/features">
                <Button variant="outline" size="lg">
                  {t('hero.ctaSecondary')}
                </Button>
              </NavLink>
            </div>

            <div className="flex items-center gap-8 justify-center lg:justify-start pt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">100%</p>
                <p className="text-sm text-muted-foreground">{t('hero.stats.private')}</p>
              </div>
              <div className="h-12 w-px bg-border"></div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{t('hero.stats.free')}</p>
                <p className="text-sm text-muted-foreground">{t('hero.stats.freeDesc')}</p>
              </div>
              <div className="h-12 w-px bg-border"></div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{t('hero.stats.ai')}</p>
                <p className="text-sm text-muted-foreground">{t('hero.stats.aiDesc')}</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative lg:order-last">
            <div className="relative rounded-3xl overflow-hidden shadow-hover">
              <img src={heroImage} alt="Mulher feliz usando o aplicativo Luna" className="w-full h-auto object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent"></div>
            </div>
            
            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-2xl shadow-hover max-w-xs hidden lg:block">
              <p className="text-sm text-muted-foreground mb-2">{t('hero.floatingCard.lastAnalysis')}</p>
              <p className="font-semibold text-lg">{t('hero.floatingCard.sleepImprovement')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>;
};