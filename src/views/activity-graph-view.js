/**
 * Activity Graph View - Main view component
 */
import { ItemView } from 'obsidian';
import { VIEW_TYPE_ACTIVITY_GRAPH } from '../constants.js';
import { getDateRange } from '../utils.js';
import { CommitGraphRenderer, CalendarRenderer } from '../renderers/index.js';
import { t } from '../localization.js';

export class ActivityGraphView extends ItemView {
    constructor(leaf, plugin) {
        super(leaf);
        this.plugin = plugin;
        this.commitGraphRenderer = new CommitGraphRenderer(plugin);
        this.calendarRenderer = new CalendarRenderer(plugin);
    }

    getViewType() {
        return VIEW_TYPE_ACTIVITY_GRAPH;
    }

    getDisplayText() {
        return t('viewTitle');
    }

    getIcon() {
        return 'bar-chart';
    }

    async onOpen() {
        const container = this.containerEl.children[1];
        container.empty();
        container.addClass('activity-graph-container');
        
        // Apply custom colors as CSS variables
        this.applyCustomColors(container);
        
        const header = container.createEl('div', { cls: 'activity-graph-header' });
        const title = this.plugin.settings.displayOnlyTasks 
            ? t('tasksGraphTitle') 
            : t('activityGraphTitle');
        header.createEl('h4', { text: title });
        
        const graphContainer = container.createEl('div', { cls: 'activity-graph' });
        
        if (this.plugin.settings.displayOnlyTasks) {
            await this.plugin.loadTasksData();
        }
        
        this.renderGraph(graphContainer);
    }

    applyCustomColors(container) {
        const s = this.plugin.settings;
        container.style.setProperty('--activity-light-level-0', s.lightLevel0);
        container.style.setProperty('--activity-light-level-1', s.lightLevel1);
        container.style.setProperty('--activity-light-level-2', s.lightLevel2);
        container.style.setProperty('--activity-light-level-3', s.lightLevel3);
        container.style.setProperty('--activity-light-level-4', s.lightLevel4);
        container.style.setProperty('--activity-dark-level-0', s.darkLevel0);
        container.style.setProperty('--activity-dark-level-1', s.darkLevel1);
        container.style.setProperty('--activity-dark-level-2', s.darkLevel2);
        container.style.setProperty('--activity-dark-level-3', s.darkLevel3);
        container.style.setProperty('--activity-dark-level-4', s.darkLevel4);
    }

    renderGraph(container) {
        container.empty();
        
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

    async onClose() {
        // Cleanup
    }
}
