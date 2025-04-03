import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLanguage } from "@/context/LanguageContext";
import { useOffline } from "@/context/OfflineContext";
import { useAuth } from "@/hooks/use-auth";
import { dietPlans as localDietPlans } from "@/data/dietPlans";
import { diets } from "@/data/diets";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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

// Define diet types
const dietTypes = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "non-vegetarian", label: "Non-Vegetarian" },
  { id: "vegan", label: "Vegan" },
];

// Define common allergies
const commonAllergies = [
  { id: "dairy", label: "Dairy" },
  { id: "gluten", label: "Gluten" },
  { id: "nuts", label: "Nuts" },
  { id: "soy", label: "Soy" },
  { id: "seafood", label: "Seafood" },
  { id: "eggs", label: "Eggs" },
];

// Form schema for personalized diet plan
const dietFormSchema = z.object({
  region: z.string().min(1, "Please select your region"),
  dietType: z.enum(["vegetarian", "non-vegetarian", "vegan"]),
  healthCondition: z.array(z.string()).min(1, "Select at least one health condition"),
  allergies: z.array(z.string()).optional(),
  age: z.string().min(1, "Age is required"),
  weight: z.string().min(1, "Weight is required"),
  height: z.string().min(1, "Height is required"),
  activityLevel: z.enum(["sedentary", "light", "moderate", "active", "very-active"]),
  foodPreferences: z.string().optional(),
  additionalInfo: z.string().optional(),
});

type DietFormValues = z.infer<typeof dietFormSchema>;

