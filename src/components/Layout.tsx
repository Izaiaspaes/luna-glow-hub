import { ReactNode } from "react";
import { AppNavigation } from "./AppNavigation";
import { CookieConsent } from "./CookieConsent";
import { GlobalFloatingChat } from "./GlobalFloatingChat";

interface LayoutProps {
  children: ReactNode;
  showNavigation?: boolean;
  showChat?: boolean;
}

export const Layout = ({ children, showNavigation = true, showChat = true }: LayoutProps) => {
  return (
    <div className="min-h-screen">
      {showNavigation && <AppNavigation />}
      <main>{children}</main>
      <CookieConsent />
      {showChat && <GlobalFloatingChat />}
    </div>
  );
};
