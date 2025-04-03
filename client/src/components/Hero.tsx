import { Link } from "wouter";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";

export default function Hero() {
  const { t } = useLanguage();
  
  return (
    <section className="relative bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-5xl">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              {t("heroTitle", "AI-Powered Healthcare for Rural Communities")}
            </h1>
            <p className="text-lg text-primary-100 max-w-lg">
              {t("heroDescription", "Access essential healthcare services tailored for rural needs, even when offline. Your health companion, wherever you are.")}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/symptom-checker">
                <a className="inline-flex items-center justify-center rounded-md font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 bg-white text-primary-700 hover:bg-primary-50 h-11 px-6 py-3 shadow-sm">
                  {t("checkSymptoms", "Check Symptoms")}
                </a>
              </Link>
              <Link href="/hospital-finder">
                <a className="inline-flex items-center justify-center rounded-md font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 bg-primary-700 text-white hover:bg-primary-800 border border-primary-500 h-11 px-6 py-3">
                  {t("findHospitals", "Find Hospitals")}
                </a>
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
