import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Smartphone, Download, CheckCircle2, Share, Plus, MoreVertical, ArrowDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

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

  const iosSteps = [
    {
      step: 1,
      icon: Share,
      title: t("install.ios.step1.title", "Abra o menu de compartilhamento"),
      description: t("install.ios.step1.description", "Toque no ícone de compartilhamento na barra inferior do Safari"),
      visual: (
        <div className="flex items-center justify-center p-3 bg-gray-100 dark:bg-gray-800 rounded-xl">
          <div className="relative">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Share className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-luna-pink rounded-full flex items-center justify-center">
              <ArrowDown className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
        </div>
      )
    },
    {
      step: 2,
      icon: Plus,
      title: t("install.ios.step2.title", "Adicionar à Tela de Início"),
      description: t("install.ios.step2.description", "Role para baixo no menu e encontre a opção \"Adicionar à Tela de Início\""),
      visual: (
        <div className="flex items-center justify-center p-3 bg-gray-100 dark:bg-gray-800 rounded-xl">
          <div className="bg-white dark:bg-gray-700 rounded-lg p-2 shadow-sm border border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-md flex items-center justify-center">
                <Plus className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-200">Adicionar à Tela de Início</span>
            </div>
          </div>
        </div>
      )
    },
    {
      step: 3,
      icon: CheckCircle2,
      title: t("install.ios.step3.title", "Confirme a instalação"),
      description: t("install.ios.step3.description", "Toque em \"Adicionar\" no canto superior direito da tela"),
      visual: (
        <div className="flex items-center justify-center p-3 bg-gray-100 dark:bg-gray-800 rounded-xl">
          <div className="bg-white dark:bg-gray-700 rounded-lg px-3 py-1.5 shadow-sm border border-gray-200 dark:border-gray-600">
            <span className="text-sm font-semibold text-blue-500">Adicionar</span>
          </div>
        </div>
      )
    },
    {
      step: 4,
      icon: Smartphone,
      title: t("install.ios.step4.title", "Pronto!"),
      description: t("install.ios.step4.description", "O ícone do Luna aparecerá na sua tela inicial. Toque nele para abrir o app!"),
      visual: (
        <div className="flex items-center justify-center p-3 bg-gray-100 dark:bg-gray-800 rounded-xl">
          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 bg-gradient-to-br from-luna-pink to-luna-purple rounded-xl flex items-center justify-center shadow-lg">
              <img src="/logo-luna.png" alt="Luna" className="w-8 h-8 object-contain" />
            </div>
            <span className="text-[10px] text-gray-600 dark:text-gray-300 font-medium">Luna</span>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-luna-pink/5 to-luna-purple/5 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-6 md:p-8 space-y-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-luna-pink to-luna-purple rounded-3xl flex items-center justify-center shadow-lg">
              <Smartphone className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-luna-pink via-luna-purple to-luna-orange bg-clip-text text-transparent">
            {t("install.title", "Instale o Luna")}
          </h1>
          
          <p className="text-muted-foreground text-base md:text-lg">
            {t("install.subtitle", "Tenha acesso rápido ao Luna diretamente da tela inicial do seu celular")}
          </p>
        </div>

        {/* Benefits */}
        <div className="grid gap-3">
          <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-luna-green mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-sm">{t("install.benefit1.title", "Acesso Instantâneo")}</h3>
              <p className="text-xs text-muted-foreground">
                {t("install.benefit1.description", "Um toque e você está no app, sem abrir o navegador")}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-luna-green mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-sm">{t("install.benefit2.title", "Funciona Offline")}</h3>
              <p className="text-xs text-muted-foreground">
                {t("install.benefit2.description", "Registre seus dados mesmo sem internet")}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-luna-green mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-sm">{t("install.benefit3.title", "Privacidade Total")}</h3>
              <p className="text-xs text-muted-foreground">
                {t("install.benefit3.description", "Seus dados ficam seguros no seu dispositivo")}
              </p>
            </div>
          </div>
        </div>

        {isInstalled ? (
          <div className="text-center space-y-4">
            <div className="p-4 bg-luna-green/10 border border-luna-green/20 rounded-lg">
              <p className="text-luna-green font-semibold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                {t("install.installed", "Luna já está instalado!")}
              </p>
            </div>
            <Button 
              onClick={() => navigate('/dashboard')}
              className="w-full bg-gradient-luna hover:opacity-90"
              size="lg"
            >
              {t("install.goToDashboard", "Ir para o Dashboard")}
            </Button>
          </div>
        ) : isIOS ? (
          <div className="space-y-4">
            {/* iOS Safari Notice */}
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300 text-center font-medium">
                📱 {t("install.ios.notice", "Siga os passos abaixo no Safari")}
              </p>
            </div>

            {/* Visual Step-by-Step Instructions */}
            <div className="space-y-3">
              {iosSteps.map((step) => (
                <div 
                  key={step.step}
                  className="flex items-center gap-4 p-4 bg-muted/30 border border-border/50 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  {/* Step Number */}
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-luna-pink to-luna-purple rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {step.step}
                  </div>
                  
                  {/* Visual Illustration */}
                  <div className="flex-shrink-0">
                    {step.visual}
                  </div>
                  
                  {/* Text Instructions */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-foreground">{step.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tip */}
            <div className="text-center pt-2">
              <p className="text-xs text-muted-foreground">
                💡 {t("install.ios.tip", "Dica: Certifique-se de estar usando o Safari, não Chrome ou outro navegador")}
              </p>
            </div>

            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="w-full"
              size="lg"
            >
              {t("install.backHome", "Voltar ao Início")}
            </Button>
          </div>
        ) : deferredPrompt ? (
          <div className="space-y-3">
            <Button 
              onClick={handleInstall}
              className="w-full bg-gradient-luna hover:opacity-90"
              size="lg"
            >
              <Download className="w-5 h-5 mr-2" />
              {t("install.installNow", "Instalar Agora")}
            </Button>
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="w-full"
              size="lg"
            >
              {t("install.maybeLater", "Talvez Mais Tarde")}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                {t("install.unsupported", "Para instalar, abra este site no navegador Chrome ou Edge do seu Android, ou Safari no iPhone/iPad")}
              </p>
            </div>
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="w-full"
              size="lg"
            >
              {t("install.backHome", "Voltar ao Início")}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Install;