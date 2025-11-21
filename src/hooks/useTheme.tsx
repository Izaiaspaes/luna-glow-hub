import { useEffect } from "react";
import { useProfile } from "./useProfile";

const themeStyles = {
  default: {
    "--primary": "330 70% 65%",
    "--primary-foreground": "0 0% 100%",
    "--accent": "320 60% 90%",
    "--accent-foreground": "330 70% 40%",
  },
  sunset: {
    "--primary": "30 90% 60%",
    "--primary-foreground": "0 0% 100%",
    "--accent": "40 85% 85%",
    "--accent-foreground": "25 85% 40%",
  },
  ocean: {
    "--primary": "200 85% 55%",
    "--primary-foreground": "0 0% 100%",
    "--accent": "195 75% 90%",
    "--accent-foreground": "205 85% 35%",
  },
  forest: {
    "--primary": "145 70% 45%",
    "--primary-foreground": "0 0% 100%",
    "--accent": "140 60% 90%",
    "--accent-foreground": "150 70% 30%",
  },
  lavender: {
    "--primary": "270 65% 65%",
    "--primary-foreground": "0 0% 100%",
    "--accent": "265 55% 90%",
    "--accent-foreground": "275 65% 40%",
  },
  rose: {
    "--primary": "340 75% 65%",
    "--primary-foreground": "0 0% 100%",
    "--accent": "345 65% 90%",
    "--accent-foreground": "340 75% 40%",
  },
};

export function useTheme() {
  const { profile } = useProfile();

  useEffect(() => {
    if (profile?.theme && themeStyles[profile.theme as keyof typeof themeStyles]) {
      const theme = themeStyles[profile.theme as keyof typeof themeStyles];
      const root = document.documentElement;
      
      Object.entries(theme).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    }
  }, [profile?.theme]);

  return {
    currentTheme: profile?.theme || "default",
  };
}
