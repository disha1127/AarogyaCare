import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/context/LanguageContext";
import { useOffline } from "@/context/OfflineContext";
import { symptoms as localSymptoms } from "@/data/symptoms";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Symptom } from "@shared/schema";
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
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SelectedSymptom {
  id: number;
  name: string;
}

// Form validation schema for detailed user info
const userInfoSchema = z.object({
  age: z.string().min(1, "Age is required"),
  gender: z.string().min(1, "Gender is required"),
  weight: z.string().optional(),
  height: z.string().optional(),
  priorConditions: z.array(z.string()).default([]),
  medications: z.string().optional(),
  additionalSymptoms: z.string().optional(),
  symptomsStarted: z.string().optional(),
  severity: z.string().default("moderate"),
});

export default function SymptomChecker() {
  const { t } = useLanguage();
  const { isOffline, getOfflineData } = useOffline();
  const [selectedSymptoms, setSelectedSymptoms] = useState<SelectedSymptom[]>([]);
  const [currentSelectedSymptom, setCurrentSelectedSymptom] = useState<string>("");
  const [results, setResults] = useState<Symptom[]>([]);
  const [analyzed, setAnalyzed] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("symptoms");

  // Initialize form for user info
  const userInfoForm = useForm<z.infer<typeof userInfoSchema>>({
    resolver: zodResolver(userInfoSchema),
    defaultValues: {
      age: "",
      gender: "",
      weight: "",
      height: "",
      priorConditions: [],
      medications: "",
      additionalSymptoms: "",
      symptomsStarted: "",
      severity: "moderate"
    },
  });

  // Common health conditions for checkboxes
  const commonHealthConditions = [
    "Diabetes",
    "Hypertension",
    "Asthma",
    "Heart Disease",
    "Thyroid Disorder",
    "Arthritis",
    "Allergies",
    "Kidney Disease"
  ];

  // Common symptoms for checkboxes
  const commonSymptomGroups = {
    "Cold & Flu": ["Fever", "Cough", "Sore Throat", "Runny Nose", "Headache", "Body Aches"],
    "Digestive Issues": ["Nausea", "Vomiting", "Diarrhea", "Stomach Pain", "Bloating", "Loss of Appetite"],
    "Respiratory": ["Shortness of Breath", "Chest Pain", "Wheezing", "Rapid Breathing", "Persistent Cough"],
    "Pain": ["Headache", "Back Pain", "Joint Pain", "Muscle Pain", "Abdominal Pain", "Chest Pain"]
  };

  // Fetch symptoms from the API
  const { data: apiSymptoms, isLoading } = useQuery({
    queryKey: ['/api/symptoms'],
    enabled: !isOffline
  });

  // Use local symptoms if offline, or from API if online
  const symptoms = isOffline ? localSymptoms : (apiSymptoms || localSymptoms);

  const handleAddSymptom = () => {
    if (!currentSelectedSymptom) return;
    
    const symptomToAdd = symptoms.find(s => s.name === currentSelectedSymptom);
    if (!symptomToAdd) return;
    
    const alreadySelected = selectedSymptoms.some(s => s.name === currentSelectedSymptom);
    if (alreadySelected) return;
    
    setSelectedSymptoms([...selectedSymptoms, { id: symptomToAdd.id, name: symptomToAdd.name }]);
    setCurrentSelectedSymptom("");
  };

  const handleRemoveSymptom = (symptomName: string) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s.name !== symptomName));
  };

  const handleAddSymptomByName = (symptomName: string) => {
    const symptomToAdd = symptoms.find(s => s.name === symptomName);
    if (!symptomToAdd) return;
    
    const alreadySelected = selectedSymptoms.some(s => s.name === symptomName);
    if (alreadySelected) return;
    
    setSelectedSymptoms([...selectedSymptoms, { id: symptomToAdd.id, name: symptomToAdd.name }]);
  };

  const handleAnalyzeSymptoms = () => {
    if (selectedSymptoms.length === 0) return;
    
    // Get user info data if available
    const userInfo = userInfoForm.getValues();
    
    // Rule-based symptom checker
    // Find symptoms that match the selected symptoms
    const matchingSymptoms = symptoms.filter(symptom => 
      selectedSymptoms.some(selected => selected.name === symptom.name)
    );
    
    setResults(matchingSymptoms);
    setAnalyzed(true);
  };
  
  const resetChecker = () => {
    setSelectedSymptoms([]);
    setCurrentSelectedSymptom("");
    setResults([]);
    setAnalyzed(false);
    userInfoForm.reset();
    setActiveTab("symptoms");
  };

  const severityColor = (severity: string) => {
    switch (severity) {
      case "mild": return "bg-green-100 text-green-800";
      case "moderate": return "bg-amber-100 text-amber-800";
      case "severe": return "bg-red-100 text-red-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="container mx-auto max-w-5xl py-12 px-4 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{t("symptomChecker", "Symptom Checker")}</h1>
        <p className="text-slate-600 max-w-3xl">
          {t("symptomCheckerDescription", "Select your symptoms and provide personal information to get potential health conditions and recommended actions. This tool is for informational purposes only and should not replace professional medical advice.")}
        </p>
      </div>

      {!analyzed ? (
        <div className="space-y-8">
          <Tabs defaultValue="symptoms" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="symptoms" className="text-base py-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {t("common.symptoms", "Step 1: Symptoms")}
              </TabsTrigger>
              <TabsTrigger value="personalInfo" className="text-base py-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                {t("common.personalInfo", "Step 2: Personal Info")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="symptoms" className="mt-6 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Select individual symptoms */}
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-blue-900 text-xl">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      {t("common.selectSymptoms", "Select Your Symptoms")}
                    </CardTitle>
                    <CardDescription className="text-blue-700">
                      {t("common.selectSymptomsDescription", "Choose from dropdown or common symptoms below")}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex space-x-2">
                        <Select
                          value={currentSelectedSymptom}
                          onValueChange={(value) => {
                            setCurrentSelectedSymptom(value);
                            // If a value is selected, automatically add it
                            if (value) {
                              const symptomToAdd = symptoms.find(s => s.name === value);
                              if (symptomToAdd && !selectedSymptoms.some(s => s.name === value)) {
                                setSelectedSymptoms([...selectedSymptoms, { 
                                  id: symptomToAdd.id, 
                                  name: symptomToAdd.name 
                                }]);
                                // Clear selection after adding
                                setTimeout(() => setCurrentSelectedSymptom(""), 100);
                              }
                            }
                          }}
                        >
                          <SelectTrigger className="flex-1 border-blue-200 focus:ring-blue-500">
                            <SelectValue placeholder={t("common.selectSymptom", "Select a symptom")} />
                          </SelectTrigger>
                          <SelectContent>
                            {isLoading ? (
                              <SelectItem value="loading" disabled>{t("common.loading", "Loading...")}</SelectItem>
                            ) : (
                              symptoms
                                .filter(symptom => !selectedSymptoms.some(s => s.name === symptom.name))
                                .map((symptom) => (
                                  <SelectItem key={symptom.id} value={symptom.name}>
                                    {symptom.name}
                                  </SelectItem>
                                ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Common symptom checkboxes */}
                    <div className="bg-white rounded-lg p-4 border border-blue-100 shadow-sm space-y-4">
                      <h3 className="text-sm font-medium text-blue-800 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                        </svg>
                        {t("common.commonSymptoms", "Common Symptoms")}
                      </h3>
                      
                      <Accordion type="multiple" className="w-full">
                        {Object.entries(commonSymptomGroups).map(([group, groupSymptoms]) => (
                          <AccordionItem key={group} value={group} className="border-blue-100">
                            <AccordionTrigger className="text-blue-700 hover:text-blue-900 py-3">
                              {t(`common.${group.toLowerCase().replace(/\s+/g, '')}`, group)}
                            </AccordionTrigger>
                            <AccordionContent className="space-y-1 pt-1 pb-3 px-1">
                              <div className="grid grid-cols-2 gap-2">
                                {groupSymptoms.map((symptomName) => {
                                  const symptom = symptoms.find(s => s.name === symptomName);
                                  const isSelected = selectedSymptoms.some(s => s.name === symptomName);
                                  
                                  return (
                                    <div key={symptomName} className="flex items-center space-x-2">
                                      <Checkbox 
                                        id={`${group}-${symptomName}`}
                                        checked={isSelected}
                                        onCheckedChange={(checked) => {
                                          if (checked && symptom) {
                                            if (!isSelected) {
                                              setSelectedSymptoms([...selectedSymptoms, 
                                                { id: symptom.id, name: symptom.name }
                                              ]);
                                            }
                                          } else {
                                            setSelectedSymptoms(selectedSymptoms.filter(
                                              s => s.name !== symptomName
                                            ));
                                          }
                                        }}
                                      />
                                      <Label 
                                        htmlFor={`${group}-${symptomName}`}
                                        className={isSelected ? "text-blue-800 font-medium" : "text-slate-700"}
                                      >
                                        {symptomName}
                                      </Label>
                                    </div>
                                  );
                                })}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  </CardContent>
                </Card>

                {/* Selected symptoms and free text input */}
                <div className="space-y-6">
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center text-blue-900 text-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {t("common.selectedSymptoms", "Selected Symptoms")}
                      </CardTitle>
                      <CardDescription className="text-blue-700">
                        {t("common.selectedSymptomsDescription", "Your selected symptoms for analysis")}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="bg-white p-4 rounded-lg border border-blue-100 min-h-[100px]">
                        {selectedSymptoms.length === 0 ? (
                          <p className="text-slate-500 text-center italic py-4">
                            {t("common.noSymptomsSelected", "No symptoms selected yet. Please select symptoms from the left panel.")}
                          </p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {selectedSymptoms.map((symptom) => (
                              <div 
                                key={symptom.id} 
                                className="flex items-center gap-1.5 bg-blue-50 py-1.5 px-3 rounded-full border border-blue-200"
                              >
                                <span className="text-sm text-blue-800">{symptom.name}</span>
                                <button 
                                  type="button"
                                  className="text-blue-400 hover:text-blue-600 focus:outline-none"
                                  onClick={() => handleRemoveSymptom(symptom.name)}
                                  aria-label={`Remove ${symptom.name}`}
                                >
                                  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <Textarea 
                        className="mt-4 border-blue-200 focus-visible:ring-blue-500" 
                        placeholder={t("additionalSymptoms", "Describe any additional symptoms or details not covered above...")}
                        onChange={(e) => userInfoForm.setValue("additionalSymptoms", e.target.value)}
                      />
                    </CardContent>
                    
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="outline"
                        onClick={() => setSelectedSymptoms([])}
                        disabled={selectedSymptoms.length === 0}
                        className="text-blue-600 border-blue-200"
                      >
                        {t("common.clearAll", "Clear All")}
                      </Button>
                      
                      <Button 
                        onClick={() => setActiveTab("personalInfo")}
                        className="bg-blue-600 hover:bg-blue-700"
                        disabled={selectedSymptoms.length === 0}
                      >
                        {t("common.next", "Next: Personal Info")}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="personalInfo" className="mt-6">
              <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-indigo-900 text-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    {t("common.personalHealthInfo", "Personal Health Information")}
                  </CardTitle>
                  <CardDescription className="text-indigo-700">
                    {t("common.personalHealthInfoDescription", "Provide your personal health information for more accurate analysis")}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <Form {...userInfoForm}>
                    <form className="space-y-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <FormField
                          control={userInfoForm.control}
                          name="age"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-indigo-900">{t("age", "Age")}</FormLabel>
                              <FormControl>
                                <Input type="number" className="border-indigo-200 focus-visible:ring-indigo-500" placeholder="e.g. 45" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={userInfoForm.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-indigo-900">{t("gender", "Gender")}</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  className="flex space-x-4"
                                >
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="male" />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">
                                      {t("male", "Male")}
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="female" />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">
                                      {t("female", "Female")}
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="other" />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">
                                      {t("other", "Other")}
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid gap-6 md:grid-cols-2">
                        <FormField
                          control={userInfoForm.control}
                          name="weight"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-indigo-900">{t("weight", "Weight (kg)")}</FormLabel>
                              <FormControl>
                                <Input type="number" className="border-indigo-200 focus-visible:ring-indigo-500" placeholder="e.g. 70" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={userInfoForm.control}
                          name="height"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-indigo-900">{t("height", "Height (cm)")}</FormLabel>
                              <FormControl>
                                <Input type="number" className="border-indigo-200 focus-visible:ring-indigo-500" placeholder="e.g. 165" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={userInfoForm.control}
                        name="priorConditions"
                        render={() => (
                          <FormItem>
                            <div className="mb-2">
                              <FormLabel className="text-indigo-900">{t("priorConditions", "Pre-existing Medical Conditions")}</FormLabel>
                              <FormDescription>
                                {t("priorConditionsDescription", "Select all that apply")}
                              </FormDescription>
                            </div>
                            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                              {commonHealthConditions.map((condition) => (
                                <FormItem 
                                  key={condition} 
                                  className="flex items-center space-x-2 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox 
                                      checked={userInfoForm.watch("priorConditions").includes(condition)}
                                      onCheckedChange={(checked) => {
                                        const current = userInfoForm.getValues("priorConditions");
                                        if (checked) {
                                          userInfoForm.setValue("priorConditions", [...current, condition]);
                                        } else {
                                          userInfoForm.setValue(
                                            "priorConditions", 
                                            current.filter((value) => value !== condition)
                                          );
                                        }
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    {condition}
                                  </FormLabel>
                                </FormItem>
                              ))}
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={userInfoForm.control}
                        name="medications"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-indigo-900">{t("medications", "Current Medications")}</FormLabel>
                            <FormControl>
                              <Textarea 
                                className="border-indigo-200 focus-visible:ring-indigo-500" 
                                placeholder={t("medicationsPlaceholder", "List any medications you are currently taking...")}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={userInfoForm.control}
                        name="symptomsStarted"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-indigo-900">{t("symptomsStarted", "When did your symptoms start?")}</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="border-indigo-200 focus-visible:ring-indigo-500">
                                  <SelectValue placeholder={t("selectDuration", "Select duration")} />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="today">{t("today", "Today")}</SelectItem>
                                  <SelectItem value="yesterday">{t("yesterday", "Yesterday")}</SelectItem>
                                  <SelectItem value="few-days">{t("fewDays", "Few days ago")}</SelectItem>
                                  <SelectItem value="week">{t("week", "About a week ago")}</SelectItem>
                                  <SelectItem value="more-than-week">{t("moreThanWeek", "More than a week ago")}</SelectItem>
                                  <SelectItem value="month">{t("month", "About a month ago")}</SelectItem>
                                  <SelectItem value="more-than-month">{t("moreThanMonth", "More than a month ago")}</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={userInfoForm.control}
                        name="severity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-indigo-900">{t("symptomSeverity", "Symptom Severity")}</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value}
                                className="space-y-2"
                              >
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="mild" />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    <span className="font-medium text-green-600 mr-1">{t("mild", "Mild:")}</span>
                                    {t("mildDescription", "Noticeable but doesn't interfere with daily activities")}
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="moderate" />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    <span className="font-medium text-amber-600 mr-1">{t("moderate", "Moderate:")}</span>
                                    {t("moderateDescription", "Causes some difficulty with daily activities")}
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="severe" />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    <span className="font-medium text-red-600 mr-1">{t("severe", "Severe:")}</span>
                                    {t("severeDescription", "Significantly disrupts daily activities")}
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>
                </CardContent>
                
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline"
                    onClick={() => setActiveTab("symptoms")}
                    className="text-indigo-600 border-indigo-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    {t("common.back", "Back to Symptoms")}
                  </Button>
                  
                  <Button 
                    onClick={handleAnalyzeSymptoms}
                    className="bg-indigo-600 hover:bg-indigo-700"
                    disabled={selectedSymptoms.length === 0 || !userInfoForm.getValues("age") || !userInfoForm.getValues("gender")}
                  >
                    {t("common.analyzeSymptoms", "Analyze Symptoms")}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                    </svg>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2"></div>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-indigo-900">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 011 1v.01a1 1 0 11-2 0V10a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                {t("analysisResults", "Symptom Analysis Results")}
              </CardTitle>
              <CardDescription className="text-indigo-700">
                {t("analysisResultsDescription", "Based on your symptoms, here are potential conditions and recommended actions")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 bg-white rounded-lg p-4 border border-indigo-100 shadow-sm">
                <div className="grid gap-6 md:grid-cols-2 mb-4">
                  <div>
                    <h3 className="text-sm font-medium text-indigo-800 mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM6.77 9.45a.5.5 0 01.73-.44l2 1.2.8.5c.18.1.35.2.5.28V6.11a.5.5 0 01.4-.49l2-.5a.5.5 0 01.6.49v8.26a.5.5 0 01-.23.42l-4 2.5a.5.5 0 01-.75-.37L6.77 9.45z" clipRule="evenodd" />
                      </svg>
                      {t("symptomsAnalyzed", "Symptoms Analyzed")}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedSymptoms.map((symptom) => (
                        <span 
                          key={symptom.id} 
                          className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800"
                        >
                          {symptom.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-indigo-800 mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      {t("patientInfo", "Patient Information")}
                    </h3>
                    <ul className="space-y-1 text-sm text-slate-600">
                      {userInfoForm.getValues("age") && (
                        <li className="flex items-center gap-2">
                          <span className="font-medium">{t("age", "Age")}:</span> {userInfoForm.getValues("age")}
                        </li>
                      )}
                      {userInfoForm.getValues("gender") && (
                        <li className="flex items-center gap-2">
                          <span className="font-medium">{t("gender", "Gender")}:</span> {t(userInfoForm.getValues("gender"), userInfoForm.getValues("gender"))}
                        </li>
                      )}
                      {userInfoForm.getValues("priorConditions").length > 0 && (
                        <li className="flex items-start gap-2">
                          <span className="font-medium">{t("priorConditions", "Conditions")}:</span> 
                          <span>{userInfoForm.getValues("priorConditions").join(", ")}</span>
                        </li>
                      )}
                      {userInfoForm.getValues("severity") && (
                        <li className="flex items-center gap-2">
                          <span className="font-medium">{t("severity", "Severity")}:</span> 
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${severityColor(userInfoForm.getValues("severity"))}`}>
                            {t(userInfoForm.getValues("severity"), userInfoForm.getValues("severity"))}
                          </span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                <Separator className="my-4 bg-indigo-100" />

                {results.length > 0 ? (
                  <div className="space-y-4">
                    <Accordion type="single" collapsible className="w-full">
                      {results.map((result, idx) => (
                        <AccordionItem key={idx} value={`item-${idx}`} className="border-indigo-100">
                          <AccordionTrigger className="text-left hover:bg-indigo-50 px-3 py-2 rounded-md">
                            <div className="flex items-center">
                              <span className="mr-2 text-indigo-900 font-medium">{result.name}</span>
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${severityColor(result.severity)}`}>
                                {t(result.severity, result.severity)}
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pt-1 px-3">
                            <div className="space-y-4 pt-2 pb-1">
                              <p className="text-sm text-indigo-700">{result.description}</p>
                              
                              <div className="bg-indigo-50 rounded-md p-3">
                                <h4 className="text-sm font-medium text-indigo-800 mb-2 flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                  </svg>
                                  {t("possibleConditions", "Possible Conditions")}
                                </h4>
                                <ul className="text-sm text-indigo-700 space-y-1.5">
                                  {(result.possibleConditions as string[]).map((condition, condIdx) => (
                                    <li key={condIdx} className="flex items-start">
                                      <svg className="h-4 w-4 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                      </svg>
                                      {condition}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div className="bg-blue-50 rounded-md p-3">
                                <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                  </svg>
                                  {t("recommendedActions", "Recommended Actions")}
                                </h4>
                                <ul className="text-sm text-blue-700 space-y-1.5">
                                  {(result.recommendedActions as string[]).map((action, actIdx) => (
                                    <li key={actIdx} className="flex items-start">
                                      <svg className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                      {action}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                ) : (
                  <div className="text-center py-6 bg-indigo-50 rounded-lg">
                    <svg className="h-12 w-12 text-indigo-300 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-indigo-600">{t("noMatchingResults", "No matching results found for the selected symptoms.")}</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={resetChecker}
                className="bg-indigo-600 hover:bg-indigo-700 w-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                {t("common.startOver", "Start Over")}
              </Button>
            </CardFooter>
          </Card>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6">
            <div className="flex items-start space-x-3">
              <svg className="h-6 w-6 text-amber-500 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-amber-800">
                  {t("disclaimer", "Important Disclaimer")}
                </h3>
                <p className="text-sm text-amber-700 mt-1">
                  {t("disclaimerText", "This tool provides general information only and is not a substitute for professional medical advice. If you are experiencing severe symptoms or are concerned about your health, please consult a healthcare professional immediately.")}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}