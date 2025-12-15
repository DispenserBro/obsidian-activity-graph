/**
 * Base Renderer - Common functionality for graph renderers
 */
import { App, TFile } from 'obsidian';
import { formatDate, getDailyNotesSettings, formatDailyNoteFilename } from '../utils';
import { t, ts } from '../localization';
import { ActivityGraphSettings, ActivityGraphPlugin } from '../types';

export class BaseRenderer {
    plugin: ActivityGraphPlugin | null;
    customSettings: Partial<ActivityGraphSettings> | null;
    todayStr: string;
    currentTooltip: HTMLElement | null;
    private tooltipHideTimer: number | null;

    constructor(plugin: ActivityGraphPlugin | null = null, customSettings: Partial<ActivityGraphSettings> | null = null) {
        this.currentTooltip = null;
        this.tooltipHideTimer = null;
        this.plugin = plugin;
        this.customSettings = customSettings;
        this.todayStr = formatDate(new Date());
    }

    setPlugin(plugin: ActivityGraphPlugin): void {
        this.plugin = plugin;
    }

    setCustomSettings(settings: Partial<ActivityGraphSettings>): void {
        this.customSettings = settings;
    }

    getSettings(): Partial<ActivityGraphSettings> {
        return this.customSettings || (this.plugin && this.plugin.settings) || {};
    }

    isToday(dateStr) {
        return dateStr === this.todayStr;
    }

    shouldHighlightToday() {
        const settings = this.getSettings();
        return settings.highlightToday !== undefined ? settings.highlightToday : false;
    }

    getHighlightColor() {
        const settings = this.getSettings();
        return settings.highlightColor || '#7c3aed';
    }

    getFirstDayOfWeek() {
        const settings = this.getSettings();
        return settings.firstDayOfWeek !== undefined ? settings.firstDayOfWeek : 0;
    }

    showTooltip(element: HTMLElement, date: string, count: number): void {
        // Clear any pending hide timer
        if (this.tooltipHideTimer !== null) {
            window.clearTimeout(this.tooltipHideTimer);
            this.tooltipHideTimer = null;
        }
        
        // Hide any existing tooltip first
        this.hideTooltip();
        
        const tooltip = document.createElement('div');
        tooltip.addClass('activity-tooltip');
        tooltip.textContent = `${count} ${t('tooltipActivities')} ${date}`;
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + 'px';
        tooltip.style.top = (rect.top - 30) + 'px';
        
        document.body.appendChild(tooltip);
        this.currentTooltip = tooltip;
    }

    hideTooltip(): void {
        // Clear any pending hide timer
        if (this.tooltipHideTimer !== null) {
            window.clearTimeout(this.tooltipHideTimer);
            this.tooltipHideTimer = null;
        }
        
        if (this.currentTooltip) {
            this.currentTooltip.remove();
            this.currentTooltip = null;
        }
    }
    
    scheduleHideTooltip(delay = 100): void {
        // Clear existing timer
        if (this.tooltipHideTimer !== null) {
            window.clearTimeout(this.tooltipHideTimer);
        }
        
        // Schedule hide
        this.tooltipHideTimer = window.setTimeout(() => {
            this.hideTooltip();
            this.tooltipHideTimer = null;
        }, delay);
    }
    
    addGlobalTooltipHandlers(): void {
        // Hide tooltip on scroll
        const onScroll = () => this.hideTooltip();
        document.addEventListener('scroll', onScroll, { passive: true, capture: true });
        
        // Hide tooltip on click outside
        const onClick = (e: MouseEvent) => {
            if (this.currentTooltip && !this.currentTooltip.contains(e.target as Node)) {
                this.hideTooltip();
            }
        };
        document.addEventListener('click', onClick, { capture: true });
        
        // Store handlers for cleanup
        if (!this.plugin) return;
        
        // We'll clean up these handlers when the renderer is destroyed
        this.plugin.register(() => {
            document.removeEventListener('scroll', onScroll, { capture: true });
            document.removeEventListener('click', onClick, { capture: true });
        });
    }

    renderLegend(container: HTMLElement, additionalClass = ''): void {
        const cls = additionalClass ? `graph-legend ${additionalClass}` : 'graph-legend';
        const legend = container.createEl('div', { cls });
        legend.createEl('span', { text: ts('legendLess'), cls: 'legend-text' });
        for (let i = 0; i <= 4; i++) {
            legend.createEl('div', { cls: `graph-square level-${i}` });
        }
        legend.createEl('span', { text: ts('legendMore'), cls: 'legend-text' });
    }

    addTooltipListeners(element: HTMLElement, dateStr: string, count: number): void {
        element.addEventListener('mouseenter', (e) => {
            this.showTooltip(e.target as HTMLElement, dateStr, count);
        });
        
        element.addEventListener('mouseleave', () => {
            // Use delayed hide to prevent flickering
            this.scheduleHideTooltip(100);
        });
        
        // Hide tooltip when element is clicked
        element.addEventListener('click', () => {
            this.hideTooltip();
            this.openDailyNote(dateStr);
        });
    }

    /**
     * Open daily note for the given date
     * Uses the Daily Notes plugin settings for path and format
     */
    async openDailyNote(dateStr) {
        if (!this.plugin) return;

        const app = this.plugin.app;
        
        // Get Daily Notes plugin settings
        const dailyNotesSettings = getDailyNotesSettings(app, this.getSettings());
        
        // Parse the date
        const date = new Date(dateStr);
        
        // Format the filename based on Daily Notes settings
        const filename = await formatDailyNoteFilename(date, dailyNotesSettings.format);
        const folder = dailyNotesSettings?.folder || '';
        
        // Build the full path
        const fullPath = folder ? `${folder}/${filename}.md` : `${filename}.md`;
        
        // Check if file exists
        const file = app.vault.getAbstractFileByPath(fullPath);
        
        if (file) {
            // Open existing file
            await app.workspace.openLinkText(fullPath, '', false);
        } else {
            // Create and open new file
            await this.createAndOpenDailyNote(app, fullPath, date, dailyNotesSettings);
        }
    }

    /**
     * Create and open a new daily note
     */
    async createAndOpenDailyNote(app, fullPath, date, settings) {
        try {
            // Ensure folder exists
            const folderPath = fullPath.substring(0, fullPath.lastIndexOf('/'));
            if (folderPath) {
                const folder = app.vault.getAbstractFileByPath(folderPath);
                if (!folder) {
                    await app.vault.createFolder(folderPath);
                }
            }

            // Get template content if available
            let content = '';
            if (settings?.template) {
                const templateFile = app.vault.getAbstractFileByPath(settings.template + '.md') ||
                                    app.vault.getAbstractFileByPath(settings.template);
                if (templateFile) {
                    content = await app.vault.read(templateFile);
                    // Replace template variables using moment.js with locale
                    const dateFormatted = await formatDailyNoteFilename(date, settings.format);
                    content = content
                        .replace(/{{date}}/g, dateFormatted)
                        .replace(/{{title}}/g, dateFormatted);
                }
            }

            // Create the file
            await app.vault.create(fullPath, content);
            
            // Open the file
            await app.workspace.openLinkText(fullPath, '', false);
        } catch (error) {
            console.error('Error creating daily note:', error);
        }
    }

    /**
     * Clean up resources (remove tooltips)
     */
    cleanup(): void {
        this.hideTooltip();
    }
}
