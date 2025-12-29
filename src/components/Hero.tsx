import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { ArrowRight, LogIn, User, LogOut, LayoutDashboard, Shield, Smartphone } from "lucide-react";
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
  
  const tx = (key: string, fallback: string) => {
    const value = t(key, { defaultValue: fallback });
    return value === key ? fallback : value;
  };
  
  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };
  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };
  return <section className="relative min-h-[calc(100vh-48px)] sm:min-h-[calc(100vh-56px)] md:min-h-screen flex items-center justify-center overflow-hidden bg-gradient-soft">
      <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-4 sm:space-y-6 md:space-y-8 text-center lg:text-left">
            <div className="inline-block">
              
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
              {tx('hero.title', 'Sua jornada de bem-estar começa aqui')}
            </h1>
            
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
              {tx('hero.subtitle', 'Acompanhe seu ciclo, sono, humor e energia com IA personalizada para você')}
            </p>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-center lg:justify-start">
              <NavLink to="/onboarding">
                <Button variant="colorful" size="default" className="group w-full sm:w-auto h-10 sm:h-11 md:h-12 text-sm sm:text-base">
                  {tx('hero.cta', 'Começar Grátis')}
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </NavLink>
              <NavLink to="/features">
                <Button variant="outline" size="default" className="w-full sm:w-auto h-10 sm:h-11 md:h-12 text-sm sm:text-base">
                  {tx('hero.ctaSecondary', 'Ver Funcionalidades')}
                </Button>
              </NavLink>
              <NavLink to="/install" className="hidden sm:block">
                <Button variant="ghost" size="default" className="gap-2 h-10 sm:h-11 md:h-12 text-sm sm:text-base">
                  <Smartphone className="h-4 w-4 sm:h-5 sm:w-5" />
                  {tx('install.installApp', 'Instalar App')}
                </Button>
              </NavLink>
            </div>

            {/* Stats - More compact on mobile */}
            <div className="flex items-center gap-4 sm:gap-6 md:gap-8 justify-center lg:justify-start pt-2 sm:pt-4">
              <div className="text-center">
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">100%</p>
                <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">{tx('hero.stats.private', 'Privado')}</p>
              </div>
              <div className="h-8 sm:h-10 md:h-12 w-px bg-border"></div>
              <div className="text-center">
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">{tx('hero.stats.free', 'Grátis')}</p>
                <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">{tx('hero.stats.freeDesc', 'Para sempre')}</p>
              </div>
              <div className="h-8 sm:h-10 md:h-12 w-px bg-border"></div>
              <div className="text-center">
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">{tx('hero.stats.ai', 'IA')}</p>
                <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">{tx('hero.stats.aiDesc', 'Personalizada')}</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative lg:order-last">
            <div className="relative rounded-3xl overflow-hidden shadow-hover">
              <img 
                src={heroImage} 
                alt="Mulher feliz usando o aplicativo Luna" 
                loading="lazy"
                className="w-full h-auto object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent"></div>
            </div>
            
            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-2xl shadow-hover max-w-xs hidden lg:block">
              <p className="text-sm text-muted-foreground mb-2">{tx('hero.floatingCard.lastAnalysis', 'Última análise')}</p>
              <p className="font-semibold text-lg">{tx('hero.floatingCard.sleepImprovement', '+23% qualidade do sono')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>;
};