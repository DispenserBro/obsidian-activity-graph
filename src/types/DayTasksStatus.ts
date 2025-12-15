/**
 * Tasks status for a specific day
 */
export interface DayTasksStatus {
    hasCompletedTasks: boolean;
    hasIncompleteTasks: boolean;
}

/**
 * Map of date strings to task status
 */
export type TasksStatusData = Record<string, DayTasksStatus>;
