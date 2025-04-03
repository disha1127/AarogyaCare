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
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-blue-700 mb-2">
                    {t("addYourSymptoms", "Add Your Symptoms")}
                  </h3>
                  <div className="flex space-x-2">
                    <Select
                      value={currentSelectedSymptom}
                      onValueChange={setCurrentSelectedSymptom}
                    >
                      <SelectTrigger className="flex-1 border-blue-200 focus:ring-blue-500">
                        <SelectValue placeholder={t("selectSymptom", "Select a symptom")} />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoading ? (
                          <SelectItem value="loading" disabled>{t("loading", "Loading...")}</SelectItem>
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
                    <Button 
                      onClick={handleAddSymptom}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      {t("add", "Add")}
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500 italic">
                    {t("addMultipleSymptoms", "You can add multiple symptoms to get a more accurate analysis")}
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      {t("selectedSymptoms", "Selected Symptoms")} 
                      <span className="ml-2 bg-blue-100 text-blue-800 inline-flex items-center justify-center h-5 w-5 rounded-full text-xs">
                        {selectedSymptoms.length}
                      </span>
                    </h3>
                    {selectedSymptoms.length > 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-100 h-7 px-2 py-1"
                        onClick={() => setSelectedSymptoms([])}
                      >
                        {t("clearAll", "Clear All")}
                      </Button>
                    )}
                  </div>
                  
                  {selectedSymptoms.length === 0 ? (
                    <div className="bg-white rounded p-3 text-center border border-blue-100">
                      <p className="text-sm text-slate-500 italic">
                        {t("noSymptomsSelected", "No symptoms selected yet.")}
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {selectedSymptoms.map((symptom) => (
                        <div 
                          key={symptom.id} 
                          className="flex items-center gap-1 bg-white py-1 px-2 rounded-full border border-blue-200"
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

                <Button 
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700 h-12 text-base" 
                  onClick={handleAnalyzeSymptoms}
                  disabled={selectedSymptoms.length === 0}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  {t("analyzeSymptoms", "Analyze Symptoms")}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-100">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-purple-900">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                {t("commonSymptomGroups", "Common Symptom Groups")}
              </CardTitle>
              <CardDescription className="text-purple-700">
                {t("commonSymptomGroupsDescription", "Quickly select symptoms that often occur together")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[350px] pr-4">
                <div className="space-y-6">
                  <div className="bg-white rounded-lg p-4 border border-purple-100 shadow-sm">
                    <h3 className="text-sm font-medium text-purple-800 mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {t("coldAndFlu", "Cold & Flu")}
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {['Fever', 'Cough', 'Sore Throat', 'Runny Nose', 'Headache', 'Body Aches'].map((symptomName) => {
                        const symptomObj = symptoms.find(s => s.name === symptomName);
                        const isSelected = selectedSymptoms.some(s => s.name === symptomName);
                        
                        return (
                          <div key={symptomName} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`cold-${symptomName}`}
                              checked={isSelected}
                              onCheckedChange={(checked) => {
                                if (checked && symptomObj) {
                                  // Only add if not already in the list
                                  if (!selectedSymptoms.some(s => s.name === symptomName)) {
                                    setSelectedSymptoms([...selectedSymptoms, 
                                      { id: symptomObj.id, name: symptomObj.name }
                                    ]);
                                  }
                                } else {
                                  setSelectedSymptoms(selectedSymptoms.filter(
                                    s => s.name !== symptomName
                                  ));
                                }
                              }}
                              className="border-purple-300 text-purple-600"
                            />
                            <Label 
                              htmlFor={`cold-${symptomName}`}
                              className={isSelected ? "text-purple-800 font-medium" : "text-slate-700"}
                            >
                              {symptomName}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-purple-100 shadow-sm">
                    <h3 className="text-sm font-medium text-purple-800 mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z" clipRule="evenodd" />
                      </svg>
                      {t("digestiveIssues", "Digestive Issues")}
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {['Nausea', 'Vomiting', 'Diarrhea', 'Stomach Pain', 'Bloating', 'Loss of Appetite'].map((symptomName) => {
                        const symptomObj = symptoms.find(s => s.name === symptomName);
                        const isSelected = selectedSymptoms.some(s => s.name === symptomName);
                        
                        return (
                          <div key={symptomName} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`digestive-${symptomName}`}
                              checked={isSelected}
                              onCheckedChange={(checked) => {
                                if (checked && symptomObj) {
                                  if (!selectedSymptoms.some(s => s.name === symptomName)) {
                                    setSelectedSymptoms([...selectedSymptoms, 
                                      { id: symptomObj.id, name: symptomObj.name }
                                    ]);
                                  }
                                } else {
                                  setSelectedSymptoms(selectedSymptoms.filter(
                                    s => s.name !== symptomName
                                  ));
                                }
                              }}
                              className="border-purple-300 text-purple-600"
                            />
                            <Label 
                              htmlFor={`digestive-${symptomName}`}
                              className={isSelected ? "text-purple-800 font-medium" : "text-slate-700"}
                            >
                              {symptomName}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-purple-100 shadow-sm">
                    <h3 className="text-sm font-medium text-purple-800 mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      {t("respiratoryProblems", "Respiratory Problems")}
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {['Shortness of Breath', 'Chest Pain', 'Wheezing', 'Rapid Breathing', 'Persistent Cough', 'Coughing Blood'].map((symptomName) => {
                        const symptomObj = symptoms.find(s => s.name === symptomName);
                        const isSelected = selectedSymptoms.some(s => s.name === symptomName);
                        
                        return (
                          <div key={symptomName} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`respiratory-${symptomName}`}
                              checked={isSelected}
                              onCheckedChange={(checked) => {
                                if (checked && symptomObj) {
                                  if (!selectedSymptoms.some(s => s.name === symptomName)) {
                                    setSelectedSymptoms([...selectedSymptoms, 
                                      { id: symptomObj.id, name: symptomObj.name }
                                    ]);
                                  }
                                } else {
                                  setSelectedSymptoms(selectedSymptoms.filter(
                                    s => s.name !== symptomName
                                  ));
                                }
                              }}
                              className="border-purple-300 text-purple-600"
                            />
                            <Label 
                              htmlFor={`respiratory-${symptomName}`}
                              className={isSelected ? "text-purple-800 font-medium" : "text-slate-700"}
                            >
                              {symptomName}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
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
                <h3 className="text-sm font-medium text-indigo-800 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM6.77 9.45a.5.5 0 01.73-.44l2 1.2.8.5c.18.1.35.2.5.28V6.11a.5.5 0 01.4-.49l2-.5a.5.5 0 01.6.49v8.26a.5.5 0 01-.23.42l-4 2.5a.5.5 0 01-.75-.37L6.77 9.45z" clipRule="evenodd" />
                  </svg>
                  {t("symptomsAnalyzed", "Symptoms Analyzed")}
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedSymptoms.map((symptom) => (
                    <span 
                      key={symptom.id} 
                      className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800"
                    >
                      {symptom.name}
                    </span>
                  ))}
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
          </Card>

          <div className="flex justify-center gap-4">
            <Button 
              onClick={resetChecker}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              {t("startOver", "Start Over")}
            </Button>
          </div>

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
