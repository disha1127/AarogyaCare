import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLanguage } from "@/context/LanguageContext";
import { useOffline } from "@/context/OfflineContext";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/formatDate";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertMedicationSchema, Medication } from "@shared/schema";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, CalendarDays, Check, Clock, AlertCircle, Bell } from "lucide-react";
import MedicationAdherence, { AdherenceRecord } from "@/components/MedicationAdherence";
import { useAuth } from "@/hooks/use-auth";

// Define days of the week for the form
const daysOfWeek = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" },
];

// Define time slots for medication reminders
const timeSlots = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00",
  "20:00", "21:00", "22:00", "23:00", "00:00"
];

// Form schema extends the insert medication schema with validation
const formSchema = insertMedicationSchema.extend({
  // Additional validation rules
  reminderTimes: z.array(z.string()).min(1, "Select at least one time"),
  selectedDays: z.array(z.string()).optional(),
});

// Adherence log form schema
const adherenceLogSchema = z.object({
  medicationId: z.number(),
  date: z.string(),
  time: z.string(),
  taken: z.boolean(),
  notes: z.string().optional(),
});

type AdherenceLogFormValues = z.infer<typeof adherenceLogSchema>;

export default function MedicationReminders() {
  const { t, currentLanguage } = useLanguage();
  const { isOffline, getOfflineData, saveOfflineData } = useOffline();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("medications");
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  const [logDialogOpen, setLogDialogOpen] = useState(false);
  const [selectedMedicationForLog, setSelectedMedicationForLog] = useState<Medication | null>(null);
  const [adherenceRecords, setAdherenceRecords] = useState<AdherenceRecord[]>([]);

  // Get user ID from auth, or use dummy value for development
  const userId = user?.id || 1;

  // Fetch user's medications
  const { data: medications, isLoading } = useQuery({
    queryKey: [`/api/medications/user/${userId}`],
    enabled: !isOffline
  });

  // Create form with validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: userId,
      name: "",
      dosage: "",
      frequency: "once daily",
      startDate: new Date().toISOString().split('T')[0],
      endDate: "",
      instructions: "",
      reminderTimes: ["08:00"],
      isActive: true,
      selectedDays: daysOfWeek.map(d => d.id)
    }
  });

  // Create log form with validation
  const logForm = useForm<AdherenceLogFormValues>({
    resolver: zodResolver(adherenceLogSchema),
    defaultValues: {
      medicationId: 0,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().substring(0, 5),
      taken: true,
      notes: "",
    }
  });

  // Reset form when dialog closes
  useEffect(() => {
    if (!reminderDialogOpen) {
      setEditingMedication(null);
      form.reset({
        userId: userId,
        name: "",
        dosage: "",
        frequency: "once daily",
        startDate: new Date().toISOString().split('T')[0],
        endDate: "",
        instructions: "",
        reminderTimes: ["08:00"],
        isActive: true,
        selectedDays: daysOfWeek.map(d => d.id)
      });
    }
  }, [reminderDialogOpen, form, userId]);

  // Set form values when editing a medication
  useEffect(() => {
    if (editingMedication) {
      form.reset({
        ...editingMedication,
        startDate: new Date(editingMedication.startDate).toISOString().split('T')[0],
        endDate: editingMedication.endDate 
          ? new Date(editingMedication.endDate).toISOString().split('T')[0] 
          : "",
        reminderTimes: editingMedication.reminderTimes as string[],
        selectedDays: daysOfWeek.map(d => d.id) // In a real app, this would come from the medication data
      });
    }
  }, [editingMedication, form]);

  // Set log form values when opening the log dialog
  useEffect(() => {
    if (selectedMedicationForLog) {
      logForm.reset({
        medicationId: selectedMedicationForLog.id,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().substring(0, 5),
        taken: true,
        notes: "",
      });
    }
  }, [selectedMedicationForLog, logForm]);

  // Load adherence records from offline storage
  useEffect(() => {
    const loadAdherenceRecords = async () => {
      try {
        const records = await getOfflineData<AdherenceRecord[]>('adherenceRecords');
        if (records && records.length > 0) {
          setAdherenceRecords(records);
        }
      } catch (error) {
        console.error("Error loading adherence records:", error);
      }
    };

    loadAdherenceRecords();
  }, [getOfflineData]);

  // Create medication mutation
  const createMutation = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) => {
      return apiRequest("POST", "/api/medications", data);
    },
    onSuccess: () => {
      setReminderDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: [`/api/medications/user/${userId}`] });
      toast({
        title: t("medicationAdded", "Medication Reminder Added"),
        description: t("medicationAddedDesc", "Your medication reminder has been successfully set."),
      });
    },
    onError: (error) => {
      toast({
        title: t("errorAddingMedication", "Error Adding Medication"),
        description: error.toString(),
        variant: "destructive",
      });
    }
  });

  // Update medication mutation
  const updateMutation = useMutation({
    mutationFn: (data: { id: number, medicationData: Partial<Medication> }) => {
      return apiRequest("PATCH", `/api/medications/${data.id}`, data.medicationData);
    },
    onSuccess: () => {
      setReminderDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: [`/api/medications/user/${userId}`] });
      toast({
        title: t("medicationUpdated", "Medication Reminder Updated"),
        description: t("medicationUpdatedDesc", "Your medication reminder has been successfully updated."),
      });
    },
    onError: (error) => {
      toast({
        title: t("errorUpdatingMedication", "Error Updating Medication"),
        description: error.toString(),
        variant: "destructive",
      });
    }
  });

  // Delete medication mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      return apiRequest("DELETE", `/api/medications/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/medications/user/${userId}`] });
      toast({
        title: t("medicationRemoved", "Medication Reminder Removed"),
        description: t("medicationRemovedDesc", "Your medication reminder has been successfully removed."),
      });
    },
    onError: (error) => {
      toast({
        title: t("errorRemovingMedication", "Error Removing Medication"),
        description: error.toString(),
        variant: "destructive",
      });
    }
  });

  // Handle form submission
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // Prepare the data
    const medicationData = {
      ...data,
      // Convert reminderTimes to the format expected by the API
      reminderTimes: data.reminderTimes
    };

    if (editingMedication) {
      // Update existing medication
      updateMutation.mutate({ 
        id: editingMedication.id, 
        medicationData 
      });
    } else {
      // Create new medication
      createMutation.mutate(medicationData);
    }
  };

  // Handle adherence log submission
  const onLogSubmit = async (data: AdherenceLogFormValues) => {
    // Create the adherence record
    const newRecord: AdherenceRecord = {
      medicationId: data.medicationId,
      date: data.date,
      taken: data.taken,
      scheduledTime: selectedMedicationForLog?.reminderTimes[0] as string || "08:00",
      actualTime: data.time,
    };

    try {
      // In a real app, we would save this to the API
      // For now, we'll just save it to our state and local storage
      
      // Add the new record to state
      const updatedRecords = [...adherenceRecords, newRecord];
      setAdherenceRecords(updatedRecords);
      
      // Save to offline storage
      await saveOfflineData('adherenceRecords', updatedRecords);
      
      toast({
        title: data.taken 
          ? t("medicationTaken", "Medication Taken") 
          : t("medicationSkipped", "Medication Skipped"),
        description: t("adherenceLoggedDesc", "Your medication adherence has been logged successfully."),
      });
      
      setLogDialogOpen(false);
    } catch (error) {
      toast({
        title: t("errorLoggingAdherence", "Error Logging Adherence"),
        description: error.toString(),
        variant: "destructive",
      });
    }
  };

  // Handle deletion confirmation
  const handleDeleteMedication = (id: number) => {
    if (confirm(t("confirmDelete", "Are you sure you want to delete this medication reminder?"))) {
      deleteMutation.mutate(id);
    }
  };

  // Handle edit medication
  const handleEditMedication = (medication: Medication) => {
    setEditingMedication(medication);
    setReminderDialogOpen(true);
  };

  // Handle log medication
  const handleLogMedication = (medication: Medication) => {
    setSelectedMedicationForLog(medication);
    setLogDialogOpen(true);
  };

  // Function to determine if a medication is today
  const isMedicationForToday = (medication: Medication) => {
    // In a real app, we would check if the medication is scheduled for today
    // For now, let's just return true for demonstration
    return true;
  };

  // Function to check if a medication is active (not expired)
  const isMedicationActive = (medication: Medication) => {
    if (!medication.isActive) return false;
    
    const today = new Date();
    const startDate = new Date(medication.startDate);
    if (startDate > today) return false;
    
    if (medication.endDate) {
      const endDate = new Date(medication.endDate);
      if (endDate < today) return false;
    }
    
    return true;
  };

  // Function to check if a medication has been logged today
  const isLoggedToday = (medicationId: number) => {
    const today = new Date().toISOString().split('T')[0];
    return adherenceRecords.some(
      record => record.medicationId === medicationId && record.date === today
    );
  };

  return (
    <div className="container mx-auto max-w-7xl py-12 px-4 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{t("medicationReminders", "Medication Reminders")}</h1>
        <p className="text-slate-600 max-w-3xl">
          {t("medicationRemindersDescription", "Never miss your medications with personalized reminders. Set up your medication schedule and receive timely alerts.")}
        </p>
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="mb-8"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="medications">
            <Clock className="h-4 w-4 mr-2" />
            {t("medications", "Medications")}
          </TabsTrigger>
          <TabsTrigger value="adherence">
            <Check className="h-4 w-4 mr-2" />
            {t("adherenceTracking", "Adherence Tracking")}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="medications" className="mt-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h2 className="text-xl font-semibold text-slate-800">
              {t("yourMedications", "Your Medications")}
            </h2>
            
            <Dialog open={reminderDialogOpen} onOpenChange={setReminderDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  {t("addMedication", "Add Medication")}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingMedication ? t("editMedication", "Edit Medication") : t("addNewMedication", "Add New Medication")}
                  </DialogTitle>
                  <DialogDescription>
                    {t("medicationFormDescription", "Enter the details of your medication and set up reminders.")}
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("medicationName", "Medication Name")}</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder={t("enterMedicationName", "Enter medication name")} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="dosage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("dosage", "Dosage")}</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder={t("enterDosage", "E.g., 1 tablet, 5ml")} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="frequency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("frequency", "Frequency")}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={t("selectFrequency", "Select frequency")} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="once daily">{t("onceDaily", "Once Daily")}</SelectItem>
                                <SelectItem value="twice daily">{t("twiceDaily", "Twice Daily")}</SelectItem>
                                <SelectItem value="three times daily">{t("thriceDaily", "Three Times Daily")}</SelectItem>
                                <SelectItem value="four times daily">{t("fourTimesDaily", "Four Times Daily")}</SelectItem>
                                <SelectItem value="as needed">{t("asNeeded", "As Needed")}</SelectItem>
                                <SelectItem value="weekly">{t("weekly", "Weekly")}</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("startDate", "Start Date")}</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("endDate", "End Date (Optional)")}</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="instructions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("instructions", "Instructions (Optional)")}</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder={t("enterInstructions", "E.g., Take with food, avoid dairy products")} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="reminderTimes"
                      render={() => (
                        <FormItem>
                          <FormLabel>{t("reminderTimes", "Reminder Times")}</FormLabel>
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {timeSlots.map((time) => (
                              <FormItem
                                key={time}
                                className="flex flex-row items-start space-x-2 space-y-0 rounded-md border p-2"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={form.watch("reminderTimes").includes(time)}
                                    onCheckedChange={(checked) => {
                                      const currentValues = form.watch("reminderTimes");
                                      if (checked) {
                                        form.setValue("reminderTimes", [...currentValues, time]);
                                      } else {
                                        form.setValue(
                                          "reminderTimes",
                                          currentValues.filter((value) => value !== time)
                                        );
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal text-sm cursor-pointer">
                                  {time}
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
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>{t("isActive", "Active Reminder")}</FormLabel>
                            <FormDescription>
                              {t("isActiveDescription", "Toggle on to receive reminders for this medication")}
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter className="gap-2 sm:gap-0">
                      {editingMedication && (
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => handleDeleteMedication(editingMedication.id)}
                        >
                          {t("delete", "Delete")}
                        </Button>
                      )}
                      <Button type="submit">
                        {editingMedication 
                          ? t("updateMedication", "Update Medication") 
                          : t("addMedication", "Add Medication")
                        }
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            
            {/* Medication Log Dialog */}
            <Dialog open={logDialogOpen} onOpenChange={setLogDialogOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{t("logMedicationAdherence", "Log Medication Adherence")}</DialogTitle>
                  <DialogDescription>
                    {selectedMedicationForLog && (
                      <span>
                        {selectedMedicationForLog.name} - {selectedMedicationForLog.dosage}
                      </span>
                    )}
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...logForm}>
                  <form onSubmit={logForm.handleSubmit(onLogSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={logForm.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("date", "Date")}</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={logForm.control}
                        name="time"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("time", "Time")}</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={logForm.control}
                      name="taken"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between space-x-2 space-y-0 rounded-md border p-4">
                          <div className="space-y-0.5">
                            <FormLabel>{t("medicationTaken", "Medication Taken")}</FormLabel>
                            <FormDescription>
                              {t("markAsTaken", "Mark whether you took this medication or skipped it")}
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={logForm.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("notes", "Notes (Optional)")}</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder={t("notesPlaceholder", "E.g., Felt nauseous, Skipped due to illness")}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <Button type="submit">
                        {t("saveLog", "Save Log")}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto mb-3"></div>
              <p className="text-slate-500">{t("loading", "Loading...")}</p>
            </div>
          ) : medications && medications.length > 0 ? (
            <div className="space-y-6">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
                <h3 className="font-medium text-slate-900 mb-2">{t("todayMedications", "Today's Medications")}</h3>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {medications
                    .filter(med => isMedicationActive(med) && isMedicationForToday(med))
                    .map((medication) => (
                      <Card key={medication.id} className="border-l-4 border-l-primary-500 overflow-hidden">
                        {isLoggedToday(medication.id) && (
                          <div className="bg-green-100 text-green-800 text-xs font-medium text-center py-1">
                            <Check className="h-3 w-3 inline-block mr-1" />
                            {t("takenToday", "Taken Today")}
                          </div>
                        )}
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{medication.name}</CardTitle>
                            <Badge variant={medication.isActive ? "default" : "outline"}>
                              {medication.isActive ? t("active", "Active") : t("inactive", "Inactive")}
                            </Badge>
                          </div>
                          <CardDescription>
                            {medication.dosage} - {medication.frequency}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="text-sm text-slate-600">
                            <p>
                              <span className="font-medium">{t("reminderTimes", "Reminder Times")}:</span>{" "}
                              {(medication.reminderTimes as string[]).join(", ")}
                            </p>
                            {medication.instructions && (
                              <p className="mt-1">
                                <span className="font-medium">{t("instructions", "Instructions")}:</span>{" "}
                                {medication.instructions}
                              </p>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleLogMedication(medication)}
                          >
                            {isLoggedToday(medication.id) 
                              ? t("updateLog", "Update Log") 
                              : t("logDose", "Log Dose")}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditMedication(medication)}
                          >
                            {t("edit", "Edit")}
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-slate-900 mb-3">{t("allMedications", "All Medications")}</h3>
                <div className="space-y-4">
                  {medications.map((medication) => (
                    <Card key={medication.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle>{medication.name}</CardTitle>
                          <Badge variant={isMedicationActive(medication) ? "default" : "outline"}>
                            {isMedicationActive(medication) ? t("active", "Active") : t("inactive", "Inactive")}
                          </Badge>
                        </div>
                        <CardDescription>
                          {medication.dosage} - {medication.frequency}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-2 sm:grid-cols-2">
                          <div>
                            <p className="text-sm text-slate-500">{t("startDate", "Start Date")}</p>
                            <p className="text-slate-900">{formatDate(medication.startDate, currentLanguage)}</p>
                          </div>
                          {medication.endDate && (
                            <div>
                              <p className="text-sm text-slate-500">{t("endDate", "End Date")}</p>
                              <p className="text-slate-900">{formatDate(medication.endDate, currentLanguage)}</p>
                            </div>
                          )}
                        </div>
                        <Separator className="my-3" />
                        <div>
                          <p className="text-sm text-slate-500">{t("reminderTimes", "Reminder Times")}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(medication.reminderTimes as string[]).map((time, idx) => (
                              <Badge key={idx} variant="outline" className="bg-slate-50">
                                {time}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {medication.instructions && (
                          <>
                            <Separator className="my-3" />
                            <div>
                              <p className="text-sm text-slate-500">{t("instructions", "Instructions")}</p>
                              <p className="text-slate-900 mt-1">{medication.instructions}</p>
                            </div>
                          </>
                        )}
                      </CardContent>
                      <CardFooter className="flex justify-between pt-0">
                        <div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteMedication(medication.id)}
                          >
                            {t("delete", "Delete")}
                          </Button>
                        </div>
                        <div className="space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleLogMedication(medication)}
                          >
                            {t("logDose", "Log Dose")}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditMedication(medication)}
                          >
                            {t("edit", "Edit")}
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-lg">
              <svg className="mx-auto h-12 w-12 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-slate-900">{t("noMedications", "No Medications")}</h3>
              <p className="mt-1 text-sm text-slate-500">{t("noMedicationsDescription", "You haven't added any medication reminders yet.")}</p>
              <div className="mt-6">
                <Button
                  onClick={() => setReminderDialogOpen(true)}
                >
                  <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  {t("addFirstMedication", "Add Your First Medication")}
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="adherence" className="mt-6">
          {!medications || medications.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-lg">
              <AlertCircle className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-2 text-sm font-medium text-slate-900">{t("noMedicationsForAdherence", "No Medications")}</h3>
              <p className="mt-1 text-sm text-slate-500">{t("noMedicationsForAdherenceDesc", "You need to add medications before tracking adherence.")}</p>
              <div className="mt-6">
                <Button
                  onClick={() => {
                    setActiveTab("medications");
                    setReminderDialogOpen(true);
                  }}
                >
                  <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  {t("addMedication", "Add Medication")}
                </Button>
              </div>
            </div>
          ) : (
            <MedicationAdherence medications={medications} adherenceRecords={adherenceRecords} />
          )}
        </TabsContent>
      </Tabs>

      <div className="mt-10 bg-slate-50 p-6 rounded-lg border border-slate-200">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">
          {t("medicationManagementTips", "Medication Management Tips")}
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
            <div className="flex items-center mb-3">
              <Bell className="h-5 w-5 text-primary-500 mr-2" />
              <h3 className="font-medium text-slate-900">{t("setReminders", "Set Reminders")}</h3>
            </div>
            <p className="text-sm text-slate-600">
              {t("setRemindersDesc", "Use this app's reminder feature or set alarms on your phone. Place medications in visible locations as a visual reminder.")}
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
            <div className="flex items-center mb-3">
              <Calendar className="h-5 w-5 text-primary-500 mr-2" />
              <h3 className="font-medium text-slate-900">{t("useOrganizers", "Use Pill Organizers")}</h3>
            </div>
            <p className="text-sm text-slate-600">
              {t("useOrganizersDesc", "Weekly pill organizers help you track which medications you've taken and prevent double-dosing.")}
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
            <div className="flex items-center mb-3">
              <CalendarDays className="h-5 w-5 text-primary-500 mr-2" />
              <h3 className="font-medium text-slate-900">{t("establishRoutine", "Establish a Routine")}</h3>
            </div>
            <p className="text-sm text-slate-600">
              {t("establishRoutineDesc", "Take medications at the same time each day. Link medication times with daily activities like meals or brushing teeth.")}
            </p>
          </div>
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
                {t("offlineModeDescription", "You're currently in offline mode. Your medication logs are being saved locally and will sync when you reconnect.")}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}