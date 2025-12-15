/**
 * Calendar date info
 */
export interface CalendarDate {
    year: number;
    month: number; // 0-11
    day: number;
    date: Date;
    dateStr: string; // YYYY-MM-DD
    isToday: boolean;
    isCurrentMonth: boolean;
    activity: number;
    level: 0 | 1 | 2 | 3 | 4;
}
