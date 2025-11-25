import { Heart, Mail, Phone, Share2 } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import logoLuna from "@/assets/logo-luna.png";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  const handleShare = async () => {
    const shareData = {
      title: 'Luna - ' + t('footer.description'),
      text: t('hero.subtitle'),
      url: window.location.origin
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.origin);
        toast.success(t('common.copied') || "Link copiado!");
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  return (
    <footer className="bg-muted/30 border-t border-border py-12">
      <div className="container mx-auto px-4">
        {/* Newsletter Section */}
        <div className="mb-12">
          <NewsletterSignup />
        </div>

        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <img 
              src={logoLuna} 
              alt="Luna Logo" 
              className="h-16 w-auto mb-2"
            />
            <p className="text-sm text-muted-foreground">
              {t('footer.description')}
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <a href="mailto:contato.luna@topdigitais.net" className="hover:text-primary transition-smooth">
                contato.luna@topdigitais.net
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <a href="mailto:suporte@topdigitais.net" className="hover:text-primary transition-smooth">
                suporte@topdigitais.net
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              <a href="https://wa.me/5511963697488" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-smooth">
                +55 11 96369-7488
              </a>
            </div>
          </div>

          {/* Produto */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.product') || 'Produto'}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <NavLink to="/features" className="hover:text-primary transition-smooth">
                  {t('nav.features')}
                </NavLink>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-smooth">
                  {t('privacy.title')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-smooth">
                  {t('footer.security') || 'Segurança'}
                </a>
              </li>
              <li>
                <NavLink to="/pricing" className="hover:text-primary transition-smooth">
                  {t('nav.pricing')}
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Comunidade */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.community') || 'Comunidade'}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <NavLink to="/blog" className="hover:text-primary transition-smooth">
                  {t('nav.blog')}
                </NavLink>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-smooth">
                  {t('footer.stories') || 'Histórias'}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-smooth">
                  {t('footer.events') || 'Eventos'}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-smooth">
                  {t('footer.partners') || 'Parceiros'}
                </a>
              </li>
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.company') || 'Empresa'}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-smooth">
                  {t('footer.about') || 'Sobre nós'}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-smooth">
                  {t('footer.careers') || 'Carreiras'}
                </a>
              </li>
              <li>
                <a href="mailto:contato.luna@topdigitais.net" className="hover:text-primary transition-smooth">
                  {t('footer.contact')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-smooth">
                  {t('footer.press') || 'Imprensa'}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Luna. {t('footer.rights')}
            </p>
            <Button 
              onClick={handleShare} 
              variant="outline" 
              size="sm"
              className="gap-2"
            >
              <Share2 className="h-4 w-4" />
              {t('footer.share') || 'Compartilhar Luna'}
            </Button>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-smooth">
              {t('footer.terms') || 'Termos de Uso'}
            </a>
            <a href="#" className="hover:text-primary transition-smooth">
              {t('footer.privacyPolicy') || 'Política de Privacidade'}
            </a>
            <a href="#" className="hover:text-primary transition-smooth">
              {t('footer.cookies') || 'Cookies'}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
