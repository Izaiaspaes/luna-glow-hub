export const Footer = () => {
  return (
    <footer className="py-8 border-t border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
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
    </footer>
  );
};
