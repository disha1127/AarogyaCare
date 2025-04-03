/**
 * Save data to browser's localStorage for offline access
 * @param key - Storage key
 * @param data - Data to store
 */
export async function saveToCache(key: string, data: any): Promise<void> {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving data to cache (${key}):`, error);
    throw error;
  }
}

/**
 * Load data from browser's localStorage
 * @param key - Storage key
 * @returns The stored data or null if not found
 */
export async function loadFromCache<T>(key: string): Promise<T | null> {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) as T : null;
  } catch (error) {
    console.error(`Error loading data from cache (${key}):`, error);
    throw error;
  }
}

/**
 * Clear data from browser's localStorage
 * @param key - Optional storage key. If not provided, clears all cached data.
 */
export async function clearCache(key?: string): Promise<void> {
  try {
    if (key) {
      localStorage.removeItem(key);
    } else {
      localStorage.clear();
    }
  } catch (error) {
    console.error(`Error clearing cache${key ? ` for ${key}` : ''}:`, error);
    throw error;
  }
}

/**
 * Register the service worker for PWA offline capabilities
 */
export async function registerServiceWorker(): Promise<void> {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker registered with scope:', registration.scope);
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
}

/**
 * Check if a specific API endpoint data is available offline
 * @param endpoint - API endpoint to check
 * @returns Boolean indicating if the data is available offline
 */
export async function isDataAvailableOffline(endpoint: string): Promise<boolean> {
  try {
    const offlineEndpoints = JSON.parse(localStorage.getItem('offlineEndpoints') || '[]');
    return offlineEndpoints.includes(endpoint);
  } catch (error) {
    console.error('Error checking offline data availability:', error);
    return false;
  }
}

/**
 * Mark an API endpoint's data as available offline
 * @param endpoint - API endpoint
 * @param data - The data to cache
 */
export async function markDataAsOfflineAvailable(endpoint: string, data: any): Promise<void> {
  try {
    // Save the actual data
    await saveToCache(`offline_${endpoint}`, data);
    
    // Update the list of offline-available endpoints
    const offlineEndpoints = JSON.parse(localStorage.getItem('offlineEndpoints') || '[]');
    if (!offlineEndpoints.includes(endpoint)) {
      offlineEndpoints.push(endpoint);
      localStorage.setItem('offlineEndpoints', JSON.stringify(offlineEndpoints));
    }
  } catch (error) {
    console.error('Error marking data as offline available:', error);
    throw error;
  }
}

/**
 * Get cached data for an offline endpoint
 * @param endpoint - API endpoint
 * @returns The cached data or null if not available
 */
export async function getOfflineData<T>(endpoint: string): Promise<T | null> {
  return loadFromCache<T>(`offline_${endpoint}`);
}
