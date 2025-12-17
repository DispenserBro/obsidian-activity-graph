/**
 * Settings Tab - Plugin configuration UI
 */
import { PluginSettingTab, App, Setting } from 'obsidian';
import { ts } from '../localization';
import { getDailyNotePath } from '../utils';
import type { ActivityGraphPlugin, ActivityGraphSettings } from '../types';

export class ActivityGraphSettingTab extends PluginSettingTab {
    private plugin: ActivityGraphPlugin;
    private pathPreviewSpan: HTMLSpanElement | null = null;
    private formatPreviewSpan: HTMLSpanElement | null = null;
    private updatePathPreviewDebounce: number | null = null;
    private updateFormatPreviewDebounce: number | null = null;

    constructor(app: App, plugin: ActivityGraphPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    
    private async updatePathPreview(): Promise<void> {
        if (this.pathPreviewSpan) {
            const previewPath = await getDailyNotePath(this.app, this.plugin.settings);
            this.pathPreviewSpan.setText(previewPath);
        }
    }
    
    private async updateFormatPreview(): Promise<void> {
        if (this.formatPreviewSpan) {
            const previewPath = await getDailyNotePath(this.app, this.plugin.settings);
            this.formatPreviewSpan.setText(previewPath);
        }
    }

    async display() {
        const { containerEl } = this;
        containerEl.empty();

        new Setting(containerEl)
            .setName(ts('settingsTitle'))
            .setHeading();

        // Highlight Today Setting
        new Setting(containerEl)
            .setName(ts('settingHighlightToday'))
            .setDesc(ts('settingHighlightTodayDesc'))
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.highlightToday)
                .onChange(async (value) => {
                    this.plugin.settings.highlightToday = value;
                    await this.plugin.saveSettings();
                    this.display();
                    this.plugin.updateView();
                }));

        // Highlight Color Setting (only shown when highlightToday is enabled)
        if (this.plugin.settings.highlightToday) {
            const colorSetting = new Setting(containerEl)
                .setName(ts('settingHighlightColor'))
                .setDesc(ts('settingHighlightColorDesc'));
            
            const colorInput = colorSetting.controlEl.createEl('input', {
                type: 'color',
                cls: 'activity-color-input'
            });
            colorInput.value = this.plugin.settings.highlightColor;
            colorInput.addEventListener('change', async (e) => {
                const target = e.target as HTMLInputElement;
                this.plugin.settings.highlightColor = target.value;
                await this.plugin.saveSettings();
                this.plugin.updateView();
            });
        }

        // Display Only Tasks Setting (only show if Tasks plugin is installed)
        if (this.plugin.isTasksPluginEnabled()) {
            new Setting(containerEl)
                .setName(ts('settingDisplayOnlyTasks'))
                .setDesc(ts('settingDisplayOnlyTasksDesc'))
                .addToggle(toggle => toggle
                    .setValue(this.plugin.settings.displayOnlyTasks)
                    .onChange(async (value) => {
                        this.plugin.settings.displayOnlyTasks = value;
                        await this.plugin.saveSettings();
                        this.plugin.updateView();
                    }));
        }

        // Display Style Setting
        new Setting(containerEl)
            .setName(ts('settingDisplayStyle'))
            .setDesc(ts('settingDisplayStyleDesc'))
            .addDropdown(dropdown => dropdown
                .addOption('commit-graph', ts('styleCommitGraph'))
                .addOption('calendar', ts('styleCalendar'))
                .addOption('calendar-sheet', ts('styleCalendarSheet'))
                .setValue(this.plugin.settings.displayStyle)
                .onChange(async (value) => {
                    this.plugin.settings.displayStyle = value as 'commit-graph' | 'calendar' | 'calendar-sheet';
                    await this.plugin.saveSettings();
                    this.plugin.updateView();
                    // Refresh display to show/hide activity dot position setting
                    this.display();
                }));

        // Activity Dot Position Setting (only for calendar-sheet)
        if (this.plugin.settings.displayStyle === 'calendar-sheet') {
            new Setting(containerEl)
                .setName(ts('settingActivityDotPosition'))
                .setDesc(ts('settingActivityDotPositionDesc'))
                .addDropdown(dropdown => dropdown
                    .addOption('center', ts('positionCenter'))
                    .addOption('top-left', ts('positionTopLeft'))
                    .addOption('top-right', ts('positionTopRight'))
                    .addOption('bottom-left', ts('positionBottomLeft'))
                    .addOption('bottom-right', ts('positionBottomRight'))
                    .setValue(this.plugin.settings.activityDotPosition)
                    .onChange(async (value: ActivityGraphSettings['activityDotPosition']) => {
                        this.plugin.settings.activityDotPosition = value;
                        await this.plugin.saveSettings();
                        this.plugin.updateView();
                    }));
        }

