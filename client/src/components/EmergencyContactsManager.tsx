import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

export const useEmergencyContacts = () => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const { toast } = useToast();

  // Load contacts from localStorage
  useEffect(() => {
    try {
      const storedContacts = localStorage.getItem('emergency-contacts');
      if (storedContacts) {
        setContacts(JSON.parse(storedContacts));
      }
    } catch (error) {
      console.error('Failed to load emergency contacts:', error);
    }
  }, []);

  // Save contacts to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('emergency-contacts', JSON.stringify(contacts));
    } catch (error) {
      console.error('Failed to save emergency contacts:', error);
      toast({
        title: "Error Saving Contacts",
        description: "There was a problem saving your emergency contacts.",
        variant: "destructive",
      });
    }
  }, [contacts, toast]);

  const addContact = (contact: Omit<EmergencyContact, 'id'>) => {
    const newContact = {
      ...contact,
      id: Date.now().toString(), // Simple ID generation
    };
    setContacts([...contacts, newContact]);
  };

  const updateContact = (id: string, updatedContact: Partial<EmergencyContact>) => {
    setContacts(
      contacts.map((contact) =>
        contact.id === id ? { ...contact, ...updatedContact } : contact
      )
    );
  };

  const removeContact = (id: string) => {
    setContacts(contacts.filter((contact) => contact.id !== id));
  };

  return {
    contacts,
    addContact,
    updateContact,
    removeContact,
  };
};

export default function EmergencyContactsManager() {
  const { t } = useLanguage();
  const { contacts, addContact, removeContact } = useEmergencyContacts();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    relationship: "",
  });

  const handleAddContact = () => {
    addContact(newContact);
    setNewContact({ name: "", phone: "", relationship: "" });
    setIsAddDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          {t("sos.emergencyContacts", "Emergency Contacts")}
        </h3>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          variant="outline"
          size="sm"
        >
          {t("sos.addEmergencyContact", "Add Contact")}
        </Button>
      </div>

      {contacts.length === 0 ? (
        <div className="text-center py-4 text-slate-500">
          {t("sos.noEmergencyContacts", "No emergency contacts added yet.")}
        </div>
      ) : (
        <div className="space-y-3">
          {contacts.map((contact) => (
            <Card key={contact.id}>
              <CardHeader className="py-3">
                <CardTitle className="text-base">{contact.name}</CardTitle>
                <CardDescription>{contact.relationship}</CardDescription>
              </CardHeader>
              <CardContent className="py-0">
                <p className="text-sm">{contact.phone}</p>
              </CardContent>
              <CardFooter className="py-2 justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeContact(contact.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  {t("common.delete", "Delete")}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {t("sos.addEmergencyContact", "Add Emergency Contact")}
            </DialogTitle>
            <DialogDescription>
              {t(
                "sos.addEmergencyContactDescription",
                "Add someone who should be notified in case of an emergency."
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">{t("sos.name", "Name")}</Label>
              <Input
                id="name"
                value={newContact.name}
                onChange={(e) =>
                  setNewContact({ ...newContact, name: e.target.value })
                }
                placeholder={t("sos.nameExample", "e.g. John Doe")}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">{t("sos.phone", "Phone Number")}</Label>
              <Input
                id="phone"
                value={newContact.phone}
                onChange={(e) =>
                  setNewContact({ ...newContact, phone: e.target.value })
                }
                placeholder={t("sos.phoneExample", "e.g. +91 9876543210")}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="relationship">
                {t("sos.relationship", "Relationship")}
              </Label>
              <Input
                id="relationship"
                value={newContact.relationship}
                onChange={(e) =>
                  setNewContact({
                    ...newContact,
                    relationship: e.target.value,
                  })
                }
                placeholder={t(
                  "sos.relationshipExample",
                  "e.g. Parent, Sibling, Friend"
                )}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleAddContact}>
              {t("common.save", "Save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}