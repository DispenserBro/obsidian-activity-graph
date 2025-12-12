/**
 * Code Block Processor - Renders activity graph in notes
 */
import { getDateRange } from '../utils.js';
import { CommitGraphRenderer, CalendarRenderer } from '../renderers/index.js';

export class CodeBlockProcessor {
    constructor(plugin) {
        this.plugin = plugin;
    }

    register() {
        this.plugin.registerMarkdownCodeBlockProcessor(
            'activity-graph',
            async (source, el, ctx) => {
                await this.processCodeBlock(source, el);
            }
        );
    }

    parseOptions(source) {
        const options = {};
        const lines = source.trim().split('\n');
        
        for (const line of lines) {
            const colonIndex = line.indexOf(':');
            if (colonIndex === -1) continue;
            
            const key = line.substring(0, colonIndex).trim();
            const value = line.substring(colonIndex + 1).trim();
            
            if (key && value) {
                // Parse array values like [#color1, #color2, ...]
                if (value.startsWith('[') && value.endsWith(']')) {
                    const arrayContent = value.slice(1, -1);
                    options[key] = arrayContent.split(',').map(s => s.trim());
                } else {
                    options[key] = value;
                }
            }
        }
        
        return options;
    }

    async processCodeBlock(source, el) {
        const options = this.parseOptions(source);
        
        // Create merged settings with options overriding defaults
        const settings = {
            ...this.plugin.settings,
            periodType: options.period || this.plugin.settings.periodType,
            displayStyle: options.style || this.plugin.settings.displayStyle,
            displayOnlyTasks: options.tasks === 'true' || 
                (options.tasks !== 'false' && this.plugin.settings.displayOnlyTasks),
        };

        // Handle highlight today option
        if (options.highlightToday !== undefined) {
            settings.highlightToday = options.highlightToday === 'true';
        }

        // Handle custom colors array
        if (options.colors && Array.isArray(options.colors) && options.colors.length === 5) {
            settings.lightLevel0 = options.colors[0];
            settings.lightLevel1 = options.colors[1];
            settings.lightLevel2 = options.colors[2];
            settings.lightLevel3 = options.colors[3];
            settings.lightLevel4 = options.colors[4];
            settings.darkLevel0 = options.colors[0];
            settings.darkLevel1 = options.colors[1];
            settings.darkLevel2 = options.colors[2];
            settings.darkLevel3 = options.colors[3];
            settings.darkLevel4 = options.colors[4];
        }

        // Handle separate light/dark theme colors
        if (options.lightColors && Array.isArray(options.lightColors) && options.lightColors.length === 5) {
            settings.lightLevel0 = options.lightColors[0];
            settings.lightLevel1 = options.lightColors[1];
            settings.lightLevel2 = options.lightColors[2];
            settings.lightLevel3 = options.lightColors[3];
            settings.lightLevel4 = options.lightColors[4];
        }
        if (options.darkColors && Array.isArray(options.darkColors) && options.darkColors.length === 5) {
            settings.darkLevel0 = options.darkColors[0];
            settings.darkLevel1 = options.darkColors[1];
            settings.darkLevel2 = options.darkColors[2];
            settings.darkLevel3 = options.darkColors[3];
            settings.darkLevel4 = options.darkColors[4];
        }

        // Handle custom dates from options
        if (options.start) {
            settings.periodType = 'custom';
            settings.customStartDate = options.start;
        }
        if (options.end) {
            settings.periodType = 'custom';
            settings.customEndDate = options.end;
        }

        // Create container
        el.addClass('activity-graph-container');
        el.addClass('activity-graph-embed');
        
        // Apply custom colors
        this.applyCustomColors(el, settings);

        // Render title if provided
        if (options.title) {
            const header = el.createEl('div', { cls: 'activity-graph-header' });
            header.createEl('h4', { text: options.title });
        }

        const graphContainer = el.createEl('div', { cls: 'activity-graph' });

        // Load data
        let activityData;
        if (settings.displayOnlyTasks) {
            await this.plugin.loadTasksData();
            activityData = this.plugin.tasksData;
        } else {
            activityData = this.plugin.activityData;
        }

        const { startDate, endDate } = getDateRange(settings);

        // Create renderer with custom settings
        // Code blocks use compact mode for calendar (single month with navigation)
        let renderer;
        if (settings.displayStyle === 'calendar') {
            renderer = new CalendarRenderer(this.plugin, settings, true); // compactMode = true
        } else {
            renderer = new CommitGraphRenderer(this.plugin, settings);
        }

        // Render graph
        renderer.render(graphContainer, activityData, startDate, endDate);
    }

    applyCustomColors(container, settings) {
        const s = settings;
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
}
