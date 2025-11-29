import { useState, useEffect } from "react";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

export function PremiumPlusTour() {
  const { subscriptionStatus, userProfile } = useAuth();
  const { profile, updateProfile } = useProfile();
  const [run, setRun] = useState(false);

  // Check if user has Premium Plus
  const hasPremiumPlus = 
    subscriptionStatus?.product_id === "prod_TVfx4bH4H0okVe" || 
    subscriptionStatus?.product_id === "prod_TVfxAziuEOC4QN" ||
    userProfile?.subscription_plan === "premium_plus" ||
    profile?.subscription_plan === "premium_plus";

  useEffect(() => {
    // Only start tour if user has Premium Plus and hasn't completed it
    if (hasPremiumPlus && profile && !profile.tour_completed) {
      // Wait a bit for the page to render
      const timer = setTimeout(() => {
        setRun(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [hasPremiumPlus, profile]);

  const steps: Step[] = [
    {
      target: "body",
      content: (
        <div className="space-y-3">
          <h2 className="text-xl font-bold bg-gradient-to-r from-luna-purple via-luna-pink to-luna-orange bg-clip-text text-transparent">
            ✨ Bem-vinda ao Premium Plus!
          </h2>
          <p className="text-base">
            Você agora tem acesso a recursos exclusivos potencializados por IA. Vamos conhecer as funcionalidades avançadas?
          </p>
        </div>
      ),
      placement: "center",
      disableBeacon: true,
    },
    {
      target: '[data-tour="premium-plus-tab"]',
      content: (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-luna-purple">Premium Plus</h3>
          <p>
            Clique aqui sempre que quiser acessar seus recursos exclusivos. Vamos explorar cada um deles!
          </p>
        </div>
      ),
      placement: "bottom",
    },
    {
      target: '[data-tour="luna-sense"]',
      content: (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-luna-purple">💬 Luna Sense - Assistente Inteligente</h3>
          <p className="text-sm">
            Sua assistente de IA 24/7 para conversas sobre saúde feminina, rotina e emoções.
          </p>
          <ul className="text-sm space-y-1 ml-4 list-disc">
            <li>Tire dúvidas sobre ciclo, sintomas e nutrição</li>
            <li>Receba sugestões personalizadas de rotina</li>
            <li>A Luna adapta sua personalidade à fase do seu ciclo</li>
          </ul>
        </div>
      ),
      placement: "top",
    },
    {
      target: '[data-tour="womens-journal"]',
      content: (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-luna-pink">🌟 Diário da Mulher com IA</h3>
          <p className="text-sm">
            Escreva livremente sobre seu dia e receba insights poderosos da IA.
          </p>
          <ul className="text-sm space-y-1 ml-4 list-disc">
            <li>Resumo diário personalizado</li>
            <li>Identificação de padrões recorrentes</li>
            <li>Correlações entre humor, sintomas e ciclo</li>
            <li>Histórico completo de entradas e análises</li>
          </ul>
        </div>
      ),
      placement: "top",
    },
    {
      target: '[data-tour="sos-feminino"]',
      content: (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-luna-orange">🆘 SOS Feminino</h3>
          <p className="text-sm">
            Suporte imediato para momentos difíceis com técnicas de relaxamento e frases acolhedoras.
          </p>
          <ul className="text-sm space-y-1 ml-4 list-disc">
            <li>Respostas humanizadas e compassivas</li>
            <li>Técnicas de relaxamento rápido</li>
            <li>Sugestões de autocuidado imediato</li>
            <li>Apoio para dor, estresse, ansiedade e fadiga</li>
          </ul>
        </div>
      ),
      placement: "top",
    },
    {
      target: "body",
      content: (
        <div className="space-y-3">
          <h2 className="text-xl font-bold bg-gradient-to-r from-luna-green via-luna-blue to-luna-purple bg-clip-text text-transparent">
            🎉 Pronta para começar!
          </h2>
          <p className="text-base">
            Explore suas novas funcionalidades e aproveite ao máximo o Premium Plus. A Luna está aqui para te apoiar em cada fase! 💜
          </p>
          <p className="text-sm text-muted-foreground">
            Você pode rever este tour a qualquer momento nas configurações.
          </p>
        </div>
      ),
      placement: "center",
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      // Mark tour as completed
      if (profile) {
        updateProfile({ tour_completed: true });
      }
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      disableScrolling
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: "#8b5cf6",
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: 12,
          padding: 20,
        },
        tooltipContent: {
          padding: "10px 0",
        },
        buttonNext: {
          background: "linear-gradient(to right, #ec4899, #8b5cf6, #f97316)",
          borderRadius: 8,
          padding: "8px 16px",
        },
        buttonBack: {
          color: "#8b5cf6",
          marginRight: 10,
        },
        buttonSkip: {
          color: "#94a3b8",
        },
      }}
      locale={{
        back: "Voltar",
        close: "Fechar",
        last: "Finalizar",
        next: "Próximo",
        skip: "Pular",
      }}
    />
  );
}