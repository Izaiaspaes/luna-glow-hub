import { useState } from "react";
import { Menu, X, Heart, Sparkles, DollarSign, BookOpen, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { NavLink } from "@/components/NavLink";
import logoLuna from "@/assets/logo-luna.png";

export const MobileNav = () => {
  const [open, setOpen] = useState(false);

  const menuItems = [
    {
      title: "Início",
      href: "/",
      icon: Heart,
    },
    {
      title: "Funcionalidades",
      href: "/features",
      icon: Sparkles,
    },
    {
      title: "Preços",
      href: "/pricing",
      icon: DollarSign,
    },
    {
      title: "Blog",
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
          <div className="pt-4 border-t border-border">
            <NavLink to="/auth" onClick={() => setOpen(false)}>
              <Button variant="hero" size="lg" className="w-full gap-2">
                <LogIn className="h-5 w-5" />
                Entrar
              </Button>
            </NavLink>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
};
