import { Plugin, App } from 'obsidian';
import { ActivityGraphSettings } from './ActivityGraphSettings';
import { ActivityData } from './ActivityData';

/**
 * Activity Graph Plugin interface
 */
export interface ActivityGraphPlugin extends Plugin {
    app: App;
    settings: ActivityGraphSettings;
    activityData: ActivityData;
    tasksData: ActivityData;
    
    loadSettings(): Promise<void>;
    saveSettings(): Promise<void>;
    loadActivityData(): Promise<void>;
    loadTasksData(): Promise<void>;
    updateView(): void;
}
