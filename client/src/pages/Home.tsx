import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useLanguage } from "@/context/LanguageContext";
import { useOffline } from "@/context/OfflineContext";
import Hero from "@/components/Hero";
import FeatureCard from "@/components/FeatureCard";
import ArticleCard from "@/components/ArticleCard";
import SchemeCard from "@/components/SchemeCard";
import HospitalCard from "@/components/HospitalCard";
import DownloadCta from "@/components/DownloadCta";
import { Article, Hospital, Scheme } from "@shared/schema";

export default function Home() {
  const { t } = useLanguage();
  const { isOffline, getOfflineData, saveOfflineData } = useOffline();

  // Fetch articles
  const { data: articles, isLoading: isArticlesLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles'],
    enabled: !isOffline
  });

  // Fetch schemes
  const { data: schemes, isLoading: isSchemesLoading } = useQuery<Scheme[]>({
    queryKey: ['/api/schemes'],
    enabled: !isOffline
  });

  // Fetch hospitals
  const { data: hospitals, isLoading: isHospitalsLoading } = useQuery<Hospital[]>({
    queryKey: ['/api/hospitals'],
    enabled: !isOffline
  });

  // Load offline data if we're offline
  useEffect(() => {
    const loadOfflineData = async () => {
      if (isOffline) {
        // Load offline data from storage
        const offlineArticles = await getOfflineData<Article[]>('articles');
        const offlineSchemes = await getOfflineData<Scheme[]>('schemes');
        const offlineHospitals = await getOfflineData<Hospital[]>('hospitals');
        
        // Here we would update our local state with the offline data
        // This is just a console log for demonstration
        console.log('Loaded offline data:', { offlineArticles, offlineSchemes, offlineHospitals });
      }
    };

    loadOfflineData();
  }, [isOffline, getOfflineData]);

  // Save data for offline use
  useEffect(() => {
    const saveDataForOffline = async () => {
      if (!isOffline && articles && schemes && hospitals) {
        await saveOfflineData('articles', (articles as Article[]).filter((article: Article) => article.isOfflineAvailable));
        await saveOfflineData('schemes', (schemes as Scheme[]).filter((scheme: Scheme) => scheme.isOfflineAvailable));
        await saveOfflineData('hospitals', hospitals as Hospital[]);
      }
    };

    saveDataForOffline();
  }, [isOffline, articles, schemes, hospitals, saveOfflineData]);

  return (
    <div>
      <Hero />
      
      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Features Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">{t("essentialFeatures", "Essential Healthcare Features")}</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard 
                icon="fa-solid fa-stethoscope"
                title={t("symptomChecker", "Symptom Checker")}
                description={t("symptomCheckerDesc", "Check your symptoms and get guidance on potential health conditions using our AI-powered tool.")}
                linkText={t("checkSymptoms", "Check symptoms")}
                linkHref="/symptom-checker"
              />
              
              <FeatureCard 
                icon="fa-solid fa-utensils"
                title={t("dietPlans", "Diet Plans")}
                description={t("dietPlansDesc", "Get personalized diet recommendations based on your region, allergies, and health conditions.")}
                linkText={t("viewDietPlans", "View diet plans")}
                linkHref="/diet-plans"
              />
              
              <FeatureCard 
                icon="fa-solid fa-hospital"
                title={t("hospitalFinder", "Hospital Finder")}
                description={t("hospitalFinderDesc", "Find the nearest hospitals and healthcare centers in your area with interactive maps.")}
                linkText={t("findHospitals", "Find hospitals")}
                linkHref="/hospital-finder"
              />
              
              <FeatureCard 
                icon="fa-solid fa-bell"
                title={t("medicationReminders", "Medication Reminders")}
                description={t("medicationRemindersDesc", "Never miss your medications with personalized reminders and dosage tracking.")}
                linkText={t("setReminders", "Set reminders")}
                linkHref="/medication-reminders"
              />
              
              <FeatureCard 
                icon="fa-solid fa-newspaper"
                title={t("healthArticles", "Health Articles")}
                description={t("healthArticlesDesc", "Stay informed with the latest health articles from WHO and trusted sources.")}
                linkText={t("readArticles", "Read articles")}
                linkHref="/articles"
              />
              
              <FeatureCard 
                icon="fa-solid fa-building-columns"
                title={t("governmentSchemes", "Government Schemes")}
                description={t("governmentSchemesDesc", "Access information about government healthcare schemes and benefits available for rural residents.")}
                linkText={t("viewSchemes", "View schemes")}
                linkHref="/government-schemes"
              />
            </div>
          </section>

          {/* Health Articles Section */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">{t("latestArticles", "Latest Health Articles")}</h2>
              <Link href="/articles" className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center">
                {t("viewAllArticles", "View all articles")}
                <svg className="ml-1 w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            
            {isArticlesLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto mb-3"></div>
                <p className="text-slate-500">{t("loading", "Loading...")}</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {articles?.slice(0, 3).map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </section>

          {/* Hospital Finder Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">{t("nearbyHospitals", "Find Hospitals Near You")}</h2>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
              <div className="mb-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input 
                    type="text" 
                    className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5" 
                    placeholder={t("enterLocation", "Enter your location")} 
                  />
                </div>
              </div>
              <div id="hospital-map" className="h-80 rounded-lg bg-slate-100 relative">
                {/* Map will be rendered in HospitalFinder page */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Link href="/hospital-finder" className="inline-flex items-center justify-center rounded-md font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 bg-primary-600 text-white hover:bg-primary-700 h-11 px-6 py-3">
                    {t("openHospitalFinder", "Open Hospital Finder")}
                  </Link>
                </div>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {isHospitalsLoading ? (
                  <div className="col-span-3 text-center py-4">
                    <p className="text-slate-500">{t("loading", "Loading...")}</p>
                  </div>
                ) : (
                  hospitals?.slice(0, 3).map((hospital) => (
                    <HospitalCard key={hospital.id} hospital={hospital} />
                  ))
                )}
              </div>
            </div>
          </section>

          {/* Government Scheme Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">{t("governmentSchemes", "Government Healthcare Schemes")}</h2>
            {isSchemesLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto mb-3"></div>
                <p className="text-slate-500">{t("loading", "Loading...")}</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {schemes?.slice(0, 4).map((scheme) => (
                  <SchemeCard key={scheme.id} scheme={scheme} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      
      <DownloadCta />
    </div>
  );
}
