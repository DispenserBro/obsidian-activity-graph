/**
 * English translations
 */
import { LocaleStrings } from '../types/LocaleStrings';

export const STRINGS_EN: LocaleStrings = {
    // View
    viewTitle: 'Activity graph',
    activityGraphTitle: 'Your activity graph',
    tasksGraphTitle: 'Completed tasks graph',
    
    // Legend
    legendLess: 'Less',
    legendMore: 'More',
    
    // Tooltip
    tooltipActivities: 'Activities on',
    
    // Month names
    monthsFull: ['January', 'February', 'March', 'April', 'May', 'June', 
                 'July', 'August', 'September', 'October', 'November', 'December'],
    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    
    // Day names
    daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    dayLabels: ['Mon', 'Wed', 'Fri'],
    
    // Settings
    settingsTitle: 'Activity graph',
    
    settingHighlightToday: 'Highlight current day',
    settingHighlightTodayDesc: 'Add a visual highlight to the current day on the graph',
    
    settingHighlightColor: 'Highlight color',
    settingHighlightColorDesc: 'Choose the color for the today highlight',
    
    settingDisplayOnlyTasks: 'Display only tasks',
    settingDisplayOnlyTasksDesc: 'Show completed tasks instead of file activity. Uses tasks plugin format (✅ YYYY-MM-DD or done:: YYYY-MM-DD)',
    
    settingDisplayStyle: 'Display style',
    settingDisplayStyleDesc: 'Choose how to display the activity graph',
    styleCommitGraph: 'Commit graph',
    styleCalendar: 'Calendar',
    styleCalendarSheet: 'Calendar sheet',
    
    settingActivityDotPosition: 'Activity dot position',
    settingActivityDotPositionDesc: 'Choose where to display the activity dot in calendar sheet view',
    positionCenter: 'Center (behind number)',
    positionTopLeft: 'Top left',
    positionTopRight: 'Top right',
    positionBottomLeft: 'Bottom left',
    positionBottomRight: 'Bottom right',
    
    settingDisplayPeriod: 'Display period',
    settingDisplayPeriodDesc: 'Choose the time period to display in the activity graph',
    period1Month: '1 month',
    period3Months: '3 months',
    period6Months: '6 months',
    period12Months: '12 months',
    periodCustom: 'Custom period',
    
    settingCustomDateRange: 'Custom date range',
    settingStartDate: 'Start date',
    settingStartDateDesc: 'Select the start date for the custom period',
    settingEndDate: 'End date',
    settingEndDateDesc: 'Select the end date for the custom period',
    
    settingActivityColors: 'Activity level colors',
    settingLightTheme: 'Light theme',
    settingDarkTheme: 'Dark theme',
    settingLevel0: 'Level 0 (no activity)',
    settingLevel1: 'Level 1 (low)',
    settingLevel2: 'Level 2 (medium)',
    settingLevel3: 'Level 3 (high)',
    settingLevel4: 'Level 4 (very high)',
    settingResetColors: 'Reset colors',
    settingResetColorsDesc: 'Reset all activity colors to default values',
    settingResetButton: 'Reset',
    
    settingFirstDayOfWeek: 'First day of week',
    settingFirstDayOfWeekDesc: 'Choose which day the week starts on',
    firstDaySunday: 'Sunday',
    firstDayMonday: 'Monday',
    
    // Daily Notes settings
    settingDailyNotes: 'Daily notes integration',
    settingUseDailyNotesPlugin: 'Use daily notes plugin settings',
    settingUseDailyNotesPluginDesc: 'Use settings from daily notes plugin, or configure custom path and format',
    settingCustomDailyNotesPath: 'Custom daily notes path',
    settingCustomDailyNotesPathDesc: 'Path where daily notes are stored (e.g., "Daily notes" or leave empty for root)',
    settingCustomDailyNotesFormat: 'Custom date format',
    settingCustomDailyNotesFormatDesc: 'Date format using moment.js syntax (e.g., YYYY-MM-DD, YYYY/MM/DD, DD-MM-YYYY)',
    settingDailyNotesPreviewExample: 'Example:',
    
    // Navigation
    navPrevMonth: 'Previous month',
    navNextMonth: 'Next month',
};
