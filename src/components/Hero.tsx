import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { ArrowRight, LogIn, User, LogOut, LayoutDashboard, Shield } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-wellness.jpg";
import logoLuna from "@/assets/logo-luna.png";

export const Hero = () => {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-soft">
      {/* Navigation Bar */}
      <nav className="absolute top-0 left-0 right-0 z-10 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <img 
            src={logoLuna} 
            alt="Luna Logo" 
            className="h-14 w-auto"
          />
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(user.email || "U")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem onClick={() => navigate("/admin")}>
                    <Shield className="mr-2 h-4 w-4" />
                    Painel Admin
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <NavLink to="/auth">
              <Button variant="outline" size="sm" className="gap-2">
                <LogIn className="h-4 w-4" />
                Login
              </Button>
            </NavLink>
          )}
        </div>
      </nav>
      <div className="container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-block">
              <span className="px-4 py-2 bg-accent/50 text-accent-foreground rounded-full text-sm font-medium">
                🌙 Lançamento em breve
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Seu bem-estar,{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                sua comunidade
              </span>
              , seu estilo
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
              Luna é a plataforma completa para mulheres que buscam equilíbrio: 
              rastreamento de saúde hormonal e mental, comunidade segura e curadoria 
              consciente de produtos — tudo em um lugar privado e personalizado.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <NavLink to="/auth">
                <Button variant="hero" size="lg" className="group">
                  Começar agora
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </NavLink>
              <NavLink to="/features">
                <Button variant="outline" size="lg">
                  Saiba mais
                </Button>
              </NavLink>
            </div>

            <div className="flex items-center gap-8 justify-center lg:justify-start pt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">100%</p>
                <p className="text-sm text-muted-foreground">Privado</p>
              </div>
              <div className="h-12 w-px bg-border"></div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">Gratuito</p>
                <p className="text-sm text-muted-foreground">Para começar</p>
              </div>
              <div className="h-12 w-px bg-border"></div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">24/7</p>
                <p className="text-sm text-muted-foreground">Assistente AI</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative lg:order-last">
            <div className="relative rounded-3xl overflow-hidden shadow-hover">
              <img 
                src={heroImage} 
                alt="Mulher praticando bem-estar" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent"></div>
            </div>
            
            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-2xl shadow-hover max-w-xs hidden lg:block">
              <p className="text-sm text-muted-foreground mb-2">Última análise</p>
              <p className="font-semibold text-lg">Seus padrões de sono melhoraram 23%</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
