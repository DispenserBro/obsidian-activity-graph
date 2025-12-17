/**
 * Localization module - Internationalization support
 */
import Polyglot from 'node-polyglot';
import { App } from 'obsidian';
import { getLocale as getLocaleTranslations, isLocaleAvailable } from './locales/index';
import type { LocaleStrings } from './types/LocaleStrings';
// Load all moment locales
import 'moment/min/locales';

// Polyglot options interface
type PolyglotOptions = Polyglot.InterpolationOptions;

// Current locale and Polyglot instance
let currentLocale: string = 'en';
let polyglot: InstanceType<typeof Polyglot> | null = null;
let currentPhrases: LocaleStrings | null = null; // Store original phrases

/**
 * Initialize locale from Obsidian settings
 */
export function initLocale(app: App): string {
    // Get language from Obsidian's settings
    interface VaultWithConfig {
        config?: {
            lang?: string;
        };
    }
    const vault = app.vault as VaultWithConfig;
    const obsidianLang = vault?.config?.lang || 
                         window.localStorage.getItem('language') || 
                         'en';
    
    // Extract base language code (e.g., 'ru' from 'ru-RU')
    const baseLang = obsidianLang.split('-')[0].toLowerCase();
    
    // Set locale if available, otherwise fallback to English
    currentLocale = isLocaleAvailable(baseLang) ? baseLang : 'en';
    
    // Get translations (synchronous now)
    const phrases = getLocaleTranslations(currentLocale);
    currentPhrases = phrases; // Store original object
    
    // Initialize Polyglot
    polyglot = new Polyglot({
        locale: currentLocale,
        phrases: phrases as unknown as Record<string, string> // Polyglot expects Record<string, string>
    });
    
    // Set moment.js locale
    setMomentLocale(baseLang);
    
    return currentLocale;
}

/**
 * Set moment.js locale
 */
function setMomentLocale(locale: string): void {
    // All locales are already loaded via 'moment/min/locales'
    // Just set the locale
    window.moment.locale(locale);
}

/**
 * Get translation by key
 */
export function t(key: string, options: PolyglotOptions = {}): string | string[] {
    if (!polyglot || !currentPhrases) {
        console.warn('Polyglot not initialized yet, returning key');
        return key;
    }
    
    // Get the phrase from original object
    const phrase = currentPhrases[key as keyof LocaleStrings];
    
    // If phrase is undefined, return key
    if (phrase === undefined) {
        return key;
    }
    
    // If phrase is an array, return it directly
    if (Array.isArray(phrase)) {
        return phrase;
    }
    
    // Otherwise use polyglot's t() method for string interpolation
    return polyglot.t(key, options);
}

/**
 * Get translation as string (safe version for UI elements that require string only)
 */
export function ts(key: string, options: PolyglotOptions = {}): string {
    const result = t(key, options);
    return Array.isArray(result) ? result.join(', ') : result;
}

/**
 * Get current locale
 */
export function getLocale(): string {
    return currentLocale;
}

/**
 * Get month name (full)
 */
export function getMonthFull(monthIndex: number): string {
    const months = t('monthsFull') as string[];
    return months[monthIndex];
}

/**
 * Get month name (short)
 */
export function getMonthShort(monthIndex: number): string {
    const months = t('monthsShort') as string[];
    return months[monthIndex];
}

/**
 * Get day names (short)
 */
export function getDaysShort(firstDayOfWeek: 0 | 1 = 0): string[] {
    const days = [...(t('daysShort') as string[])];
    if (firstDayOfWeek === 1) {
        // Move Sunday to the end for Monday start
        const sunday = days.shift();
        if (sunday) days.push(sunday);
    }
    return days;
}

/**
 * Get day labels for commit graph
 */
export function getDayLabels(firstDayOfWeek: 0 | 1 = 0): string[] {
    const days = [...(t('daysShort') as string[])];
    if (firstDayOfWeek === 1) {
        // Move Sunday to the end for Monday start
        const sunday = days.shift();
        if (sunday) days.push(sunday);
    }
    // Return Mon, Wed, Fri labels (indices 1, 3, 5 for Sunday start or 0, 2, 4 for Monday start)
    if (firstDayOfWeek === 1) {
        return [days[0], days[2], days[4]]; // Mon, Wed, Fri
    }
    return [days[1], days[3], days[5]]; // Mon, Wed, Fri
}
