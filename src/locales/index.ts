/**
 * Central export point for internationalization
 * Loads the appropriate language based on Obsidian's language setting
 */
import { LocaleStrings } from '../types/LocaleStrings';
import { STRINGS_EN } from './en';
import { STRINGS_RU } from './ru';

// All available translations
const TRANSLATIONS: Record<string, LocaleStrings> = {
    en: STRINGS_EN,
    ru: STRINGS_RU
};

// Available locales
const AVAILABLE_LOCALES: string[] = ['en', 'ru'];

/**
 * Get list of available locale codes
 */
export function getAvailableLocales(): string[] {
    return AVAILABLE_LOCALES;
}

/**
 * Get locale translations
 * @param {string} locale - Locale code (e.g., 'en', 'ru')
 * @returns {Object} Locale translations object
 */
export function getLocale(locale: string): LocaleStrings {
    return TRANSLATIONS[locale] || TRANSLATIONS['en'];
}

/**
 * Check if locale is available
 * @param {string} locale - Locale code
 * @returns {boolean}
 */
export function isLocaleAvailable(locale: string): boolean {
    return AVAILABLE_LOCALES.includes(locale);
}
