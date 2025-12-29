import { Mail, Phone, Share2, Smartphone } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { SuggestionsForm } from "@/components/SuggestionsForm";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import logoLuna from "@/assets/logo-luna.png";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  const tx = (key: string, fallback: string) => {
    const value = t(key, { defaultValue: fallback });
    return value === key ? fallback : value;
  };

  const handleShare = async () => {
    const shareData = {
      title: `Luna - ${tx(
        "footer.description",
        "Plataforma de bem-estar feminino com IA",
      )}`,
      text: t("hero.subtitle"),
      url: window.location.origin,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.origin);
        toast.success(t("common.copied") || "Link copiado!");
      }
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
    }
  };

  return (
    <footer className="bg-muted/30 border-t border-border py-12">
      <div className="container mx-auto px-4">
        {/* Newsletter and Suggestions Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <NewsletterSignup />
          <SuggestionsForm />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <img src={logoLuna} alt="Luna Logo" className="h-14 w-auto" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              {tx("footer.description", "Plataforma de bem-estar feminino com IA")}
            </p>
          </div>

          {/* Contato */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contato</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a
                  href="mailto:contato@lunaglow.com.br"
                  className="hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Mail className="h-4 w-4 text-primary/70" />
                  contato@lunaglow.com.br
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/5511963697488"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Phone className="h-4 w-4 text-primary/70" />
                  +55 11 96369-7488
                </a>
              </li>
            </ul>
          </div>

          {/* Produto */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Produto</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <NavLink to="/features" className="hover:text-primary transition-colors">
                  Funcionalidades
                </NavLink>
              </li>
              <li>
                <NavLink to="/pricing" className="hover:text-primary transition-colors">
                  Assinaturas
                </NavLink>
              </li>
              <li>
                <NavLink to="/install" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <Smartphone className="h-3.5 w-3.5" />
                  Instalar App
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Comunidade */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Comunidade</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <NavLink to="/blog" className="hover:text-primary transition-colors">
                  Blog
                </NavLink>
              </li>
              <li>
                <NavLink to="/blog" className="hover:text-primary transition-colors">
                  Histórias
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <NavLink to="/privacy-policy" className="hover:text-primary transition-colors">
                  Privacidade
                </NavLink>
              </li>
              <li>
                <NavLink to="/terms" className="hover:text-primary transition-colors">
                  Termos de Uso
                </NavLink>
              </li>
              <li>
                <NavLink to="/refund-policy" className="hover:text-primary transition-colors">
                  Reembolso
                </NavLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Luna
            </p>
            <Button
              onClick={handleShare}
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <span>Desenvolvido por</span>
            <a
              href="https://topdigitais.net"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Top Digitais
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
