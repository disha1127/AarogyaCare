import { Link } from "wouter";
import { useLanguage } from "@/context/LanguageContext";
import type { Scheme } from "@shared/schema";

interface SchemeCardProps {
  scheme: Scheme;
}

export default function SchemeCard({ scheme }: SchemeCardProps) {
  const { t } = useLanguage();
  
  // Map category to icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Health Insurance":
        return "fa-solid fa-file-medical";
      case "Maternal Health":
        return "fa-solid fa-baby";
      case "Affordable Medicines":
        return "fa-solid fa-pills";
      case "Eye Care":
        return "fa-solid fa-eye";
      default:
        return "fa-solid fa-notes-medical";
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <i className={`${getCategoryIcon(scheme.category)} text-blue-600`}></i>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{scheme.name}</h3>
            <p className="text-sm text-slate-500">{scheme.category}</p>
          </div>
        </div>
        <p className="text-slate-600 mb-4">{scheme.description}</p>
        <div className="flex items-center justify-between">
          <Link href={`/government-schemes/${scheme.id}`} className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center">
            {t("common.checkEligibility", "Check eligibility")}
            <svg className="ml-1 w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path 
                fillRule="evenodd" 
                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" 
                clipRule="evenodd" 
              />
            </svg>
          </Link>
          {scheme.isOfflineAvailable && (
            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
              {t("availableOffline", "Available offline")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
