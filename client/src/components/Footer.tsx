import { Link } from "wouter";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">AROGYA</h3>
            <p className="text-slate-400 mb-4">
              {t("footerDescription", "AI-driven healthcare for rural communities, providing essential services even without internet access.")}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-white">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="#" className="text-slate-400 hover:text-white">
                <i className="fa-brands fa-twitter"></i>
              </a>
              <a href="#" className="text-slate-400 hover:text-white">
                <i className="fa-brands fa-instagram"></i>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-4">{t("quickLinks", "Quick Links")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-slate-400 hover:text-white">{t("common.home", "Home")}</Link>
              </li>
              <li>
                <Link href="/articles" className="text-slate-400 hover:text-white">{t("common.healthArticles", "Health Articles")}</Link>
              </li>
              <li>
                <Link href="/symptom-checker" className="text-slate-400 hover:text-white">{t("common.symptomChecker", "Symptom Checker")}</Link>
              </li>
              <li>
                <Link href="/hospital-finder" className="text-slate-400 hover:text-white">{t("common.hospitalFinder", "Hospital Finder")}</Link>
              </li>
              <li>
                <Link href="/government-schemes" className="text-slate-400 hover:text-white">{t("common.governmentSchemes", "Government Schemes")}</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-4">{t("resources", "Resources")}</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-slate-400 hover:text-white">{t("healthEducation", "Health Education")}</a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white">{t("emergencyContacts", "Emergency Contacts")}</a>
              </li>
              <li>
                <Link href="/diet-plans" className="text-slate-400 hover:text-white">{t("common.dietPlans", "Diet & Nutrition")}</Link>
              </li>
              <li>
                <Link href="/medication-reminders" className="text-slate-400 hover:text-white">{t("common.medicationReminders", "Medication Guide")}</Link>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white">{t("firstAidTips", "First Aid Tips")}</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-4">{t("contact", "Contact")}</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <i className="fa-solid fa-envelope mt-1 mr-2 text-slate-400"></i>
                <span>support@arogya.org</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-phone mt-1 mr-2 text-slate-400"></i>
                <span>+91 1800-XXX-XXXX ({t("tollFree", "Toll Free")})</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-location-dot mt-1 mr-2 text-slate-400"></i>
                <span>{t("ministryAddress", "Ministry of Health and Family Welfare, Government of India")}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-slate-800 text-center text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} AROGYA. {t("copyright", "All rights reserved. A project for rural healthcare access.")}</p>
        </div>
      </div>
    </footer>
  );
}
