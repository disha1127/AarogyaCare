import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLanguage } from "@/context/LanguageContext";
import { useOffline } from "@/context/OfflineContext";
import { diets } from "@/data/diets";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import { DietPlan } from "@shared/schema";

const dietFormSchema = z.object({
  region: z.string().min(1, { message: "Please select a region" }),
  dietType: z.string().min(1, { message: "Please select a diet type" }),
  age: z.string().min(1, { message: "Age is required" }),
  weight: z.string().min(1, { message: "Weight is required" }),
  height: z.string().min(1, { message: "Height is required" }),
  activityLevel: z.string().min(1, { message: "Please select activity level" }),
  healthCondition: z.array(z.string()).default([]),
  allergies: z.array(z.string()).default([]),
  foodPreferences: z.array(z.string()).default([]),
  goals: z.string().default("maintenance"),
  pregnantNursing: z.boolean().default(false),
});

export default function DietPlans() {
  const { t } = useLanguage();
  const { isOffline, getOfflineData } = useOffline();
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [selectedCondition, setSelectedCondition] = useState("All Conditions");
  const [filteredDietPlans, setFilteredDietPlans] = useState<DietPlan[]>([]);
  const [personalizedDialogOpen, setPersonalizedDialogOpen] = useState(false);
  const [aiRecommendedPlan, setAiRecommendedPlan] = useState<DietPlan | null>(null);
  const { toast } = useToast();

  // Fetch diet plans from the API
  const { data: apiDietPlans, isLoading } = useQuery({
    queryKey: ['/api/diet-plans'],
    enabled: !isOffline
  });

  const form = useForm<z.infer<typeof dietFormSchema>>({
    resolver: zodResolver(dietFormSchema),
    defaultValues: {
      region: "",
      dietType: "vegetarian",
      age: "",
      weight: "",
      height: "",
      activityLevel: "",
      healthCondition: [],
      allergies: [],
      foodPreferences: [],
      goals: "maintenance",
      pregnantNursing: false,
    },
  });

  const dietTypes = [
    { id: "vegetarian", label: "Vegetarian" },
    { id: "non-vegetarian", label: "Non-vegetarian" },
    { id: "vegan", label: "Vegan" },
  ];

  const allergies = [
    "Dairy",
    "Nuts",
    "Eggs",
    "Wheat",
    "Soy",
    "Shellfish",
    "Fish",
    "Gluten",
  ];

  const foodPreferences = [
    "Low Spice",
    "High Protein",
    "Low Carb",
    "Low Fat",
    "Fresh Produce",
    "Traditional",
    "Modern",
    "Quick & Easy",
  ];

  const userHealthConditions = [
    "All Conditions",
    "Diabetes",
    "Hypertension",
    "Heart Disease",
    "Obesity",
    "Underweight",
    "Kidney Disease",
    "Thyroid Issues",
    "GERD",
    "Pregnancy",
  ];

  // Data for regions
  const regions = [
    "All Regions",
    "North India",
    "South India",
    "East India",
    "West India",
    "Central India",
    "Northeast India",
  ];

  const getRandomMealPlan = (region: string, dietType: string) => {
    const regionalSpecificMeals = {
      "North India": {
        breakfast: ["Stuffed Paratha with Curd", "Aloo Puri", "Chana Masala with Bhatura"],
        lunch: ["Rajma Chawal", "Kadhi Chawal", "Chole Chawal"],
        dinner: ["Dal Makhani with Roti", "Paneer Butter Masala with Naan", "Sarson Da Saag with Roti"],
        snacks: ["Samosa", "Pakora", "Dahi Bhalla"]
      },
      "South India": {
        breakfast: ["Idli with Sambar", "Dosa with Chutney", "Upma"],
        lunch: ["Sambar Rice", "Curd Rice", "Tomato Rice"],
        dinner: ["Rasam with Rice", "Coconut Vegetable Curry with Appam", "Bisi Bele Bath"],
        snacks: ["Vada", "Murukku", "Bonda"]
      },
      "East India": {
        breakfast: ["Luchi with Aloor Dom", "Panta Bhaat with Fish Fry", "Ghugni"],
        lunch: ["Fish Curry with Rice", "Dal with Rice and Fritters", "Machher Jhol with Rice"],
        dinner: ["Mixed Vegetable Curry with Roti", "Shukto with Rice", "Posto with Roti"],
        snacks: ["Muri Mixture", "Nimki", "Shingara"]
      },
      "West India": {
        breakfast: ["Poha", "Thepla", "Misal Pav"],
        lunch: ["Pav Bhaji", "Vada Pav", "Gujrati Thali"],
        dinner: ["Batata Bhaji with Puri", "Vegetable Khichdi", "Bhakri with Pitla"],
        snacks: ["Dhokla", "Khandvi", "Fafda"]
      },
      "Central India": {
        breakfast: ["Poha with Jalebi", "Bedai with Sabji", "Sabudana Khichdi"],
        lunch: ["Dal Bafla", "Bhopali Gosht Korma", "Chakki ki Shaak with Roti"],
        dinner: ["Bhutte Ka Kees", "Kadhi Pakora with Rice", "Palak Puri with Aloo Sabji"],
        snacks: ["Malpua", "Mohanthal", "Khasta Kachori"]
      },
      "Northeast India": {
        breakfast: ["Pitha with Tea", "Chura with Dahi", "Luchi with Curry"],
        lunch: ["Jadoh", "Aloo Pitika with Rice", "Iromba with Rice"],
        dinner: ["Fish Tenga with Rice", "Bamboo Shoot Pork", "Smoked Meat with Rice"],
        snacks: ["Singju", "Black Rice Kheer", "Paknam"]
      }
    };

    const defaultMeals = {
      breakfast: ["Fruit Smoothie", "Oatmeal with Berries", "Whole Grain Toast with Avocado"],
      lunch: ["Quinoa Bowl with Vegetables", "Lentil Soup with Bread", "Mixed Green Salad with Protein"],
      dinner: ["Roasted Vegetables with Brown Rice", "Bean and Vegetable Stew", "Stir-Fry with Tofu"],
      snacks: ["Mixed Nuts", "Fruit Salad", "Yogurt with Granola"]
    };

    const meals = region !== "All Regions" && regionalSpecificMeals[region as keyof typeof regionalSpecificMeals] 
      ? regionalSpecificMeals[region as keyof typeof regionalSpecificMeals] 
      : defaultMeals;
    
    const dietPlan: DietPlan = {
      id: Math.floor(Math.random() * 1000),
      name: `Personalized ${dietType.charAt(0).toUpperCase() + dietType.slice(1)} Diet Plan`,
      description: `A custom ${dietType} diet plan optimized for your health profile and preferences.`,
      region: region === "All Regions" ? "General" : region,
      forCondition: form.getValues("healthCondition"),
      type: dietType as "vegetarian" | "non-vegetarian" | "vegan",
      calories: Math.floor(Math.random() * 500) + 1500,
      items: [
        `Breakfast: ${meals.breakfast[Math.floor(Math.random() * meals.breakfast.length)]}`,
        `Morning Snack: ${meals.snacks[Math.floor(Math.random() * meals.snacks.length)]}`,
        `Lunch: ${meals.lunch[Math.floor(Math.random() * meals.lunch.length)]}`,
        `Evening Snack: ${meals.snacks[Math.floor(Math.random() * meals.snacks.length)]}`,
        `Dinner: ${meals.dinner[Math.floor(Math.random() * meals.dinner.length)]}`,
      ],
      nutrients: {
        protein: `${Math.floor(Math.random() * 30) + 50}g`,
        carbohydrates: `${Math.floor(Math.random() * 50) + 150}g`,
        fat: `${Math.floor(Math.random() * 20) + 40}g`,
        fiber: `${Math.floor(Math.random() * 10) + 20}g`,
        calcium: `${Math.floor(Math.random() * 200) + 800}mg`,
        iron: `${Math.floor(Math.random() * 5) + 10}mg`,
        vitaminA: `${Math.floor(Math.random() * 1000) + 3000}IU`,
        vitaminC: `${Math.floor(Math.random() * 30) + 60}mg`,
      },
      restrictions: form.getValues("allergies"),
      isOfflineAvailable: true,
      createdAt: new Date()
    };

    return dietPlan;
  };

  // Mutation for personalized diet plan
  const personalizedDietMutation = useMutation({
    mutationFn: async (formData: z.infer<typeof dietFormSchema>) => {
      // In a real application, this would be an API call
      // For now, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const plan: DietPlan = getRandomMealPlan(formData.region, formData.dietType);
      
      return plan;
    },
    onSuccess: (data) => {
      setAiRecommendedPlan(data);
      setPersonalizedDialogOpen(false);
      toast({
        title: t("dietPlanCreated", "Diet Plan Created"),
        description: t("dietPlanCreatedDescription", "Your personalized diet plan has been created."),
      });
    },
    onError: (error) => {
      toast({
        title: t("dietPlanCreationFailed", "Diet Plan Creation Failed"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onPersonalizedSubmit = (data: z.infer<typeof dietFormSchema>) => {
    personalizedDietMutation.mutate(data);
  };

  useEffect(() => {
    const fetchOfflineDietPlans = async () => {
      if (isOffline) {
        const offlinePlans = await getOfflineData<DietPlan[]>('diet-plans');
        return offlinePlans || [];
      }
      return [];
    };

    const initializeDietPlans = async () => {
      let dietPlans: DietPlan[] = [];
      
      if (isOffline) {
        const offlinePlans = await fetchOfflineDietPlans();
        dietPlans = offlinePlans || [];
      } else {
        dietPlans = apiDietPlans || [];
      }

      // Apply filters
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
          dietPlan => Array.isArray(dietPlan.forCondition) && dietPlan.forCondition.includes(selectedCondition)
        );
      }
      
      setFilteredDietPlans(filtered);
    };

    initializeDietPlans();
  }, [selectedRegion, selectedCondition, apiDietPlans, isOffline, getOfflineData]);

  return (
    <div className="container mx-auto max-w-7xl py-12 px-4 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{t("dietPlans", "Diet Plans")}</h1>
        <p className="text-slate-600 max-w-3xl">
          {t("dietPlansDescription", "Get personalized diet recommendations based on your region, allergies, and health conditions. These plans are designed to be nutritious and use locally available ingredients.")}
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-12 mb-8">
        <Card className="md:col-span-5 bg-gradient-to-br from-blue-50 to-teal-50 border-blue-100">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-xl text-blue-900">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              {t("browseDietPlans", "Find Diet Plans")}
            </CardTitle>
            <CardDescription className="text-blue-700">
              {t("browseDietPlansDescription", "Filter plans based on your region and health condition")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-blue-800">
                  {t("selectRegion", "Your Region")}
                </label>
                <Select
                  value={selectedRegion}
                  onValueChange={setSelectedRegion}
                >
                  <SelectTrigger className="bg-white border-blue-200 focus:ring-blue-500">
                    <SelectValue placeholder={t("selectRegion", "Select Region")} />
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

              <div className="space-y-3">
                <label className="text-sm font-medium text-blue-800">
                  {t("selectHealthCondition", "Health Condition")}
                </label>
                <Select
                  value={selectedCondition}
                  onValueChange={setSelectedCondition}
                >
                  <SelectTrigger className="bg-white border-blue-200 focus:ring-blue-500">
                    <SelectValue placeholder={t("selectHealthCondition", "Select Condition")} />
                  </SelectTrigger>
                  <SelectContent>
                    {userHealthConditions.map((condition) => (
                      <SelectItem key={condition} value={condition}>
                        {condition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <Button 
                onClick={() => {
                  setSelectedRegion("All Regions");
                  setSelectedCondition("All Conditions");
                }} 
                variant="outline"
                className="bg-white border-blue-200 hover:bg-blue-50 text-blue-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                {t("resetFilters", "Reset Filters")}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-7 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-xl text-emerald-900">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {t("aiPersonalizedDietPlan", "AI Personalized Diet Plan")}
            </CardTitle>
            <CardDescription className="text-emerald-700">
              {t("aiPersonalizedDietPlanDescription", "Get a diet plan tailored to your specific health needs")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-white rounded-lg p-4 mb-6 border border-emerald-100 shadow-sm">
              <p className="text-emerald-800">
                {t("dietPlanAIExplanation", "Our AI system analyzes your health profile, regional preferences, and dietary restrictions to create a personalized nutrition plan optimized for your wellbeing.")}
              </p>
            </div>
            
            <Dialog open={personalizedDialogOpen} onOpenChange={setPersonalizedDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                  </svg>
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
                            <FormLabel>Health Conditions</FormLabel>
                            <FormDescription>
                              Select all that apply or leave blank for general health
                            </FormDescription>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {userHealthConditions.filter(c => c !== "All Conditions").map((condition) => (
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
                            <FormLabel>Allergies and Intolerances</FormLabel>
                            <FormDescription>
                              Select all that apply
                            </FormDescription>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {allergies.map((allergy) => (
                              <FormItem 
                                key={allergy} 
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox 
                                    checked={form.watch("allergies").includes(allergy)}
                                    onCheckedChange={(checked) => {
                                      const current = form.getValues("allergies");
                                      if (checked) {
                                        form.setValue("allergies", [...current, allergy]);
                                      } else {
                                        form.setValue(
                                          "allergies", 
                                          current.filter((value) => value !== allergy)
                                        );
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {allergy}
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
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel>Food Preferences</FormLabel>
                            <FormDescription>
                              Select all that apply
                            </FormDescription>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {foodPreferences.map((pref) => (
                              <FormItem 
                                key={pref} 
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox 
                                    checked={form.watch("foodPreferences").includes(pref)}
                                    onCheckedChange={(checked) => {
                                      const current = form.getValues("foodPreferences");
                                      if (checked) {
                                        form.setValue("foodPreferences", [...current, pref]);
                                      } else {
                                        form.setValue(
                                          "foodPreferences", 
                                          current.filter((value) => value !== pref)
                                        );
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {pref}
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
                      name="goals"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("goals", "Dietary Goals")}</FormLabel>
                          <Select 
                            value={field.value} 
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t("selectGoal", "Select your goal")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="weight-loss">{t("weightLoss", "Weight Loss")}</SelectItem>
                              <SelectItem value="weight-gain">{t("weightGain", "Weight Gain")}</SelectItem>
                              <SelectItem value="maintenance">{t("maintenance", "Maintenance")}</SelectItem>
                              <SelectItem value="muscle-gain">{t("muscleGain", "Muscle Gain")}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="pregnantNursing"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              {t("pregnantNursing", "Pregnant or Nursing")}
                            </FormLabel>
                            <FormDescription>
                              {t("pregnantNursingDescription", "Check this if you are pregnant or nursing to receive appropriate dietary recommendations.")}
                            </FormDescription>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  
                    <div className="pt-4 border-t flex justify-end space-x-3">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setPersonalizedDialogOpen(false)}
                      >
                        {t("cancel", "Cancel")}
                      </Button>
                      
                      <Button 
                        type="submit"
                        disabled={personalizedDietMutation.isPending}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        {personalizedDietMutation.isPending ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {t("creating", "Creating...")}
                          </>
                        ) : (
                          t("createPlan", "Create Plan")
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommended Diet Plan Result */}
      {aiRecommendedPlan && (
        <Card className="mb-8 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2"></div>
          <CardHeader>
            <CardTitle className="flex items-center text-xl text-emerald-900">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {t("yourPersonalizedDietPlan", "Your Personalized Diet Plan")}
            </CardTitle>
            <CardDescription className="text-emerald-700">
              {t("personalizedDietPlanDescription", "Your AI-generated diet plan based on your health profile and preferences")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-white rounded-lg p-6 border border-emerald-100 shadow-sm">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  {aiRecommendedPlan.region}
                </Badge>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  {aiRecommendedPlan.type.charAt(0).toUpperCase() + aiRecommendedPlan.type.slice(1)}
                </Badge>
                {aiRecommendedPlan.forCondition && Array.isArray(aiRecommendedPlan.forCondition) && aiRecommendedPlan.forCondition.map((condition, idx) => (
                  <Badge key={idx} variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                    {condition}
                  </Badge>
                ))}
              </div>

              <h3 className="text-lg font-semibold text-emerald-900 mb-4">{aiRecommendedPlan.name}</h3>
              <p className="text-slate-600 mb-5">{aiRecommendedPlan.description}</p>

              <div className="mb-6">
                <h4 className="text-md font-medium text-emerald-800 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  {t("mealPlanOverview", "Meal Plan Overview")}
                </h4>

                <Table>
                  <TableHeader>
                    <TableRow className="bg-emerald-50">
                      <TableHead className="text-emerald-800">{t("mealType", "Meal")}</TableHead>
                      <TableHead className="text-emerald-800">{t("recommendedFoods", "Recommended Foods")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {aiRecommendedPlan.items.map((item, idx) => {
                      const [mealType, mealContent] = item.split(':').map(str => str.trim());
                      return (
                        <TableRow key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-emerald-50/30'}>
                          <TableCell className="font-medium text-emerald-800">{mealType}</TableCell>
                          <TableCell>{mealContent}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              <Tabs defaultValue="nutrients">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="nutrients">{t("nutritionalInformation", "Nutritional Information")}</TabsTrigger>
                  <TabsTrigger value="restrictions">{t("dietaryRestrictions", "Dietary Restrictions")}</TabsTrigger>
                </TabsList>
                <TabsContent value="nutrients">
                  <div className="bg-emerald-50 rounded-lg p-4">
                    <h4 className="text-md font-medium text-emerald-800 mb-3">{t("dailyNutrients", "Daily Nutritional Values")}</h4>
                    <p className="text-sm text-emerald-700 mb-3">{t("caloriesPerDay", "Approximately")} {aiRecommendedPlan.calories} {t("calories", "calories per day")}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {aiRecommendedPlan.nutrients && Object.entries(aiRecommendedPlan.nutrients as Record<string, string | number>).map(([key, value]) => (
                        <div key={key} className="bg-white rounded-lg p-3 border border-emerald-100">
                          <p className="text-xs text-emerald-600 uppercase">{key}</p>
                          <p className="text-lg font-semibold text-emerald-900">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="restrictions">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="text-md font-medium text-blue-800 mb-3">{t("avoidFoods", "Foods to Avoid")}</h4>
                    
                    {aiRecommendedPlan.restrictions && (aiRecommendedPlan.restrictions as string[]).length > 0 ? (
                      <ul className="space-y-2">
                        {(aiRecommendedPlan.restrictions as string[]).map((restriction, idx) => (
                          <li key={idx} className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span className="text-blue-800">{restriction}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-blue-700">{t("noRestrictions", "No specific dietary restrictions for this plan.")}</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
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
      <div className="pb-4 border-b border-slate-200 mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">{t("availableDietPlans", "Available Diet Plans")}</h2>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-50 text-teal-800">
          {isLoading ? "..." : filteredDietPlans.length} {t("plansFound", "plans found")}
        </span>
      </div>

      {isLoading ? (
        <div className="text-center py-12 rounded-lg bg-slate-50 border border-slate-100">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-slate-600">{t("loading", "Loading diet plans...")}</p>
        </div>
      ) : filteredDietPlans.length > 0 ? (
        <div className="space-y-8">
          {filteredDietPlans.map((dietPlan) => (
            <Card key={dietPlan.id} className="overflow-hidden border-teal-100 hover:shadow-md transition-shadow duration-200">
              <div className="bg-gradient-to-r from-teal-500 to-emerald-500 h-3"></div>
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-teal-800">{dietPlan.name}</CardTitle>
                    <CardDescription className="mt-1 text-slate-600">
                      {dietPlan.description}
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">
                      {dietPlan.region}
                    </Badge>
                    {Array.isArray(dietPlan.forCondition) && dietPlan.forCondition.map((condition, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption className="mt-0 mb-2">{t("mealPlanDetails", "Detailed Meal Plan")}</TableCaption>
                  <TableHeader>
                    <TableRow className="bg-teal-50">
                      <TableHead className="text-teal-800">{t("mealType", "Meal Type")}</TableHead>
                      <TableHead className="text-teal-800">{t("recommendedFoods", "Recommended Foods")}</TableHead>
                      <TableHead className="text-teal-800 hidden md:table-cell">{t("nutritionalHighlights", "Nutritional Highlights")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.isArray(dietPlan.items) && dietPlan.items.map((item, idx) => {
                      const [mealType, mealContent] = item.split(':').map(str => str.trim());
                      return (
                        <TableRow key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-teal-50/30'}>
                          <TableCell className="font-medium text-teal-800">{mealType}</TableCell>
                          <TableCell>{mealContent}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {dietPlan.nutrients && Object.entries(dietPlan.nutrients as Record<string, string | number>).length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {idx === 0 && <span className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded">Protein</span>}
                                {idx === 1 && <span className="text-xs px-1.5 py-0.5 bg-green-50 text-green-700 rounded">Fiber</span>}
                                {idx === 2 && <span className="text-xs px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded">Vitamins</span>}
                                {idx === 3 && <span className="text-xs px-1.5 py-0.5 bg-purple-50 text-purple-700 rounded">Minerals</span>}
                                {idx === 4 && <span className="text-xs px-1.5 py-0.5 bg-rose-50 text-rose-700 rounded">Omega-3</span>}
                              </div>
                            ) : (
                              <span className="text-slate-400 text-xs">Not specified</span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-semibold text-teal-800 mb-2">{t("dietaryRestrictions", "Dietary Restrictions")}</h4>
                    {dietPlan.restrictions && Array.isArray(dietPlan.restrictions) && dietPlan.restrictions.length > 0 ? (
                      <ul className="space-y-1 pl-4 list-disc text-sm text-slate-700">
                        {dietPlan.restrictions.map((restriction, idx) => (
                          <li key={idx}>{restriction}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-slate-500 text-sm italic">
                        {t("noRestrictions", "No specific dietary restrictions for this plan.")}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-teal-800 mb-2">{t("nutritionalInformation", "Nutritional Information")}</h4>
                    {dietPlan.nutrients ? (
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {Object.entries(dietPlan.nutrients as Record<string, string | number>).slice(0, 6).map(([key, value]) => (
                          <div key={key} className="flex justify-between border-b border-teal-100 pb-1">
                            <span className="text-slate-600 capitalize">{key}</span>
                            <span className="font-medium text-teal-700">{value}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500 text-sm italic">
                        {t("nutrientsNotAvailable", "Detailed nutrient information not available.")}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-teal-50/50 flex justify-between">
                <p className="text-xs text-slate-500">
                  {t("consultHealthcare", "Consult with a healthcare professional before following this plan.")}
                </p>
                <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white">
                  {t("downloadPlan", "Download Plan")}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-100">
          <svg className="mx-auto h-16 w-16 text-slate-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-slate-900">{t("noDietPlansFound", "No Diet Plans Found")}</h3>
          <p className="mt-2 text-slate-500 max-w-md mx-auto">{t("tryDifferentFilters", "Try selecting different region or health condition.")}</p>
          <Button 
            onClick={() => {
              setSelectedRegion("All Regions");
              setSelectedCondition("All Conditions");
            }}
            variant="outline"
            className="mt-4"
          >
            {t("resetFilters", "Reset Filters")}
          </Button>
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