import { Link } from "wouter";
import { useLanguage } from "@/context/LanguageContext";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  linkText: string;
  linkHref: string;
}

export default function FeatureCard({ icon, title, description, linkText, linkHref }: FeatureCardProps) {
  const { t } = useLanguage();
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
          <i className={`${icon} text-primary-600 text-xl`}></i>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-600 mb-4">{description}</p>
        <Link href={linkHref}>
          <a className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center">
            {linkText}
            <svg className="ml-1 w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path 
                fillRule="evenodd" 
                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" 
                clipRule="evenodd" 
              />
            </svg>
          </a>
        </Link>
      </div>
    </div>
  );
}
