/**
 * Activity data for a single day
 */
export interface DayActivity {
    date: string; // YYYY-MM-DD format
    count: number;
    level: 0 | 1 | 2 | 3 | 4;
}
