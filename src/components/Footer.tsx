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

        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <img src={logoLuna} alt="Luna Logo" className="h-16 w-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              {tx(
                "footer.description",
                "Plataforma de bem-estar feminino com IA",
              )}
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <a
                href="mailto:contato@lunaglow.com.br"
                className="hover:text-primary transition-smooth"
              >
                contato@lunaglow.com.br
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <a
                href="mailto:suporte@lunaglow.com.br"
                className="hover:text-primary transition-smooth"
              >
                suporte@lunaglow.com.br
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              <a
                href="https://wa.me/5511963697488"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-smooth"
              >
                +55 11 96369-7488
              </a>
            </div>
          </div>

          {/* Produto */}
          <div>
            <h4 className="font-semibold mb-4">{tx("footer.product", "Produto")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <NavLink to="/features" className="hover:text-primary transition-smooth">
                  {t("nav.features")}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/privacy-policy"
                  className="hover:text-primary transition-smooth"
                >
                  {t("privacy.title")}
                </NavLink>
              </li>
              <li>
                <NavLink to="/features" className="hover:text-primary transition-smooth">
                  {tx("footer.security", "Segurança")}
                </NavLink>
              </li>
              <li>
                <NavLink to="/pricing" className="hover:text-primary transition-smooth">
                  {t("nav.pricing")}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/install"
                  className="hover:text-primary transition-smooth flex items-center gap-1"
                >
                  <Smartphone className="h-3 w-3" />
                  {t("install.installApp", "Instalar App")}
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Comunidade */}
          <div>
            <h4 className="font-semibold mb-4">
              {tx("footer.community", "Comunidade")}
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <NavLink to="/blog" className="hover:text-primary transition-smooth">
                  {t("nav.blog")}
                </NavLink>
              </li>
              <li>
                <NavLink to="/blog" className="hover:text-primary transition-smooth">
                  {tx("footer.stories", "Histórias")}
                </NavLink>
              </li>
              <li>
                <NavLink to="/features" className="hover:text-primary transition-smooth">
                  {tx("footer.events", "Eventos")}
                </NavLink>
              </li>
              <li>
                <NavLink to="/features" className="hover:text-primary transition-smooth">
                  {tx("footer.partners", "Parceiros")}
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h4 className="font-semibold mb-4">{tx("footer.company", "Empresa")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <NavLink to="/features" className="hover:text-primary transition-smooth">
                  {tx("footer.about", "Sobre nós")}
                </NavLink>
              </li>
              <li>
                <NavLink to="/features" className="hover:text-primary transition-smooth">
                  {tx("footer.careers", "Carreiras")}
                </NavLink>
              </li>
              <li>
                <a
                  href="mailto:contato@lunaglow.com.br"
                  className="hover:text-primary transition-smooth"
                >
                  {tx("footer.contact", "Contato")}
                </a>
              </li>
              <li>
                <NavLink to="/blog" className="hover:text-primary transition-smooth">
                  {tx("footer.press", "Imprensa")}
                </NavLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border flex flex-col gap-4">
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm text-muted-foreground">
            <NavLink to="/terms" className="hover:text-primary transition-smooth">
              {tx("footer.terms", "Termos de Uso")}
            </NavLink>
            <NavLink
              to="/privacy-policy"
              className="hover:text-primary transition-smooth"
            >
              {tx("footer.privacyPolicy", "Política de Privacidade")}
            </NavLink>
            <NavLink
              to="/refund-policy"
              className="hover:text-primary transition-smooth"
            >
              {tx("footer.refundPolicy", "Política de Reembolso")}
            </NavLink>
            <NavLink
              to="/privacy-policy"
              className="hover:text-primary transition-smooth"
            >
              {tx("footer.cookies", "Cookies")}
            </NavLink>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <p className="text-sm text-muted-foreground">
                © {currentYear} Luna. {tx("footer.rights", "Todos os direitos reservados.")}
              </p>
              <Button
                onClick={handleShare}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Share2 className="h-4 w-4" />
                {tx("footer.share", "Compartilhar Luna")}
              </Button>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>{tx("footer.developedBy", "Desenvolvido por")}</span>
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
      </div>
    </footer>
  );
};
