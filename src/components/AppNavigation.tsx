import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Settings, LogOut, Home, LayoutDashboard, Sparkles, DollarSign, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "@/components/LanguageSelector";
import logoLuna from "@/assets/logo-luna.png";

export const AppNavigation = () => {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  // Don't show on auth page or onboarding
  if (location.pathname === "/auth" || location.pathname === "/onboarding") {
    return null;
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link to={user ? "/dashboard" : "/"} onClick={handleLogoClick} className="flex items-center gap-2">
            <img src={logoLuna} alt="Luna" className="h-8 w-auto" />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            <Button
              variant={isActive("/") || isActive("/dashboard") ? "default" : "ghost"}
              size="sm"
              onClick={handleHomeClick}
              className="gap-2"
            >
              {user ? (
                <>
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </>
              ) : (
                <>
                  <Home className="h-4 w-4" />
                  {t("nav.home")}
                </>
              )}
            </Button>

            <Button
              variant={isActive("/features") ? "default" : "ghost"}
              size="sm"
              onClick={() => navigate("/features")}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Funcionalidades
            </Button>

            <Button
              variant={isActive("/pricing") ? "default" : "ghost"}
              size="sm"
              onClick={() => navigate("/pricing")}
              className="gap-2"
            >
              <DollarSign className="h-4 w-4" />
              Preços
            </Button>

            {user && isAdmin && (
              <Button
                variant={isActive("/admin") ? "default" : "ghost"}
                size="sm"
                onClick={() => navigate("/admin")}
                className="gap-2"
              >
                <ShieldCheck className="h-4 w-4" />
                Painel de Controle
              </Button>
            )}
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          <LanguageSelector />
          {user ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/dashboard?settings=true")}
                title="Configurações"
              >
                <Settings className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate("/auth")}
            >
              Entrar
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};
