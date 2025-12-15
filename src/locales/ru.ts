/**
 * Russian translations
 */
import { LocaleStrings } from '../types/LocaleStrings';

export const STRINGS_RU: LocaleStrings = {
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
    styleCalendarSheet: 'Лист календаря',
    
    settingActivityDotPosition: 'Позиция круга активности',
    settingActivityDotPositionDesc: 'Выберите где отображать круг активности в виде листа календаря',
    positionCenter: 'По центру (за числом)',
    positionTopLeft: 'Слева вверху',
    positionTopRight: 'Справа вверху',
    positionBottomLeft: 'Слева внизу',
    positionBottomRight: 'Справа внизу',
    
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
    
    // Daily Notes settings
    settingDailyNotes: 'Настройки ежедневных заметок',
    settingUseDailyNotesPlugin: 'Использовать настройки плагина Daily Notes',
    settingUseDailyNotesPluginDesc: 'Использовать настройки плагина Daily Notes или задать свой путь и формат',
    settingCustomDailyNotesPath: 'Произвольный путь к ежедневным заметкам',
    settingCustomDailyNotesPathDesc: 'Путь для сохранения ежедневных заметок (например, "Daily Notes" или оставьте пустым для корня)',
    settingCustomDailyNotesFormat: 'Произвольный формат даты',
    settingCustomDailyNotesFormatDesc: 'Формат даты в синтаксисе moment.js (например, YYYY-MM-DD, YYYY/MM/DD, DD-MM-YYYY)',
    settingDailyNotesPreviewExample: 'Пример:',
    
    // Navigation
    navPrevMonth: 'Предыдущий месяц',
    navNextMonth: 'Следующий месяц',
};
