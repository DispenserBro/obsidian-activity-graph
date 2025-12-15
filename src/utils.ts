import moment from 'moment';
import { App } from 'obsidian';
import { ActivityGraphSettings } from './types/ActivityGraphSettings';
import { DailyNotesSettings } from './types/DailyNotesSettings';

// Extended App interface for internal plugins
interface AppWithPlugins extends App {
    internalPlugins?: {
        getPluginById?: (id: string) => {
            enabled?: boolean;
            instance?: {
                options?: DailyNotesSettings;
            };
        } | undefined;
    };
    plugins?: {
        getPlugin?: (id: string) => {
            settings?: {
                daily?: DailyNotesSettings;
            };
        } | undefined;
    };
}

/**
 * Format a date to YYYY-MM-DD string
 */
export function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Get Daily Notes plugin settings
 */
export function getDailyNotesSettings(app: App, customSettings?: Partial<ActivityGraphSettings>): DailyNotesSettings {
    // If using custom settings, return them
    if (customSettings && !customSettings.useDailyNotesPlugin) {
        return {
            folder: customSettings.customDailyNotesPath || '',
            format: customSettings.customDailyNotesFormat || 'YYYY-MM-DD',
            template: ''
        };
    }

    const appWithPlugins = app as AppWithPlugins;

    // Try to get settings from Daily Notes core plugin
    const dailyNotesPlugin = appWithPlugins.internalPlugins?.getPluginById?.('daily-notes');
    if (dailyNotesPlugin?.enabled && dailyNotesPlugin?.instance?.options) {
        return dailyNotesPlugin.instance.options;
    }

    // Try to get settings from Periodic Notes community plugin
    const periodicNotes = appWithPlugins.plugins?.getPlugin?.('periodic-notes');
    if (periodicNotes?.settings?.daily) {
        return periodicNotes.settings.daily;
    }

    // Default settings
    return {
        folder: '',
        format: 'YYYY-MM-DD',
        template: ''
    };
}

/**
 * Format daily note filename based on date and format string
 */
export async function formatDailyNoteFilename(date: Date, format: string): Promise<string> {
    // Moment locale is already set globally in initLocale()
    // Just format the date with the current locale
    return moment(date).format(format || 'YYYY-MM-DD');
}

/**
 * Get example daily note path for preview
 */
export async function getDailyNotePath(app: App, customSettings?: Partial<ActivityGraphSettings>, previewDate: Date | null = null): Promise<string> {
    const settings = getDailyNotesSettings(app, customSettings);
    const date = previewDate || new Date();
    const filename = await formatDailyNoteFilename(date, settings.format || 'YYYY-MM-DD');
    const folder = settings.folder || '';
    
    return folder ? `${folder}/${filename}.md` : `${filename}.md`;
}

/**
 * Get activity level based on count (0-4)
 */
export function getActivityLevel(count: number): 0 | 1 | 2 | 3 | 4 {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 5) return 2;
    if (count <= 10) return 3;
    return 4;
}

/**
 * Calculate date range based on settings
 */
export function getDateRange(settings: ActivityGraphSettings): { startDate: Date; endDate: Date } {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    let startDate = new Date(today);
    
    switch (settings.displayPeriod) {
        case '1month':
            startDate.setMonth(today.getMonth() - 1);
            break;
        case '3months':
            startDate.setMonth(today.getMonth() - 3);
            break;
        case '6months':
            startDate.setMonth(today.getMonth() - 6);
            break;
        case '12months':
            startDate.setFullYear(today.getFullYear() - 1);
            break;
        case 'custom':
            if (settings.customStartDate && settings.customEndDate) {
                startDate = new Date(settings.customStartDate);
                const endDate = new Date(settings.customEndDate);
                endDate.setHours(23, 59, 59, 999);
                return { startDate, endDate };
            } else {
                startDate.setFullYear(today.getFullYear() - 1);
            }
            break;
        default:
            startDate.setFullYear(today.getFullYear() - 1);
    }
    
    startDate.setHours(0, 0, 0, 0);
    return { startDate, endDate: today };
}

/**
 * Get all months in a date range
 */
export function getMonthsInRange(startDate: Date, endDate: Date): Date[] {
    const months: Date[] = [];
    const current = new Date(startDate);
    current.setDate(1);
    
    while (current <= endDate) {
        months.push(new Date(current));
        current.setMonth(current.getMonth() + 1);
    }
    
    return months;
}
