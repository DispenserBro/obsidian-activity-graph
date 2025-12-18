/**
 * Activity Graph View - Main view component
 */
import { ItemView, WorkspaceLeaf } from 'obsidian';
import { VIEW_TYPE_ACTIVITY_GRAPH } from '../constants';
import { getDateRange } from '../utils';
import { CommitGraphRenderer, CalendarRenderer, CalendarSheetRenderer } from '../renderers/index';
import { ts } from '../localization';
import type { ActivityGraphPlugin } from '../types';

export class ActivityGraphView extends ItemView {
    private plugin: ActivityGraphPlugin;
    private commitGraphRenderer: CommitGraphRenderer;
    private calendarRenderer: CalendarRenderer;
    private calendarSheetRenderer: CalendarSheetRenderer;

    constructor(leaf: WorkspaceLeaf, plugin: ActivityGraphPlugin) {
        super(leaf);
        this.plugin = plugin;
        this.commitGraphRenderer = new CommitGraphRenderer(plugin);
        this.calendarRenderer = new CalendarRenderer(plugin);
        this.calendarSheetRenderer = new CalendarSheetRenderer(plugin);
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
        const title = (this.plugin.settings.displayOnlyTasks && this.plugin.isTasksPluginEnabled())
            ? ts('tasksGraphTitle') 
            : ts('activityGraphTitle');
        const heading = header.createEl('h4');
        heading.textContent = title;
        
        const graphContainer = container.createEl('div', { cls: 'activity-graph' });
        
        if (this.plugin.settings.displayOnlyTasks && this.plugin.isTasksPluginEnabled()) {
            await this.plugin.loadTasksData();
        }
        
        // Load tasks status data for calendar sheet if Tasks plugin is enabled
        if (this.plugin.isTasksPluginEnabled()) {
            await this.plugin.loadTasksStatusData();
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
        this.calendarSheetRenderer.cleanup();
        
        const activityData = (this.plugin.settings.displayOnlyTasks && this.plugin.isTasksPluginEnabled())
            ? this.plugin.tasksData 
            : this.plugin.activityData;
        const settings = this.plugin.settings;
        
        const { startDate, endDate } = getDateRange(settings);
        
        if (settings.displayStyle === 'calendar') {
            this.calendarRenderer.render(container, activityData, startDate, endDate);
        } else if (settings.displayStyle === 'calendar-sheet') {
            // Pass tasks status data to calendar sheet if Tasks plugin is enabled
            const tasksStatusData = this.plugin.isTasksPluginEnabled() 
                ? this.plugin.tasksStatusData 
                : {};
            this.calendarSheetRenderer.render(
                container, 
                activityData, 
                startDate, 
                endDate, 
                tasksStatusData,
                settings.activityDotPosition
            );
        } else {
            this.commitGraphRenderer.render(container, activityData, startDate, endDate);
        }
    }

    onClose(): Promise<void> {
        // Cleanup renderers
        this.commitGraphRenderer.cleanup();
        this.calendarRenderer.cleanup();
        this.calendarSheetRenderer.cleanup();
        return Promise.resolve();
    }
}