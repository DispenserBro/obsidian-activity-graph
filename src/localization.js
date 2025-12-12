/**
 * Localization module - Internationalization support
 */

// English translations (default)
const en = {
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
    
    // Navigation
    navPrevMonth: 'Previous month',
    navNextMonth: 'Next month',
};

// Russian translations
const ru = {
    // View
    viewTitle: 'График активности',
    activityGraphTitle: 'Ваш график активности',
    tasksGraphTitle: 'График выполненных задач',
    
    // Legend
    legendLess: 'Меньше',
    legendMore: 'Больше',
    
    // Tooltip
    tooltipActivities: 'активностей',
    
    // Month names
    monthsFull: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    monthsShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
                  'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
    
    // Day names
    daysShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    dayLabels: ['Пн', 'Ср', 'Пт'],
    
    // Settings
    settingsTitle: 'Настройки графика активности',
    
    settingHighlightToday: 'Подсветка сегодня',
    settingHighlightTodayDesc: 'Добавить визуальную подсветку текущего дня на графике',
    
    settingHighlightColor: 'Цвет подсветки',
    settingHighlightColorDesc: 'Выберите цвет для подсветки текущего дня',
    
    settingDisplayOnlyTasks: 'Показывать только задачи',
    settingDisplayOnlyTasksDesc: 'Показывать выполненные задачи вместо файловой активности. Использует формат плагина Tasks (✅ YYYY-MM-DD или done:: YYYY-MM-DD)',
    
    settingDisplayStyle: 'Стиль отображения',
    settingDisplayStyleDesc: 'Выберите способ отображения графика активности',
    styleCommitGraph: 'Commit Graph',
    styleCalendar: 'Календарь',
    
    settingDisplayPeriod: 'Период отображения',
    settingDisplayPeriodDesc: 'Выберите временной период для отображения на графике',
    period1Month: '1 месяц',
    period3Months: '3 месяца',
    period6Months: '6 месяцев',
    period12Months: '12 месяцев',
    periodCustom: 'Произвольный период',
    
    settingCustomDateRange: 'Произвольный диапазон дат',
    settingStartDate: 'Начальная дата',
    settingStartDateDesc: 'Выберите начальную дату для произвольного периода',
    settingEndDate: 'Конечная дата',
    settingEndDateDesc: 'Выберите конечную дату для произвольного периода',
    
    settingActivityColors: 'Цвета уровней активности',
    settingLightTheme: 'Светлая тема',
    settingDarkTheme: 'Тёмная тема',
    settingLevel0: 'Уровень 0 (Нет активности)',
    settingLevel1: 'Уровень 1 (Низкий)',
    settingLevel2: 'Уровень 2 (Средний)',
    settingLevel3: 'Уровень 3 (Высокий)',
    settingLevel4: 'Уровень 4 (Очень высокий)',
    settingResetColors: 'Сбросить цвета',
    settingResetColorsDesc: 'Сбросить все цвета активности к значениям по умолчанию',
    settingResetButton: 'Сбросить',
    
    settingFirstDayOfWeek: 'Первый день недели',
    settingFirstDayOfWeekDesc: 'Выберите, с какого дня начинается неделя',
    firstDaySunday: 'Воскресенье',
    firstDayMonday: 'Понедельник',
    
    // Navigation
    navPrevMonth: 'Предыдущий месяц',
    navNextMonth: 'Следующий месяц',
};

// All translations
const translations = {
    en,
    ru,
};

// Current locale
let currentLocale = 'en';

/**
 * Initialize locale from Obsidian settings
 * @param {App} app - Obsidian app instance
 */
export function initLocale(app) {
    // Get language from Obsidian's settings
    const obsidianLang = app?.vault?.config?.lang || 
                         window.localStorage.getItem('language') || 
                         'en';
    
    // Extract base language code (e.g., 'ru' from 'ru-RU')
    const baseLang = obsidianLang.split('-')[0].toLowerCase();
    
    // Set locale if translation exists, otherwise fallback to English
    currentLocale = translations[baseLang] ? baseLang : 'en';
    
    return currentLocale;
}

/**
 * Get translation by key
 * @param {string} key - Translation key
 * @returns {string|array} - Translated value
 */
export function t(key) {
    const translation = translations[currentLocale];
    return translation[key] !== undefined ? translation[key] : translations.en[key] || key;
}

/**
 * Get current locale
 * @returns {string} - Current locale code
 */
export function getLocale() {
    return currentLocale;
}

/**
 * Get month name (full)
 * @param {number} monthIndex - Month index (0-11)
 * @returns {string} - Month name
 */
export function getMonthFull(monthIndex) {
    return t('monthsFull')[monthIndex];
}

/**
 * Get month name (short)
 * @param {number} monthIndex - Month index (0-11)
 * @returns {string} - Short month name
 */
export function getMonthShort(monthIndex) {
    return t('monthsShort')[monthIndex];
}

/**
 * Get day names (short)
 * @param {number} firstDayOfWeek - First day of week (0 = Sunday, 1 = Monday)
 * @returns {string[]} - Array of short day names
 */
export function getDaysShort(firstDayOfWeek = 0) {
    const days = [...t('daysShort')];
    if (firstDayOfWeek === 1) {
        // Move Sunday to the end for Monday start
        days.push(days.shift());
    }
    return days;
}

/**
 * Get day labels for commit graph
 * @param {number} firstDayOfWeek - First day of week (0 = Sunday, 1 = Monday)
 * @returns {string[]} - Array of day labels
 */
export function getDayLabels(firstDayOfWeek = 0) {
    const days = [...t('daysShort')];
    if (firstDayOfWeek === 1) {
        // Move Sunday to the end for Monday start
        days.push(days.shift());
    }
    // Return Mon, Wed, Fri labels (indices 1, 3, 5 for Sunday start or 0, 2, 4 for Monday start)
    if (firstDayOfWeek === 1) {
        return [days[0], days[2], days[4]]; // Mon, Wed, Fri
    }
    return [days[1], days[3], days[5]]; // Mon, Wed, Fri
}
