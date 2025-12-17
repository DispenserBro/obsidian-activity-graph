/**
 * Activity Graph Plugin for Obsidian
 * GitHub-style activity graph to track your writing activity
 */
import { Plugin } from 'obsidian';
import { VIEW_TYPE_ACTIVITY_GRAPH, DEFAULT_SETTINGS } from './constants';
import { formatDate } from './utils';
import { loadTasksFromVault, loadTasksStatusFromDailyNotes } from './tasks-parser';
import { ActivityGraphView } from './views/activity-graph-view';
import { ActivityGraphSettingTab } from './settings/settings-tab';
import { CodeBlockProcessor } from './processors/code-block-processor';
import { initLocale } from './localization';
import type { ActivityGraphSettings, ActivityData, TasksStatusData } from './types';

export default class ActivityGraphPlugin extends Plugin {
    settings!: ActivityGraphSettings;
    activityData!: ActivityData;
    tasksData!: ActivityData;
    tasksStatusData!: TasksStatusData;

    /**
     * Check if Tasks plugin is installed and enabled
     */
    isTasksPluginEnabled(): boolean {
        // @ts-ignore - accessing internal API
        const tasksPlugin = this.app.plugins.plugins['obsidian-tasks-plugin'];
        // @ts-ignore
        return tasksPlugin && this.app.plugins.enabledPlugins.has('obsidian-tasks-plugin');
    }

    async onload(): Promise<void> {
        
        // Initialize localization
        initLocale(this.app);
        
        await this.loadSettings();
        await this.loadActivityData();
        
        this.addSettingTab(new ActivityGraphSettingTab(this.app, this));
        
        this.registerView(
            VIEW_TYPE_ACTIVITY_GRAPH,
            (leaf) => new ActivityGraphView(leaf, this)
        );
        
        // Register code block processor for embedding in notes
        const codeBlockProcessor = new CodeBlockProcessor(this);
        codeBlockProcessor.register();
        
        this.addRibbonIcon('bar-chart', 'Open activity graph', () => {
            void this.activateView();
        });
        
        this.addCommand({
            id: 'open',
            name: 'Open',
            callback: () => {
                void this.activateView();
            }
        });
        
        this.registerEvent(
            this.app.vault.on('modify', (file) => {
                this.recordActivity();
            })
        );
        
        this.registerEvent(
            this.app.vault.on('create', (file) => {
                this.recordActivity();
            })
        );
        
        this.registerInterval(
            window.setInterval(() => void this.saveActivityData(), 60000)
        );
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
        
        // If Tasks plugin is not enabled, disable displayOnlyTasks
        if (!this.isTasksPluginEnabled() && this.settings.displayOnlyTasks) {
            this.settings.displayOnlyTasks = false;
            await this.saveSettings();
        }
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    async loadActivityData() {
        const data = await this.loadData();
        this.activityData = data?.activityData || {};
        this.tasksData = {};
        this.tasksStatusData = {};
    }

    async loadTasksData() {
        this.tasksData = await loadTasksFromVault(this.app.vault);
    }

    async loadTasksStatusData() {
        this.tasksStatusData = await loadTasksStatusFromDailyNotes(this.app.vault, this.app);
    }

    async saveActivityData() {
        const currentData = await this.loadData() || {};
        currentData.activityData = this.activityData;
        await this.saveData(currentData);
    }

    recordActivity() {
        const today = new Date();
        const dateStr = formatDate(today);
        
        if (!this.activityData[dateStr]) {
            this.activityData[dateStr] = 0;
        }
        
        this.activityData[dateStr]++;
        this.updateView();
    }

    async activateView() {
        const { workspace } = this.app;
        
        let leaf = workspace.getLeavesOfType(VIEW_TYPE_ACTIVITY_GRAPH)[0];
        
        if (!leaf) {
            leaf = workspace.getRightLeaf(false);
            await leaf.setViewState({
                type: VIEW_TYPE_ACTIVITY_GRAPH,
                active: true
            });
        }
        
        workspace.revealLeaf(leaf);
    }

    updateView() {
        const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_ACTIVITY_GRAPH);
        leaves.forEach(leaf => {
            if (leaf.view instanceof ActivityGraphView) {
                void leaf.view.onOpen();
            }
        });
    }

    async onunload() {
        await this.saveActivityData();
    }
}
