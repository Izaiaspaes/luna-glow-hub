import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="py-8 border-t border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm">
            <Link 
              to="/privacy" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Política de Privacidade
            </Link>
            <span className="hidden md:inline text-muted-foreground">•</span>
            <Link 
              to="/terms" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Termos de Uso
            </Link>
            <span className="hidden md:inline text-muted-foreground">•</span>
            <Link 
              to="/refund-policy" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Política de Reembolso
            </Link>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>© {new Date().getFullYear()} Luna. Todos os direitos reservados.</span>
            </div>
            <div className="flex items-center gap-1">
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
      </div>
    </footer>
  );
};
