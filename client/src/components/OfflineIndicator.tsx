import { useOffline } from "@/context/OfflineContext";
import { useLanguage } from "@/context/LanguageContext";

export default function OfflineIndicator() {
  const { isOffline } = useOffline();
  const { t } = useLanguage();
  
  if (!isOffline) return null;
  
  return (
    <div className="fixed top-0 left-0 right-0 bg-amber-500 text-white text-center p-2 z-50">
      <p className="text-sm font-medium">
        {t("offlineMessage", "You are currently offline. Some features may be limited.")}
      </p>
    </div>
  );
}
