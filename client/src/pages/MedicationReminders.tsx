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

// Dummy user ID - In a real app, this would come from authentication
const DUMMY_USER_ID = 1;

// Form schema extends the insert medication schema with validation
const formSchema = insertMedicationSchema.extend({
  // Additional validation rules
  reminderTimes: z.array(z.string()).min(1, "Select at least one time"),
  selectedDays: z.array(z.string()).optional(),
});

export default function MedicationReminders() {
  const { t, currentLanguage } = useLanguage();
  const { isOffline, getOfflineData, saveOfflineData } = useOffline();
  const { toast } = useToast();
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);

  // Fetch user's medications
  const { data: medications, isLoading } = useQuery({
    queryKey: [`/api/medications/user/${DUMMY_USER_ID}`],
    enabled: !isOffline
  });

  // Create form with validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: DUMMY_USER_ID,
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

  // Reset form when dialog closes
  useEffect(() => {
    if (!reminderDialogOpen) {
      setEditingMedication(null);
      form.reset({
        userId: DUMMY_USER_ID,
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
  }, [reminderDialogOpen, form]);

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

  // Create medication mutation
  const createMutation = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) => {
      return apiRequest("POST", "/api/medications", data);
    },
    onSuccess: () => {
      setReminderDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: [`/api/medications/user/${DUMMY_USER_ID}`] });
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
      queryClient.invalidateQueries({ queryKey: [`/api/medications/user/${DUMMY_USER_ID}`] });
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
      queryClient.invalidateQueries({ queryKey: [`/api/medications/user/${DUMMY_USER_ID}`] });
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

  return (
    <div className="container mx-auto max-w-7xl py-12 px-4 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{t("medicationReminders", "Medication Reminders")}</h1>
        <p className="text-slate-600 max-w-3xl">
          {t("medicationRemindersDescription", "Never miss your medications with personalized reminders. Set up your medication schedule and receive timely alerts.")}
        </p>
      </div>

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
                        <Input {...field} placeholder={t("enterInstructions", "E.g., Take with food")} />
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
                      <div className="grid grid-cols-3 gap-2">
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
                                      currentValues.filter((val) => val !== time)
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
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
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          {t("activateReminders", "Activate Reminders")}
                        </FormLabel>
                        <FormDescription>
                          {t("activateRemindersDesc", "Receive notifications for this medication")}
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
                
                <DialogFooter>
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {(createMutation.isPending || updateMutation.isPending) 
                      ? t("saving", "Saving...") 
                      : (editingMedication ? t("updateMedication", "Update Medication") : t("addMedication", "Add Medication"))}
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
          <div className="bg-primary-50 p-4 rounded-lg mb-8">
            <h3 className="font-medium text-primary-800 mb-2">{t("todaysMedications", "Today's Medications")}</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {medications
                .filter((med: Medication) => isMedicationActive(med) && isMedicationForToday(med))
                .map((medication: Medication) => (
                  <Card key={medication.id} className="border-primary-100">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{medication.name}</CardTitle>
                        <Badge variant={medication.isActive ? "default" : "outline"}>
                          {medication.isActive ? t("active", "Active") : t("inactive", "Inactive")}
                        </Badge>
                      </div>
                      <CardDescription>{medication.dosage} - {medication.frequency}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex flex-wrap gap-1 mb-2">
                        {(medication.reminderTimes as string[]).map((time, idx) => (
                          <Badge key={idx} variant="outline" className="bg-blue-50">
                            {time}
                          </Badge>
                        ))}
                      </div>
                      {medication.instructions && (
                        <p className="text-sm text-slate-600 italic">{medication.instructions}</p>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditMedication(medication)}
                      >
                        {t("edit", "Edit")}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteMedication(medication.id)}
                      >
                        {t("delete", "Delete")}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </div>

          <Separator />

          <h3 className="font-medium text-slate-800 mt-4 mb-2">{t("allMedications", "All Medications")}</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {medications.map((medication: Medication) => (
              <Card key={medication.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{medication.name}</CardTitle>
                    <Badge variant={medication.isActive ? "default" : "outline"}>
                      {medication.isActive ? t("active", "Active") : t("inactive", "Inactive")}
                    </Badge>
                  </div>
                  <CardDescription>{medication.dosage} - {medication.frequency}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="text-sm text-slate-500 mb-2">
                    <span className="font-medium">{t("duration", "Duration")}:</span>{" "}
                    {formatDate(medication.startDate, currentLanguage.code)}
                    {medication.endDate ? ` - ${formatDate(medication.endDate, currentLanguage.code)}` : ` - ${t("ongoing", "Ongoing")}`}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {(medication.reminderTimes as string[]).map((time, idx) => (
                      <Badge key={idx} variant="outline">
                        {time}
                      </Badge>
                    ))}
                  </div>
                  {medication.instructions && (
                    <p className="text-sm text-slate-600 italic">{medication.instructions}</p>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEditMedication(medication)}
                  >
                    {t("edit", "Edit")}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDeleteMedication(medication.id)}
                  >
                    {t("delete", "Delete")}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-50 rounded-lg">
          <svg className="mx-auto h-12 w-12 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-slate-900">{t("noMedications", "No Medications")}</h3>
          <p className="mt-1 text-sm text-slate-500">{t("noMedicationsDesc", "You haven't added any medication reminders yet.")}</p>
          <div className="mt-6">
            <Button 
              onClick={() => setReminderDialogOpen(true)}
              className="inline-flex items-center"
            >
              <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              {t("addMedication", "Add Medication")}
            </Button>
          </div>
        </div>
      )}

      <div className="mt-12 space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">{t("medicationTips", "Medication Tips")}</h2>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{t("consistencyMatters", "Consistency Matters")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                {t("consistencyMattersDesc", "Take your medications at the same time each day to establish a routine. This helps in maintaining consistent drug levels in your body.")}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{t("foodInteractions", "Food Interactions")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                {t("foodInteractionsDesc", "Some medications work better with food, while others should be taken on an empty stomach. Always follow your doctor's or pharmacist's advice.")}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{t("storeMedicationsProperly", "Store Medications Properly")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                {t("storeMedicationsProperlyDesc", "Keep medications in a cool, dry place away from direct sunlight. Some may require refrigeration. Always check the storage instructions.")}
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
                {t("offlineMedicationsInfo", "You're currently offline. Your medication reminders are available, but you can't add new ones until you reconnect.")}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
