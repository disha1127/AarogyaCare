import React, { createContext, useContext, useState, useEffect } from 'react';
import { saveToCache, loadFromCache, clearCache } from '@/utils/offline';

interface OfflineContextType {
  isOffline: boolean;
  saveData: (key: string, data: any) => Promise<void>;
  loadData: <T>(key: string, defaultValue?: T) => Promise<T | undefined>;
  clearData: (key?: string) => Promise<void>;
}

const OfflineContext = createContext<OfflineContextType>({
  isOffline: false,
  saveData: async () => {},
  loadData: async () => undefined,
  clearData: async () => {},
});

export const useOffline = () => useContext(OfflineContext);

export const OfflineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOffline, setIsOffline] = useState<boolean>(
    typeof navigator !== 'undefined' ? !navigator.onLine : false
  );

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const saveData = async (key: string, data: any) => {
    try {
      await saveToCache(key, data);
    } catch (error) {
      console.error(`Failed to save data for key ${key}:`, error);
    }
  };

  const loadData = async <T,>(key: string, defaultValue?: T): Promise<T | undefined> => {
    try {
      const data = await loadFromCache<T>(key);
      return data !== null ? data : defaultValue;
    } catch (error) {
      console.error(`Failed to load data for key ${key}:`, error);
      return defaultValue;
    }
  };

  const clearData = async (key?: string) => {
    try {
      await clearCache(key);
    } catch (error) {
      console.error(`Failed to clear cache${key ? ` for key ${key}` : ''}:`, error);
    }
  };

  return (
    <OfflineContext.Provider value={{ isOffline, saveData, loadData, clearData }}>
      {children}
    </OfflineContext.Provider>
  );
};
