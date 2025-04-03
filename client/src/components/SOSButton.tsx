import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function SOSButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleSOSClick = () => {
    setIsDialogOpen(true);
  };

  const handleSendAlert = () => {
    // In a real app, this would send an alert to emergency contacts
    // For demo purposes, we'll just show a toast notification
    toast({
      title: t("emergencyAlertSent", "Emergency Alert Sent"),
      description: t("emergencyContactsNotified", "Your emergency contacts have been notified of your situation."),
      variant: "default",
    });
    setIsDialogOpen(false);
  };

  return (
    <>
      <div className="fixed bottom-24 right-4 z-30 md:bottom-8">
        <button
          onClick={handleSOSClick}
          className="bg-red-500 hover:bg-red-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-transform hover:scale-105"
          aria-label={t("emergencySOS", "Emergency SOS")}
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
              {t("emergencyAlert", "Emergency Alert")}
            </DialogTitle>
            <DialogDescription>
              {t("sosConfirmation", "Are you sure you want to send an emergency alert? This will notify your emergency contacts with your current location.")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-start">
            <Button variant="destructive" onClick={handleSendAlert}>
              {t("sendEmergencyAlert", "Send Emergency Alert")}
            </Button>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {t("cancel", "Cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
