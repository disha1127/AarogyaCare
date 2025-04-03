import { useLanguage } from "@/context/LanguageContext";
import { useOffline } from "@/context/OfflineContext";
import { useToast } from "@/hooks/use-toast";

export default function DownloadCta() {
  const { t } = useLanguage();
  const { saveOfflineData } = useOffline();
  const { toast } = useToast();
  
  const handleSaveForOffline = async () => {
    try {
      // In a real app, this would fetch and save all required data for offline use
      await saveOfflineData('offlineMode', { enabled: true, savedAt: new Date().toISOString() });
      
      toast({
        title: t("offlineDataSaved", "Offline Data Saved"),
        description: t("offlineDataSavedDescription", "Essential healthcare information has been saved for offline use."),
        variant: "default",
      });
    } catch (error) {
      toast({
        title: t("offlineDataError", "Error Saving Offline Data"),
        description: t("offlineDataErrorDescription", "There was a problem saving data for offline use. Please try again."),
        variant: "destructive",
      });
    }
  };
  
  return (
    <section className="bg-primary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-5xl text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-primary-900 mb-4">
          {t("accessAnytime", "Access Healthcare Anytime, Anywhere")}
        </h2>
        <p className="text-lg text-primary-700 mb-8 max-w-2xl mx-auto">
          {t("downloadDescription", "Download the AROGYA app to get offline access to all features, even without an internet connection.")}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-md font-medium hover:bg-primary-700">
            <i className="fa-solid fa-download mr-2"></i>
            {t("downloadAndroid", "Download for Android")}
          </button>
          <button 
            onClick={handleSaveForOffline}
            className="inline-flex items-center bg-white text-primary-600 border border-primary-600 px-6 py-3 rounded-md font-medium hover:bg-primary-50"
          >
            <i className="fa-solid fa-cloud-arrow-down mr-2"></i>
            {t("saveOffline", "Save for Offline Use")}
          </button>
        </div>
      </div>
    </section>
  );
}
