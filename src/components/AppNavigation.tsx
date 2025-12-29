import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Settings, LogOut, Home, LayoutDashboard, Sparkles, DollarSign, ShieldCheck, Menu } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";
import logoLuna from "@/assets/logo-luna.png";

export const AppNavigation = () => {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tx = (key: string, fallback: string) => {
    const value = t(key, { defaultValue: fallback });
    return value === key ? fallback : value;
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  const handleHomeClick = (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        console.error('Logout error:', error);
      }
      // Force navigation to home regardless of error
      window.location.href = "/";
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = "/";
    }
  };

  // Don't show on auth page or onboarding
  if (location.pathname === "/auth" || location.pathname === "/onboarding") {
    return null;
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-12 sm:h-14 md:h-16 items-center justify-between px-3 sm:px-4">
        <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
          {/* Logo - Smaller on mobile */}
          <Link to={user ? "/dashboard" : "/"} onClick={handleLogoClick} className="flex items-center gap-2">
            <img src={logoLuna} alt="Luna" className="h-6 sm:h-7 md:h-8 w-auto" />
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
                  {tx("nav.dashboard", "Dashboard")}
                </>
              ) : (
                <>
                  <Home className="h-4 w-4" />
                  {tx("nav.home", "Início")}
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
              {tx("nav.features", "Funcionalidades")}
            </Button>

            <Button
              variant={isActive("/pricing") ? "default" : "ghost"}
              size="sm"
              onClick={() => navigate("/pricing")}
              className="gap-2"
            >
              <DollarSign className="h-4 w-4" />
              {tx("nav.pricing", "Assinaturas")}
            </Button>

            {user && isAdmin && (
              <Button
                variant={isActive("/admin") ? "default" : "ghost"}
                size="sm"
                onClick={() => navigate("/admin")}
                className="gap-2"
              >
                <ShieldCheck className="h-4 w-4" />
                {tx("nav.adminPanel", "Painel Admin")}
              </Button>
            )}
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <LanguageSelector />
          </div>
          {user ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/dashboard?settings=true")}
                title={tx("nav.settings", "Configurações")}
                className="hidden md:inline-flex"
              >
                <Settings className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2 hidden md:inline-flex"
              >
                <LogOut className="h-4 w-4" />
                {tx("nav.logout", "Sair")}
              </Button>
            </>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate("/auth")}
              className="hidden md:inline-flex"
            >
              {tx("nav.login", "Entrar")}
            </Button>
          )}
          
          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">{tx("nav.openMenu", "Abrir menu")}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <img src={logoLuna} alt="Luna" className="h-8 w-auto" />
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                <Button
                  variant={isActive("/") || isActive("/dashboard") ? "default" : "ghost"}
                  onClick={() => {
                    handleHomeClick();
                    setMobileMenuOpen(false);
                  }}
                  className="justify-start gap-3"
                >
                  {user ? (
                    <>
                      <LayoutDashboard className="h-5 w-5" />
                      {tx("nav.dashboard", "Dashboard")}
                    </>
                  ) : (
                    <>
                      <Home className="h-5 w-5" />
                      {tx("nav.home", "Início")}
                    </>
                  )}
                </Button>
                
                <Button
                  variant={isActive("/features") ? "default" : "ghost"}
                  onClick={() => {
                    navigate("/features");
                    setMobileMenuOpen(false);
                  }}
                  className="justify-start gap-3"
                >
                  <Sparkles className="h-5 w-5" />
                  {tx("nav.features", "Funcionalidades")}
                </Button>
                
                <Button
                  variant={isActive("/pricing") ? "default" : "ghost"}
                  onClick={() => {
                    navigate("/pricing");
                    setMobileMenuOpen(false);
                  }}
                  className="justify-start gap-3"
                >
                  <DollarSign className="h-5 w-5" />
                  {tx("nav.pricing", "Assinaturas")}
                </Button>
                
                {user && isAdmin && (
                  <Button
                    variant={isActive("/admin") ? "default" : "ghost"}
                    onClick={() => {
                      navigate("/admin");
                      setMobileMenuOpen(false);
                    }}
                    className="justify-start gap-3"
                  >
                    <ShieldCheck className="h-5 w-5" />
                    {tx("nav.adminPanel", "Painel Admin")}
                  </Button>
                )}
                
                <div className="pt-4 border-t border-border space-y-4">
                  <LanguageSelector />
                  
                  {user ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => {
                          navigate("/dashboard?settings=true");
                          setMobileMenuOpen(false);
                        }}
                        className="w-full justify-start gap-3"
                      >
                        <Settings className="h-5 w-5" />
                        {tx("nav.settings", "Configurações")}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full justify-start gap-3"
                      >
                        <LogOut className="h-5 w-5" />
                        {tx("nav.logout", "Sair")}
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="default"
                      onClick={() => {
                        navigate("/auth");
                        setMobileMenuOpen(false);
                      }}
                      className="w-full"
                    >
                      {tx("nav.login", "Entrar")}
                    </Button>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};
