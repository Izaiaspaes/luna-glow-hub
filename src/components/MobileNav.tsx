import { useState } from "react";
import { Menu, X, Heart, Sparkles, DollarSign, BookOpen, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { NavLink } from "@/components/NavLink";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "@/components/LanguageSelector";
import logoLuna from "@/assets/logo-luna.png";

export const MobileNav = () => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const menuItems = [
    {
      title: t('nav.home') || "Início",
      href: "/",
      icon: Heart,
    },
    {
      title: t('nav.features'),
      href: "/features",
      icon: Sparkles,
    },
    {
      title: t('nav.pricing'),
      href: "/pricing",
      icon: DollarSign,
    },
    {
      title: t('nav.blog'),
      href: "/blog",
      icon: BookOpen,
    },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <img src={logoLuna} alt="Luna Logo" className="h-8 w-auto" />
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4 mt-8">
          {menuItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-smooth"
              activeClassName="bg-primary/10 text-primary font-medium"
            >
              <item.icon className="h-5 w-5" />
              <span className="text-lg">{item.title}</span>
            </NavLink>
          ))}
          <div className="pt-4 border-t border-border space-y-4">
            <LanguageSelector />
            <NavLink to="/auth" onClick={() => setOpen(false)}>
              <Button variant="hero" size="lg" className="w-full gap-2">
                <LogIn className="h-5 w-5" />
                {t('common.login')}
              </Button>
            </NavLink>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
};
