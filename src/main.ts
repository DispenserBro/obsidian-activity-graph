/**
 * Activity Graph Plugin for Obsidian
 * GitHub-style activity graph to track your writing activity
 */
import { Plugin } from 'obsidian';
import { VIEW_TYPE_ACTIVITY_GRAPH, DEFAULT_SETTINGS } from './constants';
import { formatDate } from './utils';
import { loadTasksFromVault } from './tasks-parser';
import { ActivityGraphView } from './views/activity-graph-view';
import { ActivityGraphSettingTab } from './settings/settings-tab';
import { CodeBlockProcessor } from './processors/code-block-processor';
import { initLocale } from './localization';
import type { ActivityGraphSettings, ActivityData } from './types';

export default class ActivityGraphPlugin extends Plugin {
    settings!: ActivityGraphSettings;
    activityData!: ActivityData;
    tasksData!: ActivityData;

    async onload(): Promise<void> {
        console.log('Loading Activity Graph plugin');
        
        // Initialize localization
        await initLocale(this.app);
        
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
        
        this.addRibbonIcon('bar-chart', 'Open Activity Graph', () => {
            this.activateView();
        });
        
        this.addCommand({
            id: 'open-activity-graph',
            name: 'Open Activity Graph',
            callback: () => {
                this.activateView();
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
            window.setInterval(() => this.saveActivityData(), 60000)
        );
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    async loadActivityData() {
        const data = await this.loadData();
        this.activityData = data?.activityData || {};
        this.tasksData = {};
    }

    async loadTasksData() {
        this.tasksData = await loadTasksFromVault(this.app.vault);
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
                leaf.view.onOpen();
            }
        });
    }

    async onunload() {
        console.log('Unloading Activity Graph plugin');
        await this.saveActivityData();
    }
}
