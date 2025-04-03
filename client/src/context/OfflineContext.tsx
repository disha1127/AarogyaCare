import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { saveToOfflineStorage, loadFromOfflineStorage } from "@/lib/offlineStorage";

interface OfflineContextType {
  isOffline: boolean;
  saveOfflineData: <T>(key: string, data: T) => Promise<void>;
  getOfflineData: <T>(key: string) => Promise<T | null>;
  syncOfflineData: () => Promise<void>;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export function OfflineProvider({ children }: { children: ReactNode }) {
  const [isOffline, setIsOffline] = useState<boolean>(false);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      syncOfflineData();
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    // Check initial state
    setIsOffline(!navigator.onLine);

    // Add event listeners
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const saveOfflineData = async <T,>(key: string, data: T): Promise<void> => {
    try {
      await saveToOfflineStorage(key, data);
    } catch (error) {
      console.error("Failed to save offline data:", error);
    }
  };

  const getOfflineData = async <T,>(key: string): Promise<T | null> => {
    try {
      return await loadFromOfflineStorage<T>(key);
    } catch (error) {
      console.error("Failed to load offline data:", error);
      return null;
    }
  };

  const syncOfflineData = async (): Promise<void> => {
    // If back online, sync any pending data
    if (navigator.onLine) {
      // Implementation depends on specific data that needs syncing
      console.log("Device is online. Syncing offline data...");
      // Would implement API calls to sync here
    }
  };

  return (
    <OfflineContext.Provider value={{
      isOffline,
      saveOfflineData,
      getOfflineData,
      syncOfflineData
    }}>
      {children}
    </OfflineContext.Provider>
  );
}

export function useOffline() {
  const context = useContext(OfflineContext);
  if (context === undefined) {
    throw new Error("useOffline must be used within an OfflineProvider");
  }
  return context;
}
