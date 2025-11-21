import { Heart } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { NewsletterSignup } from "@/components/NewsletterSignup";

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
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-xl font-bold">Luna</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Sua plataforma de bem-estar, comunidade e lifestyle feminina.
            </p>
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
                <a href="#" className="hover:text-primary transition-smooth">
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
