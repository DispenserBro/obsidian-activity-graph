/**
 * English translations
 */
import { LocaleStrings } from '../types/LocaleStrings';

export const STRINGS_EN: LocaleStrings = {
    // View
    viewTitle: 'Activity Graph',
    activityGraphTitle: 'Your Activity Graph',
    tasksGraphTitle: 'Completed Tasks Graph',
    
    // Legend
    legendLess: 'Less',
    legendMore: 'More',
    
    // Tooltip
    tooltipActivities: 'activities on',
    
    // Month names
    monthsFull: ['January', 'February', 'March', 'April', 'May', 'June', 
                 'July', 'August', 'September', 'October', 'November', 'December'],
    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    
    // Day names
    daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    dayLabels: ['Mon', 'Wed', 'Fri'],
    
    // Settings
    settingsTitle: 'Activity Graph Settings',
    
    settingHighlightToday: 'Highlight Today',
    settingHighlightTodayDesc: 'Add a visual highlight to the current day on the graph',
    
    settingHighlightColor: 'Highlight Color',
    settingHighlightColorDesc: 'Choose the color for the today highlight',
    
    settingDisplayOnlyTasks: 'Display only Tasks',
    settingDisplayOnlyTasksDesc: 'Show completed tasks instead of file activity. Uses Tasks plugin format (✅ YYYY-MM-DD or done:: YYYY-MM-DD)',
    
    settingDisplayStyle: 'Display Style',
    settingDisplayStyleDesc: 'Choose how to display the activity graph',
    styleCommitGraph: 'Commit Graph',
    styleCalendar: 'Calendar',
    
    settingDisplayPeriod: 'Display Period',
    settingDisplayPeriodDesc: 'Choose the time period to display in the activity graph',
    period1Month: '1 Month',
    period3Months: '3 Months',
    period6Months: '6 Months',
    period12Months: '12 Months',
    periodCustom: 'Custom Period',
    
    settingCustomDateRange: 'Custom Date Range',
    settingStartDate: 'Start Date',
    settingStartDateDesc: 'Select the start date for the custom period',
    settingEndDate: 'End Date',
    settingEndDateDesc: 'Select the end date for the custom period',
    
    settingActivityColors: 'Activity Level Colors',
    settingLightTheme: 'Light Theme',
    settingDarkTheme: 'Dark Theme',
    settingLevel0: 'Level 0 (No activity)',
    settingLevel1: 'Level 1 (Low)',
    settingLevel2: 'Level 2 (Medium)',
    settingLevel3: 'Level 3 (High)',
    settingLevel4: 'Level 4 (Very High)',
    settingResetColors: 'Reset Colors',
    settingResetColorsDesc: 'Reset all activity colors to default values',
    settingResetButton: 'Reset',
    
    settingFirstDayOfWeek: 'First Day of Week',
    settingFirstDayOfWeekDesc: 'Choose which day the week starts on',
    firstDaySunday: 'Sunday',
    firstDayMonday: 'Monday',
    
    // Daily Notes settings
    settingDailyNotes: 'Daily Notes Settings',
    settingUseDailyNotesPlugin: 'Use Daily Notes Plugin Settings',
    settingUseDailyNotesPluginDesc: 'Use settings from Daily Notes plugin, or configure custom path and format',
    settingCustomDailyNotesPath: 'Custom Daily Notes Path',
    settingCustomDailyNotesPathDesc: 'Path where daily notes are stored (e.g., "Daily Notes" or leave empty for root)',
    settingCustomDailyNotesFormat: 'Custom Date Format',
    settingCustomDailyNotesFormatDesc: 'Date format using moment.js syntax (e.g., YYYY-MM-DD, YYYY/MM/DD, DD-MM-YYYY)',
    settingDailyNotesPreviewExample: 'Example:',
    
    // Navigation
    navPrevMonth: 'Previous month',
    navNextMonth: 'Next month',
};
