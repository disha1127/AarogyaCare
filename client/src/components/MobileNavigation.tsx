import { Link, useLocation } from "wouter";
import { useLanguage } from "@/context/LanguageContext";

export default function MobileNavigation() {
  const [location] = useLocation();
  const { t } = useLanguage();

  const isActivePath = (path: string): boolean => {
    return path === "/" ? location === "/" : location.startsWith(path);
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-20">
      <div className="grid grid-cols-5 gap-1">
        <Link href="/">
          <a className={`flex flex-col items-center justify-center p-2 ${isActivePath("/") ? "text-primary-600" : "text-slate-600"}`}>
            <i className="fa-solid fa-house text-lg"></i>
            <span className="text-xs mt-1">{t("home", "Home")}</span>
          </a>
        </Link>
        <Link href="/symptom-checker">
          <a className={`flex flex-col items-center justify-center p-2 ${isActivePath("/symptom-checker") ? "text-primary-600" : "text-slate-600"}`}>
            <i className="fa-solid fa-stethoscope text-lg"></i>
            <span className="text-xs mt-1">{t("symptoms", "Symptoms")}</span>
          </a>
        </Link>
        <Link href="/articles">
          <a className={`flex flex-col items-center justify-center p-2 ${isActivePath("/articles") ? "text-primary-600" : "text-slate-600"}`}>
            <i className="fa-solid fa-newspaper text-lg"></i>
            <span className="text-xs mt-1">{t("articles", "Articles")}</span>
          </a>
        </Link>
        <Link href="/hospital-finder">
          <a className={`flex flex-col items-center justify-center p-2 ${isActivePath("/hospital-finder") ? "text-primary-600" : "text-slate-600"}`}>
            <i className="fa-solid fa-hospital text-lg"></i>
            <span className="text-xs mt-1">{t("hospitals", "Hospitals")}</span>
          </a>
        </Link>
        <Link href="/medication-reminders">
          <a className={`flex flex-col items-center justify-center p-2 ${isActivePath("/medication-reminders") ? "text-primary-600" : "text-slate-600"}`}>
            <i className="fa-solid fa-bell text-lg"></i>
            <span className="text-xs mt-1">{t("reminders", "Reminders")}</span>
          </a>
        </Link>
      </div>
    </div>
  );
}
