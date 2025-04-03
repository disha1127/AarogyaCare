import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/context/LanguageContext";
import { useOffline } from "@/context/OfflineContext";
import { dietPlans as localDietPlans } from "@/data/dietPlans";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { DietPlan } from "@shared/schema";

// Define India regions for the region selector
const regions = [
  "All Regions",
  "North India",
  "South India",
  "East India",
  "West India",
  "Central India",
  "Northeast India"
];

// Define health conditions for the condition selector
const healthConditions = [
  "All Conditions",
  "Diabetes",
  "Hypertension",
  "Heart Disease",
  "Anemia",
  "Obesity",
  "Malnutrition",
  "Pregnancy"
];

export default function DietPlans() {
  const { t } = useLanguage();
  const { isOffline, getOfflineData, saveOfflineData } = useOffline();
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [selectedCondition, setSelectedCondition] = useState("All Conditions");
  const [filteredDietPlans, setFilteredDietPlans] = useState<DietPlan[]>([]);

  // Fetch diet plans from API when online
  const { data: apiDietPlans, isLoading } = useQuery({
    queryKey: ['/api/diet-plans'],
    enabled: !isOffline
  });

  // If offline, use cached diet plans or fallback to local data
  useEffect(() => {
    const fetchOfflineDietPlans = async () => {
      if (isOffline) {
        const offlineData = await getOfflineData<DietPlan[]>('dietPlans');
        if (offlineData && offlineData.length > 0) {
          setFilteredDietPlans(offlineData);
        } else {
          setFilteredDietPlans(localDietPlans);
        }
      }
    };

    fetchOfflineDietPlans();
  }, [isOffline, getOfflineData]);

  // When online, update filtered diet plans based on API data
  useEffect(() => {
    if (!isOffline && apiDietPlans) {
      setFilteredDietPlans(apiDietPlans);
      // Cache diet plans for offline use
      saveOfflineData('dietPlans', apiDietPlans);
    }
  }, [isOffline, apiDietPlans, saveOfflineData]);

  // Apply filters whenever region or condition changes
  useEffect(() => {
    const dietPlans = !isOffline && apiDietPlans ? apiDietPlans : (isOffline ? localDietPlans : []);
    
    let filtered = [...dietPlans];
    
    // Apply region filter
    if (selectedRegion !== "All Regions") {
      filtered = filtered.filter(
        dietPlan => dietPlan.region === selectedRegion
      );
    }
    
    // Apply condition filter
    if (selectedCondition !== "All Conditions") {
      filtered = filtered.filter(
        dietPlan => (dietPlan.forCondition as string[]).includes(selectedCondition)
      );
    }
    
    setFilteredDietPlans(filtered);
  }, [selectedRegion, selectedCondition, apiDietPlans, isOffline]);

  return (
    <div className="container mx-auto max-w-7xl py-12 px-4 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{t("dietPlans", "Diet Plans")}</h1>
        <p className="text-slate-600 max-w-3xl">
          {t("dietPlansDescription", "Get personalized diet recommendations based on your region, allergies, and health conditions. These plans are designed to be nutritious and use locally available ingredients.")}
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{t("personalizedDietPlan", "Get Your Personalized Diet Plan")}</CardTitle>
          <CardDescription>
            {t("personalizedDietPlanDescription", "Select your region and health condition to find diet plans tailored for you.")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                {t("selectRegion", "Select Your Region")}
              </label>
              <Select
                value={selectedRegion}
                onValueChange={setSelectedRegion}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("selectRegion", "Select Your Region")} />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                {t("selectHealthCondition", "Select Health Condition")}
              </label>
              <Select
                value={selectedCondition}
                onValueChange={setSelectedCondition}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("selectHealthCondition", "Select Health Condition")} />
                </SelectTrigger>
                <SelectContent>
                  {healthConditions.map((condition) => (
                    <SelectItem key={condition} value={condition}>
                      {condition}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={() => {
              setSelectedRegion("All Regions");
              setSelectedCondition("All Conditions");
            }}>
              {t("resetFilters", "Reset Filters")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto mb-3"></div>
          <p className="text-slate-500">{t("loading", "Loading...")}</p>
        </div>
      ) : filteredDietPlans.length > 0 ? (
        <div className="space-y-8">
          {filteredDietPlans.map((dietPlan) => (
            <Card key={dietPlan.id}>
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <CardTitle>{dietPlan.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {dietPlan.description}
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-blue-50">
                      {dietPlan.region}
                    </Badge>
                    {(dietPlan.forCondition as string[]).map((condition, idx) => (
                      <Badge key={idx} variant="secondary">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="meals">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="meals">{t("mealPlan", "Meal Plan")}</TabsTrigger>
                    <TabsTrigger value="nutrients">{t("nutrients", "Nutrients")}</TabsTrigger>
                    <TabsTrigger value="restrictions">{t("restrictions", "Restrictions")}</TabsTrigger>
                  </TabsList>
                  <TabsContent value="meals" className="mt-4 space-y-4">
                    <ul className="space-y-2">
                      {(dietPlan.items as string[]).map((item, idx) => (
                        <li key={idx} className="text-slate-700 flex items-start">
                          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary-800 text-xs font-medium mr-2 flex-shrink-0">
                            {idx + 1}
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </TabsContent>
                  <TabsContent value="nutrients" className="mt-4">
                    {dietPlan.nutrients ? (
                      <div className="grid gap-4 sm:grid-cols-2">
                        {Object.entries(dietPlan.nutrients as Record<string, string | number>).map(([key, value]) => (
                          <div key={key} className="flex justify-between border-b border-slate-100 pb-2">
                            <span className="text-slate-600 capitalize">{key}</span>
                            <span className="font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500 italic">
                        {t("nutrientsNotAvailable", "Detailed nutrient information not available for this diet plan.")}
                      </p>
                    )}
                  </TabsContent>
                  <TabsContent value="restrictions" className="mt-4">
                    {dietPlan.restrictions && (dietPlan.restrictions as string[]).length > 0 ? (
                      <ul className="space-y-1 list-disc list-inside text-slate-700">
                        {(dietPlan.restrictions as string[]).map((restriction, idx) => (
                          <li key={idx}>{restriction}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-slate-500 italic">
                        {t("noRestrictions", "No specific dietary restrictions for this plan.")}
                      </p>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-slate-900">{t("noDietPlansFound", "No Diet Plans Found")}</h3>
          <p className="mt-1 text-sm text-slate-500">{t("tryDifferentFilters", "Try selecting different region or health condition.")}</p>
        </div>
      )}

      <Separator className="my-8" />

      <div className="mt-8 space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">{t("dietaryTips", "General Dietary Tips")}</h2>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{t("stayHydrated", "Stay Hydrated")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                {t("stayHydratedDesc", "Drink at least 8-10 glasses of water daily. Include fluids like buttermilk, coconut water, and herbal teas in your diet.")}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{t("eatLocalSeasonal", "Eat Local & Seasonal")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                {t("eatLocalSeasonalDesc", "Locally grown seasonal fruits and vegetables are more nutritious, affordable, and environmentally sustainable.")}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{t("balancedMeals", "Balanced Meals")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                {t("balancedMealsDesc", "Include proteins, complex carbohydrates, healthy fats, and fiber in your meals. Fill half your plate with vegetables and fruits.")}
              </p>
            </CardContent>
          </Card>
        </div>
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
                {t("offlineDietPlansInfo", "You're viewing cached diet plans available offline. Connect to the internet for personalized recommendations.")}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
