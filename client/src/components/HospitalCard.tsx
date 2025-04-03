import { useLanguage } from "@/context/LanguageContext";
import type { Hospital } from "@shared/schema";

interface HospitalCardProps {
  hospital: Hospital;
  distance?: number; // Distance in km if available
  onClick?: () => void;
}

export default function HospitalCard({ hospital, distance, onClick }: HospitalCardProps) {
  const { t } = useLanguage();
  
  return (
    <div 
      className="border border-slate-200 rounded-md p-3 hover:border-primary-300 hover:bg-slate-50 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <h4 className="font-medium text-slate-900">{hospital.name}</h4>
      <p className="text-sm text-slate-600 mt-1">
        {hospital.city}, {hospital.state}
        {distance !== undefined && ` - ${distance.toFixed(1)} km ${t("away", "away")}`}
      </p>
      <div className="flex items-center mt-2">
        {hospital.emergencyServices && (
          <div className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full mr-2">
            {t("emergency247", "24/7 Emergency")}
          </div>
        )}
        <div className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
          {hospital.type}
        </div>
      </div>
    </div>
  );
}
