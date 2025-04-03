import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/context/LanguageContext";
import { useOffline } from "@/context/OfflineContext";
import SchemeCard from "@/components/SchemeCard";
import { schemes as localSchemes } from "@/data/schemes";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Scheme } from "@shared/schema";

// Define scheme categories for the filter
const schemeCategories = [
  "All Categories",
  "Health Insurance",
  "Maternal Health",
  "Affordable Medicines",
  "Eye Care",
  "Child Health",
  "Senior Citizen Care",
  "Disability Support"
];

export default function GovernmentSchemes() {
  const { t } = useLanguage();
  const { isOffline, getOfflineData, saveOfflineData } = useOffline();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [filteredSchemes, setFilteredSchemes] = useState<Scheme[]>([]);

  // Fetch schemes from API when online
  const { data: apiSchemes, isLoading } = useQuery({
    queryKey: ['/api/schemes'],
    enabled: !isOffline
  });

  // If offline, use cached schemes or fallback to local data
  useEffect(() => {
    const fetchOfflineSchemes = async () => {
      if (isOffline) {
        const offlineData = await getOfflineData<Scheme[]>('schemes');
        if (offlineData && offlineData.length > 0) {
          setFilteredSchemes(offlineData);
        } else {
          setFilteredSchemes(localSchemes);
        }
      }
    };

    fetchOfflineSchemes();
  }, [isOffline, getOfflineData]);

  // When online, update filtered schemes based on API data
  useEffect(() => {
    if (!isOffline && apiSchemes) {
      setFilteredSchemes(apiSchemes);
      // Cache schemes for offline use
      saveOfflineData('schemes', apiSchemes.filter((scheme: Scheme) => scheme.isOfflineAvailable));
    }
  }, [isOffline, apiSchemes, saveOfflineData]);

  // Apply filters whenever search or category changes
  useEffect(() => {
    const schemes = !isOffline && apiSchemes ? apiSchemes : (isOffline ? localSchemes : []);
    
    let filtered = [...schemes];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        scheme => 
          scheme.name.toLowerCase().includes(query) || 
          scheme.description.toLowerCase().includes(query) ||
          scheme.category.toLowerCase().includes(query)
      );
    }
    
    // Apply category filter
    if (categoryFilter && categoryFilter !== "All Categories") {
      filtered = filtered.filter(
        scheme => scheme.category === categoryFilter
      );
    }
    
    setFilteredSchemes(filtered);
  }, [searchQuery, categoryFilter, apiSchemes, isOffline]);

  return (
    <div className="container mx-auto max-w-7xl py-12 px-4 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{t("governmentSchemes", "Government Healthcare Schemes")}</h1>
        <p className="text-slate-600 max-w-3xl">
          {t("governmentSchemesDescription", "Access information about government healthcare schemes and benefits available for rural residents. Learn about eligibility criteria, benefits, and application processes.")}
        </p>
      </div>

      <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-5 h-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
            </svg>
          </div>
          <Input
            type="search"
            placeholder={t("searchSchemes", "Search schemes...")}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="min-w-[180px]">
          <Select
            value={categoryFilter}
            onValueChange={setCategoryFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("filterByCategory", "Filter by category")} />
            </SelectTrigger>
            <SelectContent>
              {schemeCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {(searchQuery || categoryFilter !== "All Categories") && (
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchQuery("");
              setCategoryFilter("All Categories");
            }}
          >
            {t("clearFilters", "Clear Filters")}
          </Button>
        )}
      </div>

      <Separator className="my-6" />

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto mb-3"></div>
          <p className="text-slate-500">{t("loading", "Loading...")}</p>
        </div>
      ) : filteredSchemes.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredSchemes.map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-slate-900">{t("noSchemesFound", "No Schemes Found")}</h3>
          <p className="mt-1 text-sm text-slate-500">{t("tryDifferentSearch", "Try changing your search or filter criteria.")}</p>
        </div>
      )}

      <Separator className="my-12" />

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">{t("frequentlyAskedQuestions", "Frequently Asked Questions")}</h2>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>{t("faqEligibility", "How do I check if I'm eligible for a government scheme?")}</AccordionTrigger>
            <AccordionContent>
              <p className="text-slate-600">
                {t("faqEligibilityAnswer", "Eligibility criteria vary for each scheme. You can check the specific requirements on each scheme's details page. Common criteria include BPL (Below Poverty Line) status, annual family income, age, or specific health conditions. You can also visit your nearest government healthcare center, contact an ASHA worker, or use government helplines for assistance.")}
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2">
            <AccordionTrigger>{t("faqDocuments", "What documents are typically required to apply?")}</AccordionTrigger>
            <AccordionContent>
              <p className="text-slate-600">
                {t("faqDocumentsAnswer", "Common documents include: Aadhaar Card, Income Certificate, BPL Card, Residence Proof, Bank Account Details, Recent Passport-size Photographs, and condition-specific medical certificates. For specific schemes, additional documents may be required as mentioned in the scheme details.")}
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3">
            <AccordionTrigger>{t("faqApply", "How do I apply for these schemes?")}</AccordionTrigger>
            <AccordionContent>
              <p className="text-slate-600">
                {t("faqApplyAnswer", "Application processes vary by scheme. Most schemes allow applications through: Online portals (National Health Portal, scheme-specific websites), Common Service Centers (CSCs), Government hospitals and healthcare centers, ASHA workers and Anganwadi centers, or Mobile application camps held periodically in rural areas. Detailed application procedures are mentioned in each scheme's information page.")}
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4">
            <AccordionTrigger>{t("faqHelp", "Where can I get help if I face issues with my application?")}</AccordionTrigger>
            <AccordionContent>
              <p className="text-slate-600">
                {t("faqHelpAnswer", "You can seek assistance from: Local ASHA workers or Anganwadi centers, District health offices, State or national helpline numbers provided for each scheme, Common Service Centers in your village or town, or Government hospitals and healthcare centers. Many schemes also have grievance redressal mechanisms that you can access.")}
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-5">
            <AccordionTrigger>{t("faqBenefits", "How are benefits distributed under these schemes?")}</AccordionTrigger>
            <AccordionContent>
              <p className="text-slate-600">
                {t("faqBenefitsAnswer", "Benefits are distributed in various ways depending on the scheme: Direct Benefit Transfer (DBT) to your linked bank account, Insurance coverage for specified treatments at empaneled hospitals, Free or subsidized services at government healthcare facilities, Medicines at reduced prices from authorized outlets, or Equipment and aids provided directly to beneficiaries. The distribution method is specified in each scheme's details.")}
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {isOffline && (
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <svg className="h-6 w-6 text-amber-500 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-amber-800">
                {t("offlineMode", "Offline Mode")}
              </h3>
              <p className="text-sm text-amber-700 mt-1">
                {t("offlineSchemesInfo", "You're viewing cached scheme information available offline. Connect to the internet for the most up-to-date information.")}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
