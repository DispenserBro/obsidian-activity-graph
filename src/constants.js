// View type identifier
export const VIEW_TYPE_ACTIVITY_GRAPH = 'activity-graph-view';

// Default plugin settings
export const DEFAULT_SETTINGS = {
    periodType: '12months',
    customStartDate: '',
    customEndDate: '',
    displayOnlyTasks: false,
    displayStyle: 'commitGraph',
    highlightToday: true,
    highlightColor: '#7c3aed',
    // Activity level colors - Light theme
    lightLevel0: '#ebedf0',
    lightLevel1: '#9be9a8',
    lightLevel2: '#40c463',
    lightLevel3: '#30a14e',
    lightLevel4: '#216e39',
    // Activity level colors - Dark theme
    darkLevel0: '#161b22',
    darkLevel1: '#0e4429',
    darkLevel2: '#006d32',
    darkLevel3: '#26a641',
    darkLevel4: '#39d353'
};

// Month names
export const MONTH_NAMES_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const MONTH_NAMES_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 
                                 'July', 'August', 'September', 'October', 'November', 'December'];

// Day names
export const DAY_NAMES_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const DAY_LABELS = ['Mon', 'Wed', 'Fri'];

// Graph dimensions
export const SQUARE_SIZE = 12;
export const GAP = 3;
