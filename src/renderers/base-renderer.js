/**
 * Base Renderer - Common functionality for graph renderers
 */
import { formatDate } from '../utils.js';
import { t } from '../localization.js';

export class BaseRenderer {
    constructor(plugin = null, customSettings = null) {
        this.currentTooltip = null;
        this.plugin = plugin;
        this.customSettings = customSettings;
        this.todayStr = formatDate(new Date());
    }

    setPlugin(plugin) {
        this.plugin = plugin;
    }

    setCustomSettings(settings) {
        this.customSettings = settings;
    }

    getSettings() {
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

    showTooltip(element, date, count) {
        const tooltip = document.createElement('div');
        tooltip.addClass('activity-tooltip');
        tooltip.textContent = `${count} ${t('tooltipActivities')} ${date}`;
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + 'px';
        tooltip.style.top = (rect.top - 30) + 'px';
        
        document.body.appendChild(tooltip);
        this.currentTooltip = tooltip;
    }

    hideTooltip() {
        if (this.currentTooltip) {
            this.currentTooltip.remove();
            this.currentTooltip = null;
        }
    }

    renderLegend(container, additionalClass = '') {
        const cls = additionalClass ? `graph-legend ${additionalClass}` : 'graph-legend';
        const legend = container.createEl('div', { cls });
        legend.createEl('span', { text: t('legendLess'), cls: 'legend-text' });
        for (let i = 0; i <= 4; i++) {
            legend.createEl('div', { cls: `graph-square level-${i}` });
        }
        legend.createEl('span', { text: t('legendMore'), cls: 'legend-text' });
    }

    addTooltipListeners(element, dateStr, count) {
        element.addEventListener('mouseenter', (e) => {
            this.showTooltip(e.target, dateStr, count);
        });
        
        element.addEventListener('mouseleave', () => {
            this.hideTooltip();
        });

        // Click to open daily note
        element.addEventListener('click', () => {
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
        
        // Try to get Daily Notes plugin settings
        const dailyNotesSettings = this.getDailyNotesSettings(app);
        
        // Parse the date
        const date = new Date(dateStr);
        
        // Format the filename based on Daily Notes settings or default
        const filename = this.formatDailyNoteFilename(date, dailyNotesSettings);
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
     * Get Daily Notes plugin settings
     */
    getDailyNotesSettings(app) {
        // Try to get settings from Daily Notes core plugin
        const dailyNotesPlugin = app.internalPlugins?.getPluginById?.('daily-notes');
        if (dailyNotesPlugin?.enabled && dailyNotesPlugin?.instance?.options) {
            return dailyNotesPlugin.instance.options;
        }

        // Try to get settings from Periodic Notes community plugin
        const periodicNotes = app.plugins?.getPlugin?.('periodic-notes');
        if (periodicNotes?.settings?.daily) {
            return periodicNotes.settings.daily;
        }

        // Default settings
        return {
            folder: '',
            format: 'YYYY-MM-DD',
            template: ''
        };
    }

    /**
     * Format the daily note filename based on date and settings
     */
    formatDailyNoteFilename(date, settings) {
        const format = settings?.format || 'YYYY-MM-DD';
        return this.formatDateWithPattern(date, format);
    }

    /**
     * Format date with a pattern (simple moment.js-like formatting)
     */
    formatDateWithPattern(date, format) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const dayOfWeek = date.getDay();
        
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'];
        const monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                                 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        return format
            .replace(/YYYY/g, year)
            .replace(/YY/g, String(year).slice(-2))
            .replace(/MMMM/g, monthNames[month - 1])
            .replace(/MMM/g, monthNamesShort[month - 1])
            .replace(/MM/g, String(month).padStart(2, '0'))
            .replace(/M/g, month)
            .replace(/DDDD/g, dayNames[dayOfWeek])
            .replace(/DDD/g, dayNamesShort[dayOfWeek])
            .replace(/DD/g, String(day).padStart(2, '0'))
            .replace(/D/g, day)
            .replace(/dddd/g, dayNames[dayOfWeek])
            .replace(/ddd/g, dayNamesShort[dayOfWeek]);
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
                    // Replace template variables
                    content = content
                        .replace(/{{date}}/g, this.formatDateWithPattern(date, settings.format || 'YYYY-MM-DD'))
                        .replace(/{{title}}/g, this.formatDateWithPattern(date, settings.format || 'YYYY-MM-DD'));
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
}
