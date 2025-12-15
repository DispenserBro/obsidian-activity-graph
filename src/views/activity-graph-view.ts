/**
 * Activity Graph View - Main view component
 */
import { ItemView, WorkspaceLeaf } from 'obsidian';
import { VIEW_TYPE_ACTIVITY_GRAPH } from '../constants';
import { getDateRange } from '../utils';
import { CommitGraphRenderer, CalendarRenderer } from '../renderers/index';
import { ts } from '../localization';
import type { ActivityGraphPlugin } from '../types';

export class ActivityGraphView extends ItemView {
    private plugin: ActivityGraphPlugin;
    private commitGraphRenderer: CommitGraphRenderer;
    private calendarRenderer: CalendarRenderer;

    constructor(leaf: WorkspaceLeaf, plugin: ActivityGraphPlugin) {
        super(leaf);
        this.plugin = plugin;
        this.commitGraphRenderer = new CommitGraphRenderer(plugin);
        this.calendarRenderer = new CalendarRenderer(plugin);
    }

    getViewType(): string {
        return VIEW_TYPE_ACTIVITY_GRAPH;
    }

    getDisplayText(): string {
        return ts('viewTitle');
    }

    getIcon(): string {
        return 'bar-chart';
    }

    async onOpen(): Promise<void> {
        const container = this.containerEl.children[1] as HTMLElement;
        container.empty();
        container.addClass('activity-graph-container');
        
        // Apply custom colors as CSS variables
        this.applyCustomColors(container);
        
        const header = container.createEl('div', { cls: 'activity-graph-header' });
        const title = this.plugin.settings.displayOnlyTasks 
            ? ts('tasksGraphTitle') 
            : ts('activityGraphTitle');
        header.createEl('h4', { text: title });
        
        const graphContainer = container.createEl('div', { cls: 'activity-graph' });
        
        if (this.plugin.settings.displayOnlyTasks) {
            await this.plugin.loadTasksData();
        }
        
        this.renderGraph(graphContainer);
    }

    applyCustomColors(container: HTMLElement): void {
        const s = this.plugin.settings;
        container.style.setProperty('--activity-light-level-0', s.lightTheme.level0);
        container.style.setProperty('--activity-light-level-1', s.lightTheme.level1);
        container.style.setProperty('--activity-light-level-2', s.lightTheme.level2);
        container.style.setProperty('--activity-light-level-3', s.lightTheme.level3);
        container.style.setProperty('--activity-light-level-4', s.lightTheme.level4);
        container.style.setProperty('--activity-dark-level-0', s.darkTheme.level0);
        container.style.setProperty('--activity-dark-level-1', s.darkTheme.level1);
        container.style.setProperty('--activity-dark-level-2', s.darkTheme.level2);
        container.style.setProperty('--activity-dark-level-3', s.darkTheme.level3);
        container.style.setProperty('--activity-dark-level-4', s.darkTheme.level4);
    }

    renderGraph(container: HTMLElement): void {
        container.empty();
        
        // Hide any existing tooltips before rendering
        this.commitGraphRenderer.cleanup();
        this.calendarRenderer.cleanup();
        
        const activityData = this.plugin.settings.displayOnlyTasks 
            ? this.plugin.tasksData 
            : this.plugin.activityData;
        const settings = this.plugin.settings;
        
        const { startDate, endDate } = getDateRange(settings);
        
        if (settings.displayStyle === 'calendar') {
            this.calendarRenderer.render(container, activityData, startDate, endDate);
        } else {
            this.commitGraphRenderer.render(container, activityData, startDate, endDate);
        }
    }

    async onClose(): Promise<void> {
        // Cleanup renderers
        this.commitGraphRenderer.cleanup();
        this.calendarRenderer.cleanup();
    }
}