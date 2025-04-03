import { Link } from "wouter";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect } from "react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { t } = useLanguage();

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed inset-0 bg-slate-900/50 z-40">
      <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-lg p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="text-xl font-semibold text-slate-900">{t("menu", "Menu")}</div>
          <button 
            onClick={onClose} 
            className="text-slate-700 hover:text-slate-900"
          >
            <span className="sr-only">{t("closeMenu", "Close menu")}</span>
            <svg 
              className="h-6 w-6" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col space-y-2">
          <Link href="/">
            <a className="font-medium text-primary-600 py-3 border-b border-slate-100" onClick={onClose}>
              {t("home", "Home")}
            </a>
          </Link>
          <Link href="/articles">
            <a className="font-medium text-slate-800 hover:text-primary-600 py-3 border-b border-slate-100" onClick={onClose}>
              {t("healthArticles", "Health Articles")}
            </a>
          </Link>
          <Link href="/symptom-checker">
            <a className="font-medium text-slate-800 hover:text-primary-600 py-3 border-b border-slate-100" onClick={onClose}>
              {t("symptomChecker", "Symptom Checker")}
            </a>
          </Link>
          <Link href="/diet-plans">
            <a className="font-medium text-slate-800 hover:text-primary-600 py-3 border-b border-slate-100" onClick={onClose}>
              {t("dietPlans", "Diet Plans")}
            </a>
          </Link>
          <Link href="/hospital-finder">
            <a className="font-medium text-slate-800 hover:text-primary-600 py-3 border-b border-slate-100" onClick={onClose}>
              {t("hospitalFinder", "Hospital Finder")}
            </a>
          </Link>
          <Link href="/medication-reminders">
            <a className="font-medium text-slate-800 hover:text-primary-600 py-3 border-b border-slate-100" onClick={onClose}>
              {t("medicationReminders", "Medication Reminders")}
            </a>
          </Link>
          <Link href="/government-schemes">
            <a className="font-medium text-slate-800 hover:text-primary-600 py-3 border-b border-slate-100" onClick={onClose}>
              {t("governmentSchemes", "Government Schemes")}
            </a>
          </Link>
        </nav>
      </div>
    </div>
  );
}
