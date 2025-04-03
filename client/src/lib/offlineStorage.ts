/**
 * Save data to offline storage using IndexedDB
 * @param key Storage key
 * @param data Data to store
 */
export async function saveToOfflineStorage<T>(key: string, data: T): Promise<void> {
  // Check if IndexedDB is available
  if (!('indexedDB' in window)) {
    // Fall back to localStorage for simple data
    try {
      localStorage.setItem(`arogya-${key}`, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      throw error;
    }
    return;
  }

  return new Promise((resolve, reject) => {
    const dbName = 'arogyaHealthcare';
    const storeName = 'offlineData';
    const version = 1;
    
    const request = indexedDB.open(dbName, version);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id' });
      }
    };
    
    request.onerror = (event) => {
      reject(new Error('Error opening IndexedDB'));
    };
    
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      const transaction = db.transaction([storeName], 'readwrite');
      const objectStore = transaction.objectStore(storeName);
      
      const storeRequest = objectStore.put({
        id: key,
        data: data,
        timestamp: new Date().getTime()
      });
      
      storeRequest.onsuccess = () => {
        resolve();
      };
      
      storeRequest.onerror = () => {
        reject(new Error('Error storing data in IndexedDB'));
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    };
  });
}

/**
 * Load data from offline storage
 * @param key Storage key
 * @returns The stored data or null if not found
 */
export async function loadFromOfflineStorage<T>(key: string): Promise<T | null> {
  // Check if IndexedDB is available
  if (!('indexedDB' in window)) {
    // Fall back to localStorage for simple data
    try {
      const data = localStorage.getItem(`arogya-${key}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return null;
    }
  }

  return new Promise((resolve, reject) => {
    const dbName = 'arogyaHealthcare';
    const storeName = 'offlineData';
    const version = 1;
    
    const request = indexedDB.open(dbName, version);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id' });
      }
    };
    
    request.onerror = () => {
      reject(new Error('Error opening IndexedDB'));
    };
    
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      try {
        const transaction = db.transaction([storeName], 'readonly');
        const objectStore = transaction.objectStore(storeName);
        
        const getRequest = objectStore.get(key);
        
        getRequest.onsuccess = () => {
          const result = getRequest.result;
          if (result) {
            resolve(result.data as T);
          } else {
            resolve(null);
          }
        };
        
        getRequest.onerror = () => {
          reject(new Error('Error retrieving data from IndexedDB'));
        };
        
        transaction.oncomplete = () => {
          db.close();
        };
      } catch (error) {
        db.close();
        reject(error);
      }
    };
  });
}

/**
 * Clear all offline storage data
 */
export async function clearOfflineStorage(): Promise<void> {
  // Clear localStorage data
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('arogya-')) {
      localStorage.removeItem(key);
    }
  });

  // Clear IndexedDB data if available
  if ('indexedDB' in window) {
    return new Promise((resolve, reject) => {
      const dbName = 'arogyaHealthcare';
      const request = indexedDB.deleteDatabase(dbName);
      
      request.onerror = () => {
        reject(new Error('Error deleting IndexedDB database'));
      };
      
      request.onsuccess = () => {
        resolve();
      };
    });
  }
}
