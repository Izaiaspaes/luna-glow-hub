"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { DIcons, type ValidIcon } from "dicons";

type TColorProp = string | string[];

interface ShineBorderProps {
  borderRadius?: number;
  borderWidth?: number;
  duration?: number;
  color?: TColorProp;
  className?: string;
  children: React.ReactNode;
}

function ShineBorder({
  borderRadius = 8,
  borderWidth = 1,
  duration = 14,
  color = "#000000",
  className,
  children,
}: ShineBorderProps) {
  return (
    <div
      style={{
        "--border-radius": `${borderRadius}px`,
        "--border-width": `${borderWidth}px`,
        "--shine-pulse-duration": `${duration}s`,
        "--mask-linear-gradient": `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
        "--background-radial-gradient": `radial-gradient(transparent,transparent, ${Array.isArray(color) ? color.join(",") : color},transparent,transparent)`,
      } as React.CSSProperties}
      className={cn(
        "relative grid min-h-[60px] w-fit min-w-[300px] place-items-center rounded-[--border-radius] bg-white p-3 text-black dark:bg-black dark:text-white",
        className
      )}
    >
      <div
        className={cn(
          "before:bg-shine-size before:absolute before:inset-0 before:aspect-square before:size-full before:rounded-[--border-radius] before:p-[--border-width] before:will-change-[background-position] before:content-[''] before:![-webkit-mask-composite:xor] before:![mask-composite:exclude] before:[background-image:--background-radial-gradient] before:[background-size:300%_300%] before:[mask:--mask-linear-gradient] motion-safe:before:animate-[shine-pulse_var(--shine-pulse-duration)_infinite_linear]"
        )}
      />
      {children}
    </div>
  );
}

export function TimelineContainer({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-start md:flex-row">
      {children}
    </div>
  );
}

interface Event {
  label: string;
  message: string;
  icon: {
    name: ValidIcon;
    textColor: string;
    borderColor: string;
  };
}

export function TimelineEvent({
  label,
  message,
  icon,
  isLast = false,
}: Event & {
  isLast?: boolean;
}) {
  const Icon = DIcons[icon.name];
  return (
    <div className="flex flex-row gap-4 pb-8 last:pb-0">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "flex size-10 items-center justify-center rounded-full border-2",
            icon.borderColor
          )}
        >
          <Icon className={cn("size-5", icon.textColor)} />
        </div>
        {!isLast ? (
          <div className="h-full w-px bg-border" />
        ) : null}
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold">{label}</p>
        </div>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

export function Timeline() {
  return (
    <div className="mx-auto max-w-lg">
      <TimelineContainer>
        {timeline.map((event, i) => (
          <TimelineEvent
            key={i}
            {...event}
            isLast={i === timeline.length - 1}
          />
        ))}
      </TimelineContainer>
    </div>
  );
}

const timeline = [
  {
    label: "Choose Your Design",
    message:
      "Browse and select a design that fits your needs, then access your personalized dashboard.",
    icon: {
      name: "Shapes" as ValidIcon,
      textColor: "text-orange-500",
      borderColor: "border-orange-500/40",
    },
  },
  {
    label: "Provide Your Brief",
    message: "Share your design preferences and requirements with us.",
    icon: {
      name: "Send" as ValidIcon,
      textColor: "text-amber-500",
      borderColor: "border-amber-500/40",
    },
  },
  {
    label: "Receive Your Designs",
    message: "Get your initial designs within 48 hours.",
    icon: {
      name: "Check" as ValidIcon,
      textColor: "text-blue-500",
      borderColor: "border-blue-500/40",
    },
  },
  {
    label: "Request Revisions",
    message:
      "We're committed to perfection—request as many revisions as needed until you're satisfied.",
    icon: {
      name: "Repeat" as ValidIcon,
      textColor: "text-green-500",
      borderColor: "border-green-500/40",
    },
  },
  {
    label: "Get Final Files",
    message: "Once approved, we'll deliver the final files to you.",
    icon: {
      name: "Download" as ValidIcon,
      textColor: "text-green-500",
      borderColor: "border-green-500/40",
    },
  },
] satisfies Event[];

export { ShineBorder };
