/**
 * Settings Tab - Plugin configuration UI
 */
import { PluginSettingTab, Setting } from 'obsidian';

export class ActivityGraphSettingTab extends PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display() {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: 'Activity Graph Settings' });

        // Highlight Today Setting
        new Setting(containerEl)
            .setName('Highlight Today')
            .setDesc('Add a visual highlight to the current day on the graph')
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
                .setName('Highlight Color')
                .setDesc('Choose the color for the today highlight');
            
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
            .setName('Display only Tasks')
            .setDesc('Show completed tasks instead of file activity. Uses Tasks plugin format (✅ YYYY-MM-DD or done:: YYYY-MM-DD)')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.displayOnlyTasks)
                .onChange(async (value) => {
                    this.plugin.settings.displayOnlyTasks = value;
                    await this.plugin.saveSettings();
                    this.plugin.updateView();
                }));

        // Display Style Setting
        new Setting(containerEl)
            .setName('Display Style')
            .setDesc('Choose how to display the activity graph')
            .addDropdown(dropdown => dropdown
                .addOption('commitGraph', 'Commit Graph')
                .addOption('calendar', 'Calendar')
                .setValue(this.plugin.settings.displayStyle)
                .onChange(async (value) => {
                    this.plugin.settings.displayStyle = value;
                    await this.plugin.saveSettings();
                    this.plugin.updateView();
                }));

        // Period Type Setting
        new Setting(containerEl)
            .setName('Display Period')
            .setDesc('Choose the time period to display in the activity graph')
            .addDropdown(dropdown => dropdown
                .addOption('1month', '1 Month')
                .addOption('3months', '3 Months')
                .addOption('6months', '6 Months')
                .addOption('12months', '12 Months')
                .addOption('custom', 'Custom Period')
                .setValue(this.plugin.settings.periodType)
                .onChange(async (value) => {
                    this.plugin.settings.periodType = value;
                    await this.plugin.saveSettings();
                    this.display();
                    this.plugin.updateView();
                }));

        // Custom Date Fields
        if (this.plugin.settings.periodType === 'custom') {
            containerEl.createEl('h3', { text: 'Custom Date Range' });

            const startDateSetting = new Setting(containerEl)
                .setName('Start Date')
                .setDesc('Select the start date for the custom period');
            
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
                .setName('End Date')
                .setDesc('Select the end date for the custom period');
            
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
        colorsSummary.createEl('span', { text: 'Activity Level Colors' });

        // Light Theme Colors
        colorsSection.createEl('h4', { text: 'Light Theme', cls: 'activity-colors-subheader' });
        this.renderColorSetting(colorsSection, 'Level 0 (No activity)', 'lightLevel0');
        this.renderColorSetting(colorsSection, 'Level 1 (Low)', 'lightLevel1');
        this.renderColorSetting(colorsSection, 'Level 2 (Medium)', 'lightLevel2');
        this.renderColorSetting(colorsSection, 'Level 3 (High)', 'lightLevel3');
        this.renderColorSetting(colorsSection, 'Level 4 (Very High)', 'lightLevel4');

        // Dark Theme Colors
        colorsSection.createEl('h4', { text: 'Dark Theme', cls: 'activity-colors-subheader' });
        this.renderColorSetting(colorsSection, 'Level 0 (No activity)', 'darkLevel0');
        this.renderColorSetting(colorsSection, 'Level 1 (Low)', 'darkLevel1');
        this.renderColorSetting(colorsSection, 'Level 2 (Medium)', 'darkLevel2');
        this.renderColorSetting(colorsSection, 'Level 3 (High)', 'darkLevel3');
        this.renderColorSetting(colorsSection, 'Level 4 (Very High)', 'darkLevel4');

        // Reset Colors Button
        new Setting(colorsSection)
            .setName('Reset Colors')
            .setDesc('Reset all activity colors to default values')
            .addButton(button => button
                .setButtonText('Reset')
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
