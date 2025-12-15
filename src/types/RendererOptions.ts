import { App } from 'obsidian';
import { ActivityGraphSettings } from './ActivityGraphSettings';
import { ActivityData } from './ActivityData';

/**
 * Renderer options
 */
export interface RendererOptions {
    app: App;
    settings: ActivityGraphSettings;
    container: HTMLElement;
    activityData: ActivityData;
}
