import { ColorScheme } from './ColorScheme';

/**
 * Activity dot position for calendar sheet view
 */
export type ActivityDotPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';

/**
 * Plugin settings
 */
export interface ActivityGraphSettings {
    // Display settings
    highlightToday: boolean;
    highlightColor: string;
    displayOnlyTasks: boolean;
    displayStyle: 'commit-graph' | 'calendar' | 'calendar-sheet';
    displayPeriod: '1month' | '3months' | '6months' | '12months' | 'custom';
    firstDayOfWeek: 0 | 1; // 0 = Sunday, 1 = Monday
    
    // Calendar Sheet settings
    activityDotPosition: ActivityDotPosition;
    
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