export default function DietPlans() {
  const { t } = useLanguage();
  const { isOffline, getOfflineData, saveOfflineData } = useOffline();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [selectedCondition, setSelectedCondition] = useState("All Conditions");
  const [filteredDietPlans, setFilteredDietPlans] = useState<DietPlan[]>([]);
  const [personalizedDialogOpen, setPersonalizedDialogOpen] = useState(false);
  const [aiRecommendedPlan, setAiRecommendedPlan] = useState<DietPlan | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  // Fetch diet plans from API when online
  const { data: apiDietPlans, isLoading } = useQuery({
    queryKey: ['/api/diet-plans'],
    enabled: !isOffline
  });

  // Setup form with validation
  const form = useForm<DietFormValues>({
    resolver: zodResolver(dietFormSchema),
    defaultValues: {
      region: user?.region || "North India",
      dietType: "vegetarian",
      healthCondition: [],
      allergies: [],
      age: "",
      weight: "",
      height: "",
      activityLevel: "moderate",
      foodPreferences: "",
      additionalInfo: "",
    },
  });

  // Generate personalized diet plan mutation
  const generatePlanMutation = useMutation({
    mutationFn: async (formData: DietFormValues) => {
      // In a real implementation, this would call an AI service via the backend
      // For now, we'll simulate the AI response with a logic to select the best fitting diet plan
      
      // Set loading state
      setIsGeneratingPlan(true);
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Derive plan based on form data (in production, this would be an AI recommendation)
        // This is a simplified logic to demonstrate functionality
        let matchingDiets = diets.filter(
          diet => diet.region.includes(formData.region.toLowerCase().split(' ')[0]) && 
                 diet.type === formData.dietType
        );
        
        // If no exact match, take any diet from the region
        if (matchingDiets.length === 0) {
          matchingDiets = diets.filter(
            diet => diet.region.includes(formData.region.toLowerCase().split(' ')[0])
          );
        }
        
        // If still no match, take any diet
        if (matchingDiets.length === 0) {
          matchingDiets = [diets[0]];
        }
        
        // Find diet that accommodates allergies if possible
        const allergySafe = matchingDiets.filter(diet => 
          !formData.allergies?.some(allergy => 
            !diet.accommodatesAllergies.includes(allergy))
        );
        
        // Find diet suitable for selected health conditions if possible
        let selectedDiet = allergySafe.length > 0 ? allergySafe[0] : matchingDiets[0];
        
        if (formData.healthCondition.length > 0) {
          const conditionMatch = allergySafe.filter(diet => 
            formData.healthCondition.some(condition => 
              diet.suitableForConditions.includes(condition.toLowerCase()))
          );
          
          if (conditionMatch.length > 0) {
            selectedDiet = conditionMatch[0];
          }
        }
        
        // Create synthetic AI-generated diet plan based on selected diet
        const plan: DietPlan = {
          id: 999,
          name: `Personalized ${selectedDiet.nameKey} Plan`,
          description: `A customized diet plan based on ${selectedDiet.descriptionKey} tailored for your specific needs and health conditions.`,
          forCondition: formData.healthCondition,
          region: formData.region,
          items: [
            `Breakfast: ${t(selectedDiet.sampleMeals.breakfast)}`,
            `Lunch: ${t(selectedDiet.sampleMeals.lunch)}`,
            `Dinner: ${t(selectedDiet.sampleMeals.dinner)}`,
            `Snacks: ${t(selectedDiet.sampleMeals.snacks)}`
          ],
          nutrients: {
            calories: `${1800 + (formData.activityLevel === "active" ? 300 : 0) + (formData.activityLevel === "very-active" ? 500 : 0)}`,
            carbohydrates: "50-55%",
            proteins: "20-25%",
            fats: "20-30%"
          },
          restrictions: selectedDiet.foodsToAvoid.map(item => t(item))
        };
        
        return plan;
      } finally {
        setIsGeneratingPlan(false);
      }
    },
    onSuccess: (data) => {
      setAiRecommendedPlan(data);
      toast({
        title: t("dietPlanGenerated", "Personalized Diet Plan Generated"),
        description: t("dietPlanGeneratedDesc", "Your personalized diet plan is ready."),
      });
    },
    onError: (error) => {
      toast({
        title: t("errorGeneratingDietPlan", "Error Generating Diet Plan"),
        description: error.toString(),
        variant: "destructive",
      });
    }
  });

  // Handle form submission
  const onPersonalizedSubmit = (data: DietFormValues) => {
    generatePlanMutation.mutate(data);
  };

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

      <div className="grid gap-6 sm:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>{t("browseDietPlans", "Browse Diet Plans")}</CardTitle>
            <CardDescription>
              {t("browseDietPlansDescription", "Explore diet plans filtered by region and health condition.")}
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
              }} variant="outline">
                {t("resetFilters", "Reset Filters")}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("aiPersonalizedDietPlan", "AI Personalized Diet Plan")}</CardTitle>
            <CardDescription>
              {t("aiPersonalizedDietPlanDescription", "Get a tailored diet plan that considers your specific health needs, allergies, and lifestyle.")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-6">
              {t("dietPlanAIExplanation", "Our AI system analyzes your health profile, regional preferences, and dietary restrictions to create a personalized nutrition plan optimized for your wellbeing.")}
            </p>
            
            <Dialog open={personalizedDialogOpen} onOpenChange={setPersonalizedDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  {t("createPersonalizedPlan", "Create Personalized Plan")}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{t("personalizedDietPlanForm", "Personalized Diet Plan")}</DialogTitle>
                  <DialogDescription>
                    {t("personalizedDietPlanFormDescription", "Fill out the form below to get a diet plan tailored to your specific needs.")}
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onPersonalizedSubmit)} className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="region"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("region", "Region")}</FormLabel>
                            <Select 
                              value={field.value} 
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={t("selectRegion", "Select Your Region")} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {regions.filter(r => r !== "All Regions").map((region) => (
                                  <SelectItem key={region} value={region}>
                                    {region}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="dietType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("dietType", "Diet Type")}</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                              >
                                {dietTypes.map((type) => (
                                  <FormItem key={type.id} className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value={type.id} />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {t(type.id, type.label)}
                                    </FormLabel>
                                  </FormItem>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid gap-4 sm:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("age", "Age")}</FormLabel>
                            <FormControl>
                              <Input type="number" min="1" max="120" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("weight", "Weight (kg)")}</FormLabel>
                            <FormControl>
                              <Input type="number" min="1" max="300" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="height"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("height", "Height (cm)")}</FormLabel>
                            <FormControl>
                              <Input type="number" min="50" max="250" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="activityLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("activityLevel", "Activity Level")}</FormLabel>
                          <Select 
                            value={field.value} 
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t("selectActivity", "Select Activity Level")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="sedentary">{t("sedentary", "Sedentary (little to no exercise)")}</SelectItem>
                              <SelectItem value="light">{t("lightActivity", "Light (exercise 1-3 days/week)")}</SelectItem>
                              <SelectItem value="moderate">{t("moderateActivity", "Moderate (exercise 3-5 days/week)")}</SelectItem>
                              <SelectItem value="active">{t("activeLifestyle", "Active (exercise 6-7 days/week)")}</SelectItem>
                              <SelectItem value="very-active">{t("veryActive", "Very Active (intense exercise daily)")}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="healthCondition"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel>{t("healthConditions", "Health Conditions")}</FormLabel>
                            <FormDescription>
                              {t("selectAllThatApply", "Select all that apply")}
                            </FormDescription>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {healthConditions.filter(c => c !== "All Conditions").map((condition) => (
                              <FormItem 
                                key={condition} 
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox 
                                    checked={form.watch("healthCondition").includes(condition)}
                                    onCheckedChange={(checked) => {
                                      const current = form.getValues("healthCondition");
                                      if (checked) {
                                        form.setValue("healthCondition", [...current, condition]);
                                      } else {
                                        form.setValue(
                                          "healthCondition", 
                                          current.filter((value) => value !== condition)
                                        );
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {condition}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="allergies"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel>{t("allergies", "Allergies")}</FormLabel>
                            <FormDescription>
                              {t("selectAllergies", "Select any allergies you have")}
                            </FormDescription>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {commonAllergies.map((allergy) => (
                              <FormItem 
                                key={allergy.id} 
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox 
                                    checked={form.watch("allergies")?.includes(allergy.id)}
                                    onCheckedChange={(checked) => {
                                      const current = form.getValues("allergies") || [];
                                      if (checked) {
                                        form.setValue("allergies", [...current, allergy.id]);
                                      } else {
                                        form.setValue(
                                          "allergies", 
                                          current.filter((value) => value !== allergy.id)
                                        );
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {t(allergy.id, allergy.label)}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="foodPreferences"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("foodPreferences", "Food Preferences")}</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder={t("foodPreferencesPlaceholder", "List any specific foods you like or dislike")}
                              rows={3}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="additionalInfo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("additionalInfo", "Additional Information")}</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder={t("additionalInfoPlaceholder", "Any other relevant information about your diet or lifestyle")}
                              rows={3}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <Button type="submit" disabled={isGeneratingPlan}>
                        {isGeneratingPlan ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                            {t("generating", "Generating...")}
                          </>
                        ) : (
                          t("generateDietPlan", "Generate Diet Plan")
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommended Plan Display */}
      {aiRecommendedPlan && (
        <Card className="mb-8 border-2 border-primary-100 bg-gradient-to-r from-primary-50 to-transparent">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <Badge variant="outline" className="mb-2 bg-primary-100 text-primary-800">
                  {t("aiRecommended", "AI Recommended")}
                </Badge>
                <CardTitle>{aiRecommendedPlan.name}</CardTitle>
                <CardDescription className="mt-1">
                  {aiRecommendedPlan.description}
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-blue-50">
                  {aiRecommendedPlan.region}
                </Badge>
                {(aiRecommendedPlan.forCondition as string[]).map((condition, idx) => (
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
                  {(aiRecommendedPlan.items as string[]).map((item, idx) => (
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
                {aiRecommendedPlan.nutrients ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {Object.entries(aiRecommendedPlan.nutrients as Record<string, string | number>).map(([key, value]) => (
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
                {aiRecommendedPlan.restrictions && (aiRecommendedPlan.restrictions as string[]).length > 0 ? (
                  <ul className="space-y-1 list-disc list-inside text-slate-700">
                    {(aiRecommendedPlan.restrictions as string[]).map((restriction, idx) => (
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
          <CardFooter className="border-t pt-4 flex justify-between">
            <p className="text-xs text-slate-500">
              {t("dietPlanDisclaimer", "This diet plan is a general recommendation. Consult with a healthcare professional before making significant changes to your diet.")}
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setAiRecommendedPlan(null)}
            >
              {t("close", "Close")}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Diet Plans List */}
      <h2 className="text-2xl font-bold text-slate-900 mb-6">{t("availableDietPlans", "Available Diet Plans")}</h2>

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

      <Separator className="my-8" />
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">{t("nutritionalEducation", "Nutritional Education")}</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{t("understandingMacros", "Understanding Macronutrients")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                {t("macronutrientsDesc", "Proteins, carbohydrates, and fats are the three main macronutrients your body needs in larger quantities for energy and body functions.")}
              </p>
              <ul className="space-y-2 text-sm text-slate-700">
                <li><span className="font-semibold">Proteins:</span> {t("proteinsDesc", "Essential for muscle building, tissue repair, and enzyme production.")}</li>
                <li><span className="font-semibold">Carbohydrates:</span> {t("carbsDesc", "Primary energy source for your body, especially your brain and muscles.")}</li>
                <li><span className="font-semibold">Fats:</span> {t("fatsDesc", "Important for hormone production, cell health, and absorbing fat-soluble vitamins.")}</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{t("micronutrients", "Essential Micronutrients")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                {t("micronutrientsDesc", "Vitamins and minerals are needed in smaller amounts but are vital for health, immunity, and preventing diseases.")}
              </p>
              <ul className="space-y-2 text-sm text-slate-700">
                <li><span className="font-semibold">{t("commonDeficiencies", "Common Deficiencies")}:</span> {t("deficienciesDesc", "Iron, Vitamin D, Vitamin B12, and Calcium are commonly deficient in Indian diets.")}</li>
                <li><span className="font-semibold">{t("foodSources", "Food Sources")}:</span> {t("foodSourcesDesc", "Eat a rainbow of fruits and vegetables to ensure diverse micronutrient intake.")}</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{t("calorieBalance", "Calorie Balance")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                {t("calorieBalanceDesc", "Weight management is about energy balance: calories consumed vs. calories burned through metabolism and physical activity.")}
              </p>
              <div className="text-sm text-slate-700 space-y-2">
                <p><span className="font-semibold">{t("weightLoss", "Weight Loss")}:</span> {t("weightLossDesc", "Create a moderate calorie deficit through diet and increased activity.")}</p>
                <p><span className="font-semibold">{t("weightGain", "Weight Gain")}:</span> {t("weightGainDesc", "Consume more calories than you burn, focusing on nutrient-dense foods.")}</p>
                <p><span className="font-semibold">{t("maintenance", "Maintenance")}:</span> {t("maintenanceDesc", "Balance intake with expenditure to maintain current weight.")}</p>
              </div>
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
