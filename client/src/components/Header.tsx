import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/context/LanguageContext";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();
  const [location] = useLocation();

  const isActivePath = (path: string): boolean => {
    return path === "/" ? location === "/" : location.startsWith(path);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="container mx-auto px-4 py-3 sm:px-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-primary-600 text-2xl font-bold flex items-center">
            <i className="fa-solid fa-heartbeat mr-2"></i> AROGYA
          </Link>
        </div>
        
        {/* Mobile menu button */}
        <button 
          onClick={toggleMenu}
          className="md:hidden inline-flex items-center justify-center rounded-md text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 p-2"
        >
          <span className="sr-only">{t("common.openMainMenu", "Open main menu")}</span>
          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 text-sm font-medium">
          <Link href="/" className={`px-3 py-2 ${isActivePath("/") ? "text-primary-600" : "text-slate-700 hover:text-primary-600"}`}>
            {t("common.home", "Home")}
          </Link>
          <Link href="/articles" className={`px-3 py-2 ${isActivePath("/articles") ? "text-primary-600" : "text-slate-700 hover:text-primary-600"}`}>
            {t("common.healthArticles", "Health Articles")}
          </Link>
          <Link href="/symptom-checker" className={`px-3 py-2 ${isActivePath("/symptom-checker") ? "text-primary-600" : "text-slate-700 hover:text-primary-600"}`}>
            {t("common.symptomChecker", "Symptom Checker")}
          </Link>
          <Link href="/diet-plans" className={`px-3 py-2 ${isActivePath("/diet-plans") ? "text-primary-600" : "text-slate-700 hover:text-primary-600"}`}>
            {t("common.dietPlans", "Diet Plans")}
          </Link>
          <Link href="/hospital-finder" className={`px-3 py-2 ${isActivePath("/hospital-finder") ? "text-primary-600" : "text-slate-700 hover:text-primary-600"}`}>
            {t("common.hospitalFinder", "Hospital Finder")}
          </Link>
        </nav>
      </div>
      
      {/* Mobile Menu */}
      <MobileMenu isOpen={isMenuOpen} onClose={toggleMenu} />
    </header>
  );
}
