import { ReactNode } from "react";
import { AppNavigation } from "./AppNavigation";
import { CookieConsent } from "./CookieConsent";

interface LayoutProps {
  children: ReactNode;
  showNavigation?: boolean;
}

export const Layout = ({ children, showNavigation = true }: LayoutProps) => {
  return (
    <div className="min-h-screen">
      {showNavigation && <AppNavigation />}
      <main>{children}</main>
      <CookieConsent />
    </div>
  );
};
