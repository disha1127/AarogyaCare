import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useOffline } from "@/context/OfflineContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmergencyContactsManager, { useEmergencyContacts } from "./EmergencyContactsManager";
import { Loader2 } from "lucide-react";

export default function SOSButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const alarmSound = useRef<HTMLAudioElement | null>(null);
  const [isPlayingAlarm, setIsPlayingAlarm] = useState(false);
  
  const { t } = useLanguage();
  const { toast } = useToast();
  const { isOffline } = useOffline();
  const { contacts } = useEmergencyContacts();

  // Set up audio element on mount
  useEffect(() => {
    // Create alarm sound
    alarmSound.current = new Audio("https://bigsoundbank.com/UPLOAD/mp3/1482.mp3");
    alarmSound.current.loop = true;
    
    return () => {
      if (alarmSound.current) {
        alarmSound.current.pause();
        alarmSound.current = null;
      }
    };
  }, []);

  const handleSOSClick = () => {
    setIsDialogOpen(true);
    
    // Get user's location
    setIsLoadingLocation(true);
    setLocationError(null);
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(position);
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError(t("sos.locationError", "Could not access your location."));
          setIsLoadingLocation(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setLocationError(t("sos.geolocationNotSupported", "Geolocation is not supported by your browser."));
      setIsLoadingLocation(false);
    }
  };

  const toggleAlarm = () => {
    if (!alarmSound.current) return;
    
    if (isPlayingAlarm) {
      alarmSound.current.pause();
      alarmSound.current.currentTime = 0;
    } else {
      alarmSound.current.play().catch(error => {
        console.error("Error playing alarm sound:", error);
        toast({
          title: t("sos.audioError", "Audio Error"),
          description: t("sos.audioErrorDescription", "Could not play alarm sound. Check browser permissions."),
          variant: "destructive",
        });
      });
    }
    
    setIsPlayingAlarm(!isPlayingAlarm);
  };

  const handleSendAlert = () => {
    // Get current location URL for sharing
    let locationString = "";
    if (location) {
      const { latitude, longitude } = location.coords;
      locationString = `https://www.google.com/maps?q=${latitude},${longitude}`;
    }
    
    // In a real app, this would send SMS/notifications to emergency contacts
    // For demo purposes, we show toast notifications and log to console
    console.log("Emergency SOS triggered!");
    console.log("Contacts to notify:", contacts);
    console.log("Location to share:", locationString);
    
    if (contacts.length === 0) {
      toast({
        title: t("sos.noContactsWarning", "No Emergency Contacts"),
        description: t("sos.noContactsWarningDescription", "You haven't added any emergency contacts yet."),
        variant: "destructive",
      });
    } else {
      toast({
        title: t("sos.emergencyAlertSent", "Emergency Alert Sent"),
        description: t("sos.emergencyContactsNotified", "Your emergency contacts have been notified of your situation."),
        variant: "default",
      });
    }
    
    // Store alert in offline storage for synchronization when back online
    if (isOffline) {
      try {
        const pendingAlerts = JSON.parse(localStorage.getItem('pending-sos-alerts') || '[]');
        pendingAlerts.push({
          timestamp: new Date().toISOString(),
          location: location ? {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          } : null,
          contacts: contacts
        });
        localStorage.setItem('pending-sos-alerts', JSON.stringify(pendingAlerts));
      } catch (error) {
        console.error("Error storing offline SOS alert:", error);
      }
    }
    
    setIsDialogOpen(false);
  };

  return (
    <>
      <div className="fixed bottom-24 right-4 z-30 md:bottom-8 flex flex-col gap-2">
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full w-10 h-10 flex items-center justify-center shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
          aria-label={t("sos.settings", "SOS Settings")}
        >
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
        
        <button
          onClick={handleSOSClick}
          className="bg-red-500 hover:bg-red-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-transform hover:scale-105"
          aria-label={t("sos.emergencySOS", "Emergency SOS")}
        >
          <svg
            className="w-8 h-8"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </button>
      </div>

      {/* SOS Alert Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-red-500 flex items-center gap-2">
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              {t("sos.emergencyAlert", "Emergency Alert")}
            </DialogTitle>
            <DialogDescription>
              {t("sos.sosConfirmation", "Are you sure you want to send an emergency alert? This will notify your emergency contacts with your current location.")}
            </DialogDescription>
          </DialogHeader>
          
          {isLoadingLocation && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-red-500 mr-2" />
              <span>{t("sos.gettingLocation", "Getting your location...")}</span>
            </div>
          )}
          
          {locationError && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md text-sm">
              {locationError}
            </div>
          )}
          
          {location && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md text-sm">
              {t("sos.locationReady", "Your location is ready to share with emergency contacts.")}
            </div>
          )}
          
          <div className="flex justify-center my-2">
            <Button 
              variant={isPlayingAlarm ? "destructive" : "outline"} 
              onClick={toggleAlarm}
              className="w-full"
            >
              {isPlayingAlarm 
                ? t("sos.stopAlarm", "Stop Alarm Sound") 
                : t("sos.triggerAlarm", "Trigger Alarm Sound")}
            </Button>
          </div>
          
          <DialogFooter className="flex gap-2 sm:justify-start">
            <Button variant="destructive" onClick={handleSendAlert}>
              {t("sos.sendEmergencyAlert", "Send Emergency Alert")}
            </Button>
            <Button variant="outline" onClick={() => {
              setIsDialogOpen(false);
              if (isPlayingAlarm && alarmSound.current) {
                alarmSound.current.pause();
                alarmSound.current.currentTime = 0;
                setIsPlayingAlarm(false);
              }
            }}>
              {t("common.cancel", "Cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* SOS Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {t("sos.emergencySettings", "Emergency Settings")}
            </DialogTitle>
            <DialogDescription>
              {t("sos.emergencySettingsDescription", "Manage your emergency contacts and settings for the SOS feature.")}
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="contacts">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="contacts">
                {t("sos.emergencyContacts", "Emergency Contacts")}
              </TabsTrigger>
              <TabsTrigger value="settings">
                {t("sos.settings", "Settings")}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="contacts" className="mt-4">
              <EmergencyContactsManager />
            </TabsContent>
            
            <TabsContent value="settings" className="mt-4">
              <div className="space-y-4">
                <p className="text-sm text-slate-600">
                  {t("sos.offlineCapabilityExplanation", "The SOS feature works offline. Emergency alerts will be queued and sent when you regain internet connection.")}
                </p>
                
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-md text-sm">
                  <p className="font-medium">{t("sos.importantNote", "Important Note")}</p>
                  <p className="mt-1">
                    {t("sos.sosFeatureExplanation", "This SOS feature is for demonstration purposes only. In a real emergency, always call your local emergency services.")}
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