        // First Day of Week Setting
        new Setting(containerEl)
            .setName(ts('settingFirstDayOfWeek'))
            .setDesc(ts('settingFirstDayOfWeekDesc'))
            .addDropdown(dropdown => dropdown
                .addOption('0', ts('firstDaySunday'))
                .addOption('1', ts('firstDayMonday'))
                .setValue(String(this.plugin.settings.firstDayOfWeek))
                .onChange(async (value) => {
                    this.plugin.settings.firstDayOfWeek = parseInt(value) as 0 | 1;
                    await this.plugin.saveSettings();
                    this.plugin.updateView();
                }));

        // Daily Notes Settings Section
        new Setting(containerEl)
            .setName(ts('settingDailyNotes'))
            .setHeading();

        // Use Daily Notes Plugin Setting
        const previewPath = await getDailyNotePath(this.app, this.plugin.settings);
        const useDailyNotesDescFrag = document.createDocumentFragment();
        useDailyNotesDescFrag.appendText(ts('settingUseDailyNotesPluginDesc'));
        useDailyNotesDescFrag.createEl('br');
        useDailyNotesDescFrag.appendText(ts('settingDailyNotesPreviewExample') + ' ');
        this.pathPreviewSpan = useDailyNotesDescFrag.createEl('span', { 
            text: previewPath, 
            cls: 'u-pop' 
        });
        
