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
  CardTitle 
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

interface SelectedSymptom {
  id: number;
  name: string;
}

export default function SymptomChecker() {
  const { t } = useLanguage();
  const { isOffline, getOfflineData } = useOffline();
  const [selectedSymptoms, setSelectedSymptoms] = useState<SelectedSymptom[]>([]);
  const [currentSelectedSymptom, setCurrentSelectedSymptom] = useState<string>("");
  const [results, setResults] = useState<Symptom[]>([]);
  const [analyzed, setAnalyzed] = useState(false);

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

  const handleAnalyzeSymptoms = () => {
    if (selectedSymptoms.length === 0) return;
    
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
          {t("symptomCheckerDescription", "Select your symptoms to get potential health conditions and recommended actions. This tool is for informational purposes only and should not replace professional medical advice.")}
        </p>
      </div>

      {!analyzed ? (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t("selectSymptoms", "Select Your Symptoms")}</CardTitle>
              <CardDescription>{t("selectSymptomsDescription", "Choose the symptoms you are experiencing.")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Select
                    value={currentSelectedSymptom}
                    onValueChange={setCurrentSelectedSymptom}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder={t("selectSymptom", "Select a symptom")} />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoading ? (
                        <SelectItem value="loading" disabled>{t("loading", "Loading...")}</SelectItem>
                      ) : (
                        symptoms.map((symptom) => (
                          <SelectItem key={symptom.id} value={symptom.name}>
                            {symptom.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAddSymptom}>
                    {t("add", "Add")}
                  </Button>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-medium text-slate-700 mb-2">
                    {t("selectedSymptoms", "Selected Symptoms")}
                  </h3>
                  {selectedSymptoms.length === 0 ? (
                    <p className="text-sm text-slate-500 italic">
                      {t("noSymptomsSelected", "No symptoms selected yet.")}
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {selectedSymptoms.map((symptom) => (
                        <div key={symptom.id} className="flex items-center justify-between bg-slate-50 p-2 rounded">
                          <span className="text-sm text-slate-700">{symptom.name}</span>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleRemoveSymptom(symptom.name)}
                          >
                            <svg className="h-4 w-4 text-slate-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button 
                  className="w-full mt-6" 
                  size="lg"
                  onClick={handleAnalyzeSymptoms}
                  disabled={selectedSymptoms.length === 0}
                >
                  {t("analyzeSymptoms", "Analyze Symptoms")}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("commonSymptomGroups", "Common Symptom Groups")}</CardTitle>
              <CardDescription>{t("commonSymptomGroupsDescription", "Common combinations of symptoms for quick selection.")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-72">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-slate-700">
                      {t("coldAndFlu", "Cold & Flu")}
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="fever" />
                        <Label htmlFor="fever">Fever</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="cough" />
                        <Label htmlFor="cough">Cough</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="sore-throat" />
                        <Label htmlFor="sore-throat">Sore Throat</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="runny-nose" />
                        <Label htmlFor="runny-nose">Runny Nose</Label>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-slate-700">
                      {t("digestiveIssues", "Digestive Issues")}
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="nausea" />
                        <Label htmlFor="nausea">Nausea</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="vomiting" />
                        <Label htmlFor="vomiting">Vomiting</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="diarrhea" />
                        <Label htmlFor="diarrhea">Diarrhea</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="stomach-pain" />
                        <Label htmlFor="stomach-pain">Stomach Pain</Label>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-slate-700">
                      {t("respiratoryProblems", "Respiratory Problems")}
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="shortness-of-breath" />
                        <Label htmlFor="shortness-of-breath">Shortness of Breath</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="chest-pain" />
                        <Label htmlFor="chest-pain">Chest Pain</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="wheezing" />
                        <Label htmlFor="wheezing">Wheezing</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="rapid-breathing" />
                        <Label htmlFor="rapid-breathing">Rapid Breathing</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("analysisResults", "Symptom Analysis Results")}</CardTitle>
              <CardDescription>
                {t("analysisResultsDescription", "Based on the symptoms you selected, here are potential conditions and recommended actions.")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-slate-700 mb-2">
                  {t("symptomsAnalyzed", "Symptoms Analyzed:")}
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedSymptoms.map((symptom) => (
                    <span 
                      key={symptom.id} 
                      className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800"
                    >
                      {symptom.name}
                    </span>
                  ))}
                </div>

                <Separator className="my-4" />

                {results.length > 0 ? (
                  <div className="space-y-4">
                    <Accordion type="single" collapsible className="w-full">
                      {results.map((result, idx) => (
                        <AccordionItem key={idx} value={`item-${idx}`}>
                          <AccordionTrigger className="text-left">
                            <div className="flex items-center">
                              <span className="mr-2">{result.name}</span>
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${severityColor(result.severity)}`}>
                                {t(result.severity, result.severity)}
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4 pt-2">
                              <p className="text-sm text-slate-600">{result.description}</p>
                              
                              <div>
                                <h4 className="text-sm font-medium text-slate-700 mb-1">
                                  {t("possibleConditions", "Possible Conditions:")}
                                </h4>
                                <ul className="list-disc list-inside text-sm text-slate-600 space-y-1 pl-2">
                                  {(result.possibleConditions as string[]).map((condition, condIdx) => (
                                    <li key={condIdx}>{condition}</li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div>
                                <h4 className="text-sm font-medium text-slate-700 mb-1">
                                  {t("recommendedActions", "Recommended Actions:")}
                                </h4>
                                <ul className="list-disc list-inside text-sm text-slate-600 space-y-1 pl-2">
                                  {(result.recommendedActions as string[]).map((action, actIdx) => (
                                    <li key={actIdx}>{action}</li>
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
                  <div className="text-center py-6">
                    <p className="text-slate-600">{t("noMatchingResults", "No matching results found for the selected symptoms.")}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button onClick={resetChecker}>
              {t("startOver", "Start Over")}
            </Button>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6">
            <div className="flex items-start space-x-3">
              <svg className="h-6 w-6 text-amber-500 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
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
