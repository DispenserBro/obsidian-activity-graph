import { ActivityGraphSettings } from './types/ActivityGraphSettings';

// View type identifier
export const VIEW_TYPE_ACTIVITY_GRAPH = 'activity-graph-view';

// Default plugin settings
export const DEFAULT_SETTINGS: Partial<ActivityGraphSettings> = {
    displayPeriod: '12months',
    customStartDate: '',
    customEndDate: '',
    displayOnlyTasks: false,
    displayStyle: 'commit-graph',
    highlightToday: true,
    highlightColor: '#7c3aed',
    firstDayOfWeek: 0, // 0 = Sunday, 1 = Monday
    activityDotPosition: 'center',
    // Daily Notes settings
    customDailyNotesPath: '',
    customDailyNotesFormat: 'YYYY-MM-DD',
    useDailyNotesPlugin: true,
    // Activity level colors - Light theme
    lightTheme: {
        level0: '#ebedf0',
        level1: '#9be9a8',
        level2: '#40c463',
        level3: '#30a14e',
        level4: '#216e39'
    },
    // Activity level colors - Dark theme
    darkTheme: {
        level0: '#161b22',
        level1: '#0e4429',
        level2: '#006d32',
        level3: '#26a641',
        level4: '#39d353'
    }
};

// Graph dimensions
export const SQUARE_SIZE = 12;
export const GAP = 3;
