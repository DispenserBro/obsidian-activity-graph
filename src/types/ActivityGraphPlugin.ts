import { Plugin, App } from 'obsidian';
import { ActivityGraphSettings } from './ActivityGraphSettings';
import { ActivityData } from './ActivityData';
import { TasksStatusData } from './DayTasksStatus';

/**
 * Activity Graph Plugin interface
 */
export interface ActivityGraphPlugin extends Plugin {
    app: App;
    settings: ActivityGraphSettings;
    activityData: ActivityData;
    tasksData: ActivityData;
    tasksStatusData: TasksStatusData;
    
    loadSettings(): Promise<void>;
    saveSettings(): Promise<void>;
    loadActivityData(): Promise<void>;
    loadTasksData(): Promise<void>;
    loadTasksStatusData(): Promise<void>;
    updateView(): void;
    isTasksPluginEnabled(): boolean;
}