        new Setting(containerEl)
            .setName(ts('settingUseDailyNotesPlugin'))
            .setDesc(useDailyNotesDescFrag)
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.useDailyNotesPlugin)
                .onChange(async (value) => {
                    this.plugin.settings.useDailyNotesPlugin = value;
                    await this.plugin.saveSettings();
                    this.display();
                }));

        // Custom Daily Notes Path (only shown when not using plugin settings)
        if (!this.plugin.settings.useDailyNotesPlugin) {
            new Setting(containerEl)
                .setName(ts('settingCustomDailyNotesPath'))
                .setDesc(ts('settingCustomDailyNotesPathDesc'))
                .addText(text => text
                    .setPlaceholder('Daily Notes')
                    .setValue(this.plugin.settings.customDailyNotesPath)
                    .onChange(async (value) => {
                        this.plugin.settings.customDailyNotesPath = value;
                        await this.plugin.saveSettings();
                        
                        // Debounced preview update
                        if (this.updatePathPreviewDebounce !== null) {
                            window.clearTimeout(this.updatePathPreviewDebounce);
                        }
                        this.updatePathPreviewDebounce = window.setTimeout(() => {
                            this.updatePathPreview();
                            this.updateFormatPreview();
                        }, 300);
                    }));

            const formatPreviewPath = await getDailyNotePath(this.app, this.plugin.settings);
            const formatDescFrag = document.createDocumentFragment();
            formatDescFrag.appendText(ts('settingCustomDailyNotesFormatDesc'));
            formatDescFrag.createEl('br');
            formatDescFrag.appendText(ts('settingDailyNotesPreviewExample') + ' ');
            this.formatPreviewSpan = formatDescFrag.createEl('span', { 
                text: formatPreviewPath, 
                cls: 'u-pop' 
            });
            
            new Setting(containerEl)
                .setName(ts('settingCustomDailyNotesFormat'))
                .setDesc(formatDescFrag)
                .addText(text => text
                    .setPlaceholder('YYYY-MM-DD')
                    .setValue(this.plugin.settings.customDailyNotesFormat)
                    .onChange(async (value) => {
                        this.plugin.settings.customDailyNotesFormat = value;
                        await this.plugin.saveSettings();
                        
                        // Debounced preview update
                        if (this.updateFormatPreviewDebounce !== null) {
                            window.clearTimeout(this.updateFormatPreviewDebounce);
                        }
                        this.updateFormatPreviewDebounce = window.setTimeout(() => {
                            this.updatePathPreview();
                            this.updateFormatPreview();
                        }, 300);
                    }));
        }

        // Period Type Setting
        new Setting(containerEl)
            .setName(ts('settingDisplayPeriod'))
            .setDesc(ts('settingDisplayPeriodDesc'))
            .addDropdown(dropdown => dropdown
                .addOption('1month', ts('period1Month'))
                .addOption('3months', ts('period3Months'))
                .addOption('6months', ts('period6Months'))
                .addOption('12months', ts('period12Months'))
                .addOption('custom', ts('periodCustom'))
                .setValue(this.plugin.settings.displayPeriod)
                .onChange(async (value) => {
                    this.plugin.settings.displayPeriod = value as typeof this.plugin.settings.displayPeriod;
                    await this.plugin.saveSettings();
                    this.display();
                    this.plugin.updateView();
                }));

        // Custom Date Fields
        if (this.plugin.settings.displayPeriod === 'custom') {
            new Setting(containerEl)
                .setName(ts('settingCustomDateRange'))
                .setHeading();

            const startDateSetting = new Setting(containerEl)
                .setName(ts('settingStartDate'))
                .setDesc(ts('settingStartDateDesc'));
            
            const startDateInput = startDateSetting.controlEl.createEl('input', {
                type: 'date',
                cls: 'activity-date-input'
            });
            startDateInput.value = this.plugin.settings.customStartDate;
            startDateInput.addEventListener('change', async (e) => {
                const target = e.target as HTMLInputElement;
                this.plugin.settings.customStartDate = target.value;
                await this.plugin.saveSettings();
                this.plugin.updateView();
            });

            const endDateSetting = new Setting(containerEl)
                .setName(ts('settingEndDate'))
                .setDesc(ts('settingEndDateDesc'));
            
            const endDateInput = endDateSetting.controlEl.createEl('input', {
                type: 'date',
                cls: 'activity-date-input'
            });
            endDateInput.value = this.plugin.settings.customEndDate;
            endDateInput.addEventListener('change', async (e) => {
                const target = e.target as HTMLInputElement;
                this.plugin.settings.customEndDate = target.value;
                await this.plugin.saveSettings();
                this.plugin.updateView();
            });
        }

        // Activity Colors Section - Collapsible
        const colorsSection = containerEl.createEl('details', { cls: 'activity-colors-section' });
        const colorsSummary = colorsSection.createEl('summary', { cls: 'activity-colors-header' });
        colorsSummary.createEl('span', { text: ts('settingActivityColors') });

        // Light Theme Colors
        new Setting(colorsSection)
            .setName(ts('settingLightTheme'))
            .setHeading();
        this.renderColorSetting(colorsSection, ts('settingLevel0'), 'lightLevel0');
        this.renderColorSetting(colorsSection, ts('settingLevel1'), 'lightLevel1');
        this.renderColorSetting(colorsSection, ts('settingLevel2'), 'lightLevel2');
        this.renderColorSetting(colorsSection, ts('settingLevel3'), 'lightLevel3');
        this.renderColorSetting(colorsSection, ts('settingLevel4'), 'lightLevel4');

        // Dark Theme Colors
        new Setting(colorsSection)
            .setName(ts('settingDarkTheme'))
            .setHeading();
        this.renderColorSetting(colorsSection, ts('settingLevel0'), 'darkLevel0');
        this.renderColorSetting(colorsSection, ts('settingLevel1'), 'darkLevel1');
        this.renderColorSetting(colorsSection, ts('settingLevel2'), 'darkLevel2');
        this.renderColorSetting(colorsSection, ts('settingLevel3'), 'darkLevel3');
        this.renderColorSetting(colorsSection, ts('settingLevel4'), 'darkLevel4');

        // Reset Colors Button
        new Setting(colorsSection)
            .setName(ts('settingResetColors'))
            .setDesc(ts('settingResetColorsDesc'))
            .addButton(button => button
                .setButtonText(ts('settingResetButton'))
                .onClick(async () => {
                    this.plugin.settings.lightTheme.level0 = '#ebedf0';
                    this.plugin.settings.lightTheme.level1 = '#9be9a8';
                    this.plugin.settings.lightTheme.level2 = '#40c463';
                    this.plugin.settings.lightTheme.level3 = '#30a14e';
                    this.plugin.settings.lightTheme.level4 = '#216e39';
                    this.plugin.settings.darkTheme.level0 = '#161b22';
                    this.plugin.settings.darkTheme.level1 = '#0e4429';
                    this.plugin.settings.darkTheme.level2 = '#006d32';
                    this.plugin.settings.darkTheme.level3 = '#26a641';
                    this.plugin.settings.darkTheme.level4 = '#39d353';
                    await this.plugin.saveSettings();
                    this.display();
                    this.plugin.updateView();
                }));
    }

    renderColorSetting(containerEl: HTMLElement, name: string, settingKey: string): void {
        const setting = new Setting(containerEl)
            .setName(name);
        
        const colorInput = setting.controlEl.createEl('input', {
            type: 'color',
            cls: 'activity-color-input'
        });
        
        // Parse settingKey to access nested structure (e.g., "lightLevel0" -> lightTheme.level0)
        const isLight = settingKey.startsWith('light');
        const levelNum = settingKey.slice(-1);
        const theme = isLight ? this.plugin.settings.lightTheme : this.plugin.settings.darkTheme;
        const levelKey = `level${levelNum}` as keyof typeof theme;
        
        colorInput.value = theme[levelKey];
        colorInput.addEventListener('change', async (e) => {
            const target = e.target as HTMLInputElement;
            theme[levelKey] = target.value;
            await this.plugin.saveSettings();
            this.plugin.updateView();
        });
    }
}
