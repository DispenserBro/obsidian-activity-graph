/**
 * Code Block Processor - Renders activity graph in notes
 */
import { getDateRange } from '../utils';
import { CommitGraphRenderer, CalendarRenderer } from '../renderers/index';
import type { ActivityGraphPlugin, CodeBlockOptions, ActivityGraphSettings } from '../types';

export class CodeBlockProcessor {
    private plugin: ActivityGraphPlugin;

    constructor(plugin: ActivityGraphPlugin) {
        this.plugin = plugin;
    }

    register(): void {
        this.plugin.registerMarkdownCodeBlockProcessor(
            'activity-graph',
            async (source, el, ctx) => {
                await this.processCodeBlock(source, el);
            }
        );
    }

    parseOptions(source: string): CodeBlockOptions {
        const options: CodeBlockOptions = {};
        const lines = source.trim().split('\n');
        
        for (const line of lines) {
            const colonIndex = line.indexOf(':');
            if (colonIndex === -1) continue;
            
            const key = line.substring(0, colonIndex).trim() as keyof CodeBlockOptions;
            const value = line.substring(colonIndex + 1).trim();
            
            if (key && value) {
                // Parse array values like [#color1, #color2, ...]
                if (value.startsWith('[') && value.endsWith(']')) {
                    const arrayContent = value.slice(1, -1);
                    const arrayValue = arrayContent.split(',').map(s => s.trim());
                    if (key === 'colors' || key === 'lightColors' || key === 'darkColors') {
                        options[key] = arrayValue;
                    }
                } else {
                    (options as Record<string, string>)[key] = value;
                }
            }
        }
        
        return options;
    }

    async processCodeBlock(source: string, el: HTMLElement): Promise<void> {
        const options = this.parseOptions(source);
        
        // Create merged settings with options overriding defaults
        const settings: ActivityGraphSettings = {
            ...this.plugin.settings,
            displayPeriod: options.period as any || this.plugin.settings.displayPeriod,
            displayStyle: options.style as any || this.plugin.settings.displayStyle,
            displayOnlyTasks: options.tasks === 'true' || 
                (options.tasks !== 'false' && this.plugin.settings.displayOnlyTasks),
            // Deep copy color schemes to avoid mutating original
            lightTheme: { ...this.plugin.settings.lightTheme },
            darkTheme: { ...this.plugin.settings.darkTheme }
        };

        // Handle highlight today option
        if (options.highlightToday !== undefined) {
            settings.highlightToday = options.highlightToday === 'true';
        }

        // Handle custom colors array (apply to both themes)
        if (options.colors && Array.isArray(options.colors) && options.colors.length === 5) {
            settings.lightTheme.level0 = options.colors[0];
            settings.lightTheme.level1 = options.colors[1];
            settings.lightTheme.level2 = options.colors[2];
            settings.lightTheme.level3 = options.colors[3];
            settings.lightTheme.level4 = options.colors[4];
            settings.darkTheme.level0 = options.colors[0];
            settings.darkTheme.level1 = options.colors[1];
            settings.darkTheme.level2 = options.colors[2];
            settings.darkTheme.level3 = options.colors[3];
            settings.darkTheme.level4 = options.colors[4];
        }

        // Handle separate light/dark theme colors
        if (options.lightColors && Array.isArray(options.lightColors) && options.lightColors.length === 5) {
            settings.lightTheme.level0 = options.lightColors[0];
            settings.lightTheme.level1 = options.lightColors[1];
            settings.lightTheme.level2 = options.lightColors[2];
            settings.lightTheme.level3 = options.lightColors[3];
            settings.lightTheme.level4 = options.lightColors[4];
        }
        if (options.darkColors && Array.isArray(options.darkColors) && options.darkColors.length === 5) {
            settings.darkTheme.level0 = options.darkColors[0];
            settings.darkTheme.level1 = options.darkColors[1];
            settings.darkTheme.level2 = options.darkColors[2];
            settings.darkTheme.level3 = options.darkColors[3];
            settings.darkTheme.level4 = options.darkColors[4];
        }

        // Handle custom dates from options
        if (options.start) {
            settings.displayPeriod = 'custom';
            settings.customStartDate = options.start;
        }
        if (options.end) {
            settings.displayPeriod = 'custom';
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
        if (settings.displayOnlyTasks && this.plugin.isTasksPluginEnabled()) {
            await this.plugin.loadTasksData();
            activityData = this.plugin.tasksData;
        } else {
            activityData = this.plugin.activityData;
        }

        const { startDate, endDate } = getDateRange(settings);

        // Create renderer with custom settings
        // Code blocks use compact mode for calendar (single month with navigation)
        // IMPORTANT: calendar-sheet is only for sidebar view, in code blocks it uses calendar
        let renderer;
        if (settings.displayStyle === 'calendar' || settings.displayStyle === 'calendar-sheet') {
            renderer = new CalendarRenderer(this.plugin, settings, true); // compactMode = true
        } else {
            renderer = new CommitGraphRenderer(this.plugin, settings);
        }

        // Render graph
        renderer.render(graphContainer, activityData, startDate, endDate);
    }

    private applyCustomColors(container: HTMLElement, settings: ActivityGraphSettings): void {
        container.style.setProperty('--activity-light-level-0', settings.lightTheme.level0);
        container.style.setProperty('--activity-light-level-1', settings.lightTheme.level1);
        container.style.setProperty('--activity-light-level-2', settings.lightTheme.level2);
        container.style.setProperty('--activity-light-level-3', settings.lightTheme.level3);
        container.style.setProperty('--activity-light-level-4', settings.lightTheme.level4);
        container.style.setProperty('--activity-dark-level-0', settings.darkTheme.level0);
        container.style.setProperty('--activity-dark-level-1', settings.darkTheme.level1);
        container.style.setProperty('--activity-dark-level-2', settings.darkTheme.level2);
        container.style.setProperty('--activity-dark-level-3', settings.darkTheme.level3);
        container.style.setProperty('--activity-dark-level-4', settings.darkTheme.level4);
    }
}
