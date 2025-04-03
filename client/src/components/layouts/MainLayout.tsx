import React from 'react';
import Header from '../Header';
import Footer from '../Footer';
import OfflineIndicator from '../OfflineIndicator';
import LanguageSwitcher from '../LanguageSwitcher';
import SOSButton from '../SOSButton';
import MobileNavigation from '../MobileNavigation';
import { useLanguage } from '@/providers/LanguageProvider';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <OfflineIndicator />
      <LanguageSwitcher />
      <Header />
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {children}
        </div>
      </main>
      <SOSButton />
      <Footer />
      <MobileNavigation />
    </div>
  );
};

export default MainLayout;
