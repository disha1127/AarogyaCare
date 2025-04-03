import { match } from '@formatjs/intl-localematcher';

/**
 * Match the best available locale based on user preferences and available languages
 * @param preferredLocales - Array of user's preferred locale codes (e.g. ['hi-IN', 'en-US'])
 * @param availableLocales - Array of available locale codes supported by the app
 * @param defaultLocale - Default locale to use if no match is found
 * @returns The best matching locale code
 */
export function matchLocale(
  preferredLocales: string[], 
  availableLocales: string[], 
  defaultLocale: string = 'en'
): string {
  try {
    // Format locales to ensure they're compatible with intl-localematcher
    const formattedPreferred = preferredLocales.map(locale => 
      locale.includes('-') ? locale : locale.toLowerCase()
    );
    
    const formattedAvailable = availableLocales.map(locale => 
      locale.includes('-') ? locale : locale.toLowerCase()
    );
    
    return match(formattedPreferred, formattedAvailable, defaultLocale);
  } catch (error) {
    console.error('Error matching locale:', error);
    return defaultLocale;
  }
}
