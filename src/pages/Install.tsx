import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Smartphone, Download, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Listen for the beforeinstallprompt event
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-luna-pink/5 to-luna-purple/5 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 space-y-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-luna-pink to-luna-purple rounded-3xl flex items-center justify-center shadow-lg">
              <Smartphone className="w-12 h-12 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold bg-gradient-to-r from-luna-pink via-luna-purple to-luna-orange bg-clip-text text-transparent">
            Instale o Luna
          </h1>
          
          <p className="text-muted-foreground text-lg">
            Tenha acesso rápido ao Luna diretamente da tela inicial do seu celular
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-luna-green mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold">Acesso Instantâneo</h3>
              <p className="text-sm text-muted-foreground">
                Um toque e você está no app, sem abrir o navegador
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-luna-green mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold">Funciona Offline</h3>
              <p className="text-sm text-muted-foreground">
                Registre seus dados mesmo sem internet
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-luna-green mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold">Privacidade Total</h3>
              <p className="text-sm text-muted-foreground">
                Seus dados ficam seguros no seu dispositivo
              </p>
            </div>
          </div>
        </div>

        {isInstalled ? (
          <div className="text-center space-y-4">
            <div className="p-4 bg-luna-green/10 border border-luna-green/20 rounded-lg">
              <p className="text-luna-green font-semibold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Luna já está instalado!
              </p>
            </div>
            <Button 
              onClick={() => navigate('/dashboard')}
              className="w-full"
              size="lg"
            >
              Ir para o Dashboard
            </Button>
          </div>
        ) : isIOS ? (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h3 className="font-semibold mb-2">Como instalar no iPhone/iPad:</h3>
              <ol className="text-sm space-y-2 list-decimal list-inside text-muted-foreground">
                <li>Toque no ícone de compartilhar (quadrado com seta) na barra inferior do Safari</li>
                <li>Role para baixo e toque em "Adicionar à Tela de Início"</li>
                <li>Toque em "Adicionar" no canto superior direito</li>
              </ol>
            </div>
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Voltar ao Início
            </Button>
          </div>
        ) : deferredPrompt ? (
          <div className="space-y-3">
            <Button 
              onClick={handleInstall}
              className="w-full"
              size="lg"
            >
              <Download className="w-5 h-5 mr-2" />
              Instalar Agora
            </Button>
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Talvez Mais Tarde
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                Para instalar, abra este site no navegador Chrome ou Edge do seu Android
              </p>
            </div>
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Voltar ao Início
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Install;