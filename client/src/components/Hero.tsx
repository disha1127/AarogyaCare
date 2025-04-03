import { Link } from "wouter";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";

export default function Hero() {
  const { t } = useLanguage();
  
  return (
    <section className="relative bg-gradient-to-r from-primary-700 to-primary-800 text-white py-12 px-4 sm:px-6 lg:px-8">
      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black bg-opacity-30 z-0"></div>
      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              {t("home.heroTitle", "AI-Powered Healthcare for Rural Communities")}
            </h1>
            <p className="text-lg text-white font-medium max-w-lg">
              {t("home.heroDescription", "Access essential healthcare services tailored for rural needs, even when offline. Your health companion, wherever you are.")}
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/symptom-checker" className="inline-flex items-center justify-center rounded-md text-base font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 bg-white text-primary-800 hover:bg-gray-100 h-12 px-6 py-3 shadow-md transition-colors">
                {t("home.checkSymptoms", "Check Symptoms")}
              </Link>
              <Link href="/hospital-finder" className="inline-flex items-center justify-center rounded-md text-base font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 bg-primary-500 text-white hover:bg-primary-600 border-2 border-white h-12 px-6 py-3 shadow-md transition-colors">
                {t("home.findHospitals", "Find Hospitals")}
              </Link>
            </div>
          </motion.div>
          <motion.div 
            className="hidden md:block"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
              alt={t("ruralHealthcareImage", "Rural healthcare")} 
              className="rounded-lg shadow-lg max-w-sm object-cover" 
              width="500" 
              height="350"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
