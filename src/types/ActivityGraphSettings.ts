import { ColorScheme } from './ColorScheme';

/**
 * Plugin settings
 */
export interface ActivityGraphSettings {
    // Display settings
    highlightToday: boolean;
    highlightColor: string;
    displayOnlyTasks: boolean;
    displayStyle: 'commit-graph' | 'calendar';
    displayPeriod: '1month' | '3months' | '6months' | '12months' | 'custom';
    firstDayOfWeek: 0 | 1; // 0 = Sunday, 1 = Monday
    
    // Custom date range
    customStartDate: string;
    customEndDate: string;
    
    // Daily Notes integration
    useDailyNotesPlugin: boolean;
    customDailyNotesPath: string;
    customDailyNotesFormat: string;
    
    // Color schemes
    lightTheme: ColorScheme;
    darkTheme: ColorScheme;
}
