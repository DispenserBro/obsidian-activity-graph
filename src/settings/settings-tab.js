/**
 * Settings Tab - Plugin configuration UI
 */
import { PluginSettingTab, Setting } from 'obsidian';
import { t } from '../localization.js';
import { getDailyNotePath } from '../utils.js';

export class ActivityGraphSettingTab extends PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    async display() {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: t('settingsTitle') });

        // Highlight Today Setting
        new Setting(containerEl)
            .setName(t('settingHighlightToday'))
            .setDesc(t('settingHighlightTodayDesc'))
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
                .setName(t('settingHighlightColor'))
                .setDesc(t('settingHighlightColorDesc'));
            
            const colorInput = colorSetting.controlEl.createEl('input', {
                type: 'color',
                cls: 'activity-color-input'
            });
            colorInput.value = this.plugin.settings.highlightColor;
            colorInput.addEventListener('change', async (e) => {
                this.plugin.settings.highlightColor = e.target.value;
                await this.plugin.saveSettings();
                this.plugin.updateView();
            });
        }

        // Display Only Tasks Setting
        new Setting(containerEl)
            .setName(t('settingDisplayOnlyTasks'))
            .setDesc(t('settingDisplayOnlyTasksDesc'))
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.displayOnlyTasks)
                .onChange(async (value) => {
                    this.plugin.settings.displayOnlyTasks = value;
                    await this.plugin.saveSettings();
                    this.plugin.updateView();
                }));

        // Display Style Setting
        new Setting(containerEl)
            .setName(t('settingDisplayStyle'))
            .setDesc(t('settingDisplayStyleDesc'))
            .addDropdown(dropdown => dropdown
                .addOption('commitGraph', t('styleCommitGraph'))
                .addOption('calendar', t('styleCalendar'))
                .setValue(this.plugin.settings.displayStyle)
                .onChange(async (value) => {
                    this.plugin.settings.displayStyle = value;
                    await this.plugin.saveSettings();
                    this.plugin.updateView();
                }));

        // First Day of Week Setting
        new Setting(containerEl)
            .setName(t('settingFirstDayOfWeek'))
            .setDesc(t('settingFirstDayOfWeekDesc'))
            .addDropdown(dropdown => dropdown
                .addOption('0', t('firstDaySunday'))
                .addOption('1', t('firstDayMonday'))
                .setValue(String(this.plugin.settings.firstDayOfWeek))
                .onChange(async (value) => {
                    this.plugin.settings.firstDayOfWeek = parseInt(value);
                    await this.plugin.saveSettings();
                    this.plugin.updateView();
                }));

        // Daily Notes Settings Section
        containerEl.createEl('h3', { text: t('settingDailyNotes') });

        // Use Daily Notes Plugin Setting
        const previewPath = await getDailyNotePath(this.app, this.plugin.settings);
        const useDailyNotesDesc = `${t('settingUseDailyNotesPluginDesc')}\n${t('settingDailyNotesPreviewExample')} ${previewPath}`;
        
        new Setting(containerEl)
            .setName(t('settingUseDailyNotesPlugin'))
            .setDesc(useDailyNotesDesc)
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
                .setName(t('settingCustomDailyNotesPath'))
                .setDesc(t('settingCustomDailyNotesPathDesc'))
                .addText(text => text
                    .setPlaceholder('Daily Notes/')
                    .setValue(this.plugin.settings.customDailyNotesPath)
                    .onChange(async (value) => {
                        this.plugin.settings.customDailyNotesPath = value;
                        await this.plugin.saveSettings();
                        this.display();
                    }));

            const formatPreviewPath = await getDailyNotePath(this.app, this.plugin.settings);
            const formatDesc = `${t('settingCustomDailyNotesFormatDesc')}\n${t('settingDailyNotesPreviewExample')} ${formatPreviewPath}`;
            
            new Setting(containerEl)
                .setName(t('settingCustomDailyNotesFormat'))
                .setDesc(formatDesc)
                .addText(text => text
                    .setPlaceholder('YYYY-MM-DD')
                    .setValue(this.plugin.settings.customDailyNotesFormat)
                    .onChange(async (value) => {
                        this.plugin.settings.customDailyNotesFormat = value;
                        await this.plugin.saveSettings();
                        this.display();
                    }));
        }

        // Period Type Setting
        new Setting(containerEl)
            .setName(t('settingDisplayPeriod'))
            .setDesc(t('settingDisplayPeriodDesc'))
            .addDropdown(dropdown => dropdown
                .addOption('1month', t('period1Month'))
                .addOption('3months', t('period3Months'))
                .addOption('6months', t('period6Months'))
                .addOption('12months', t('period12Months'))
                .addOption('custom', t('periodCustom'))
                .setValue(this.plugin.settings.periodType)
                .onChange(async (value) => {
                    this.plugin.settings.periodType = value;
                    await this.plugin.saveSettings();
                    this.display();
                    this.plugin.updateView();
                }));

        // Custom Date Fields
        if (this.plugin.settings.periodType === 'custom') {
            containerEl.createEl('h3', { text: t('settingCustomDateRange') });

            const startDateSetting = new Setting(containerEl)
                .setName(t('settingStartDate'))
                .setDesc(t('settingStartDateDesc'));
            
            const startDateInput = startDateSetting.controlEl.createEl('input', {
                type: 'date',
                cls: 'activity-date-input'
            });
            startDateInput.value = this.plugin.settings.customStartDate;
            startDateInput.addEventListener('change', async (e) => {
                this.plugin.settings.customStartDate = e.target.value;
                await this.plugin.saveSettings();
                this.plugin.updateView();
            });

            const endDateSetting = new Setting(containerEl)
                .setName(t('settingEndDate'))
                .setDesc(t('settingEndDateDesc'));
            
            const endDateInput = endDateSetting.controlEl.createEl('input', {
                type: 'date',
                cls: 'activity-date-input'
            });
            endDateInput.value = this.plugin.settings.customEndDate;
            endDateInput.addEventListener('change', async (e) => {
                this.plugin.settings.customEndDate = e.target.value;
                await this.plugin.saveSettings();
                this.plugin.updateView();
            });
        }

        // Activity Colors Section - Collapsible
        const colorsSection = containerEl.createEl('details', { cls: 'activity-colors-section' });
        const colorsSummary = colorsSection.createEl('summary', { cls: 'activity-colors-header' });
        colorsSummary.createEl('span', { text: t('settingActivityColors') });

        // Light Theme Colors
        colorsSection.createEl('h4', { text: t('settingLightTheme'), cls: 'activity-colors-subheader' });
        this.renderColorSetting(colorsSection, t('settingLevel0'), 'lightLevel0');
        this.renderColorSetting(colorsSection, t('settingLevel1'), 'lightLevel1');
        this.renderColorSetting(colorsSection, t('settingLevel2'), 'lightLevel2');
        this.renderColorSetting(colorsSection, t('settingLevel3'), 'lightLevel3');
        this.renderColorSetting(colorsSection, t('settingLevel4'), 'lightLevel4');

        // Dark Theme Colors
        colorsSection.createEl('h4', { text: t('settingDarkTheme'), cls: 'activity-colors-subheader' });
        this.renderColorSetting(colorsSection, t('settingLevel0'), 'darkLevel0');
        this.renderColorSetting(colorsSection, t('settingLevel1'), 'darkLevel1');
        this.renderColorSetting(colorsSection, t('settingLevel2'), 'darkLevel2');
        this.renderColorSetting(colorsSection, t('settingLevel3'), 'darkLevel3');
        this.renderColorSetting(colorsSection, t('settingLevel4'), 'darkLevel4');

        // Reset Colors Button
        new Setting(colorsSection)
            .setName(t('settingResetColors'))
            .setDesc(t('settingResetColorsDesc'))
            .addButton(button => button
                .setButtonText(t('settingResetButton'))
                .onClick(async () => {
                    this.plugin.settings.lightLevel0 = '#ebedf0';
                    this.plugin.settings.lightLevel1 = '#9be9a8';
                    this.plugin.settings.lightLevel2 = '#40c463';
                    this.plugin.settings.lightLevel3 = '#30a14e';
                    this.plugin.settings.lightLevel4 = '#216e39';
                    this.plugin.settings.darkLevel0 = '#161b22';
                    this.plugin.settings.darkLevel1 = '#0e4429';
                    this.plugin.settings.darkLevel2 = '#006d32';
                    this.plugin.settings.darkLevel3 = '#26a641';
                    this.plugin.settings.darkLevel4 = '#39d353';
                    await this.plugin.saveSettings();
                    this.display();
                    this.plugin.updateView();
                }));
    }

    renderColorSetting(containerEl, name, settingKey) {
        const setting = new Setting(containerEl)
            .setName(name);
        
        const colorInput = setting.controlEl.createEl('input', {
            type: 'color',
            cls: 'activity-color-input'
        });
        colorInput.value = this.plugin.settings[settingKey];
        colorInput.addEventListener('change', async (e) => {
            this.plugin.settings[settingKey] = e.target.value;
            await this.plugin.saveSettings();
            this.plugin.updateView();
        });
    }
}
