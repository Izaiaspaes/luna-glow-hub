import { useEffect, useState } from "react";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";
import { useProfile } from "@/hooks/useProfile";

const tourSteps: Step[] = [
  {
    target: "body",
    content: "Bem-vinda ao Luna! Vamos fazer um tour rápido para você conhecer as principais funcionalidades. Você pode pular este tour a qualquer momento.",
    placement: "center",
    disableBeacon: true,
  },
  {
    target: '[data-tour="overview"]',
    content: "Aqui você encontra sua visão geral diária: resumo do seu bem-estar, planos ativos e mensagens personalizadas.",
    placement: "bottom",
  },
  {
    target: '[data-tour="tracking"]',
    content: "Na aba de Rastreamento você pode registrar seu ciclo, sono, humor, energia e rotina de trabalho.",
    placement: "bottom",
  },
  {
    target: '[data-tour="plans"]',
    content: "Os Planos de Bem-Estar são gerados pela IA com base nos seus registros, oferecendo recomendações personalizadas.",
    placement: "bottom",
  },
  {
    target: '[data-tour="calendar"]',
    content: "No Calendário você visualiza todos os seus registros e planos de forma organizada.",
    placement: "bottom",
  },
  {
    target: '[data-tour="partner"]',
    content: "Luna a Dois permite compartilhar seu ciclo com seu parceiro(a) de forma segura e educativa.",
    placement: "bottom",
  },
  {
    target: '[data-tour="settings"]',
    content: "Nas Configurações você pode editar seu perfil, dados pessoais do onboarding e preferências de privacidade.",
    placement: "bottom",
  },
  {
    target: '[data-tour="avatar"]',
    content: "Clique no seu avatar para acessar rapidamente suas configurações e fazer logout.",
    placement: "left",
  },
];

export function AppTour() {
  const { profile, updateProfile } = useProfile();
  const [run, setRun] = useState(false);

  useEffect(() => {
    // Show tour only if user hasn't completed it and profile is loaded
    if (profile && !profile.tour_completed) {
      // Small delay to ensure DOM elements are rendered
      const timer = setTimeout(() => {
        setRun(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [profile]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      // Mark tour as completed
      updateProfile({ tour_completed: true });
    }
  };

  if (!profile || profile.tour_completed) {
    return null;
  }

  return (
    <Joyride
      steps={tourSteps}
      run={run}
      continuous
      showSkipButton
      showProgress
      disableScrolling
      styles={{
        options: {
          primaryColor: "hsl(var(--primary))",
          textColor: "hsl(var(--foreground))",
          backgroundColor: "hsl(var(--background))",
          overlayColor: "rgba(0, 0, 0, 0.5)",
          arrowColor: "hsl(var(--background))",
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: "12px",
          padding: "20px",
        },
        buttonNext: {
          backgroundColor: "hsl(var(--primary))",
          borderRadius: "8px",
          padding: "8px 16px",
        },
        buttonBack: {
          color: "hsl(var(--muted-foreground))",
          marginRight: "10px",
        },
        buttonSkip: {
          color: "hsl(var(--muted-foreground))",
        },
      }}
      locale={{
        back: "Voltar",
        close: "Fechar",
        last: "Finalizar",
        next: "Próximo",
        skip: "Pular tour",
      }}
      callback={handleJoyrideCallback}
    />
  );
}
