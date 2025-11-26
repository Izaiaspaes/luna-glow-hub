import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";
import { useProfile } from "@/hooks/useProfile";

export function AppTour() {
  const { t } = useTranslation();
  const { profile, updateProfile } = useProfile();
  const [run, setRun] = useState(false);

  const tourSteps: Step[] = [
    {
      target: "body",
      content: t("tour.welcome"),
      placement: "center",
      disableBeacon: true,
    },
    {
      target: '[data-tour="overview"]',
      content: t("tour.overview"),
      placement: "bottom",
    },
    {
      target: '[data-tour="tracking"]',
      content: t("tour.tracking"),
      placement: "bottom",
    },
    {
      target: '[data-tour="plans"]',
      content: t("tour.plans"),
      placement: "bottom",
    },
    {
      target: '[data-tour="calendar"]',
      content: t("tour.calendar"),
      placement: "bottom",
    },
    {
      target: '[data-tour="settings"]',
      content: t("tour.settings"),
      placement: "bottom",
    },
    {
      target: '[data-tour="avatar"]',
      content: t("tour.avatar"),
      placement: "left",
    },
  ];

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
        back: t("tour.back"),
        close: t("tour.close"),
        last: t("tour.last"),
        next: t("tour.next"),
        skip: t("tour.skip"),
      }}
      callback={handleJoyrideCallback}
    />
  );
}
