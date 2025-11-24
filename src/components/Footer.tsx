import { Heart, Mail } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import logoLuna from "@/assets/logo-luna.png";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

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
              className="h-12 w-auto mb-2"
            />
            <p className="text-sm text-muted-foreground">
              Sua plataforma de bem-estar, comunidade e lifestyle feminina.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <a href="mailto:contato@luna.com.br" className="hover:text-primary transition-smooth">
                contato@luna.com.br
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <a href="mailto:suporte@luna.com.br" className="hover:text-primary transition-smooth">
                suporte@luna.com.br
              </a>
            </div>
          </div>

          {/* Produto */}
          <div>
            <h4 className="font-semibold mb-4">Produto</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <NavLink to="/features" className="hover:text-primary transition-smooth">
                  Funcionalidades
                </NavLink>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-smooth">
                  Privacidade
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-smooth">
                  Segurança
                </a>
              </li>
              <li>
                <NavLink to="/pricing" className="hover:text-primary transition-smooth">
                  Preços
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Comunidade */}
          <div>
            <h4 className="font-semibold mb-4">Comunidade</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <NavLink to="/blog" className="hover:text-primary transition-smooth">
                  Blog
                </NavLink>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-smooth">
                  Histórias
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-smooth">
                  Eventos
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-smooth">
                  Parceiros
                </a>
              </li>
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h4 className="font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-smooth">
                  Sobre nós
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-smooth">
                  Carreiras
                </a>
              </li>
              <li>
                <a href="mailto:contato@luna.com.br" className="hover:text-primary transition-smooth">
                  Contato
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-smooth">
                  Imprensa
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Luna. Todos os direitos reservados.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-smooth">
              Termos de Uso
            </a>
            <a href="#" className="hover:text-primary transition-smooth">
              Política de Privacidade
            </a>
            <a href="#" className="hover:text-primary transition-smooth">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
