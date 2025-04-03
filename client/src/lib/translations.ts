/**
 * Format a translation key using the given messages
 * @param messages The translations object
 * @param key The key to look up
 * @param defaultValue Default value if the key is not found
 * @returns The translated string
 */
export function formatIntl(
  messages: Record<string, string>,
  key: string,
  defaultValue?: string
): string {
  return messages[key] || defaultValue || key;
}

/**
 * Get the best match for a user's language preference
 * @param languages Array of language codes the user accepts
 * @param supportedLanguages Array of supported language codes
 * @param defaultLanguage Default language code
 * @returns The best matching language code
 */
export function getBestMatchLanguage(
  languages: string[],
  supportedLanguages: string[],
  defaultLanguage: string = "en"
): string {
  if (!languages || languages.length === 0) {
    return defaultLanguage;
  }

  // Look for exact matches first
  for (const lang of languages) {
    if (supportedLanguages.includes(lang)) {
      return lang;
    }
  }

  // Look for partial matches (e.g., 'en-US' matches 'en')
  for (const lang of languages) {
    const baseLang = lang.split("-")[0];
    if (supportedLanguages.includes(baseLang)) {
      return baseLang;
    }
  }

  return defaultLanguage;
}
