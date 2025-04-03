import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import MobileNavigation from "./MobileNavigation";
import OfflineIndicator from "./OfflineIndicator";
import LanguageSwitcher from "./LanguageSwitcher";
import SOSButton from "./SOSButton";
import { useOffline } from "@/context/OfflineContext";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isOffline } = useOffline();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {isOffline && <OfflineIndicator />}
      <LanguageSwitcher />
      <Header />
      <main className="flex-grow">{children}</main>
      <SOSButton />
      <MobileNavigation />
      <Footer />
    </div>
  );
}
