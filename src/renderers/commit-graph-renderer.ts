/**
 * Commit Graph Renderer - GitHub-style contribution graph
 */
import { BaseRenderer } from './base-renderer';
import { formatDate, getActivityLevel } from '../utils';
import { SQUARE_SIZE, GAP } from '../constants';
import { getMonthShort, getDayLabels } from '../localization';
import type { ActivityData } from '../types';

export class CommitGraphRenderer extends BaseRenderer {
    render(container: HTMLElement, activityData: ActivityData, startDate: Date, endDate: Date): void {
        const firstDayOfWeek = this.getFirstDayOfWeek();
        
        // Add custom color styles if customSettings exist
        if (this.customSettings && this.customSettings.lightTheme && this.customSettings.darkTheme) {
            container.addClass('custom-colors');
            const uniqueId = `commit-graph-custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            container.setAttribute('data-style-id', uniqueId);
            
            const styleEl = document.createElement('style');
            styleEl.id = `style-${uniqueId}`;
            const light = this.customSettings.lightTheme;
            const dark = this.customSettings.darkTheme;
            styleEl.textContent = `
                [data-style-id="${uniqueId}"] .theme-light .graph-square.level-0,
                .theme-light [data-style-id="${uniqueId}"] .graph-square.level-0 { background-color: ${light.level0} !important; }
                [data-style-id="${uniqueId}"] .theme-light .graph-square.level-1,
                .theme-light [data-style-id="${uniqueId}"] .graph-square.level-1 { background-color: ${light.level1} !important; }
                [data-style-id="${uniqueId}"] .theme-light .graph-square.level-2,
                .theme-light [data-style-id="${uniqueId}"] .graph-square.level-2 { background-color: ${light.level2} !important; }
                [data-style-id="${uniqueId}"] .theme-light .graph-square.level-3,
                .theme-light [data-style-id="${uniqueId}"] .graph-square.level-3 { background-color: ${light.level3} !important; }
                [data-style-id="${uniqueId}"] .theme-light .graph-square.level-4,
                .theme-light [data-style-id="${uniqueId}"] .graph-square.level-4 { background-color: ${light.level4} !important; }
                [data-style-id="${uniqueId}"] .theme-dark .graph-square.level-0,
                .theme-dark [data-style-id="${uniqueId}"] .graph-square.level-0 { background-color: ${dark.level0} !important; }
                [data-style-id="${uniqueId}"] .theme-dark .graph-square.level-1,
                .theme-dark [data-style-id="${uniqueId}"] .graph-square.level-1 { background-color: ${dark.level1} !important; }
                [data-style-id="${uniqueId}"] .theme-dark .graph-square.level-2,
                .theme-dark [data-style-id="${uniqueId}"] .graph-square.level-2 { background-color: ${dark.level2} !important; }
                [data-style-id="${uniqueId}"] .theme-dark .graph-square.level-3,
                .theme-dark [data-style-id="${uniqueId}"] .graph-square.level-3 { background-color: ${dark.level3} !important; }
                [data-style-id="${uniqueId}"] .theme-dark .graph-square.level-4,
                .theme-dark [data-style-id="${uniqueId}"] .graph-square.level-4 { background-color: ${dark.level4} !important; }
            `;
            document.head.appendChild(styleEl);
        }
        
        // Add global handlers to hide tooltip on scroll/outside click
        this.addGlobalTooltipHandlers();
        
        // Calculate adjusted start date to align with first day of week
        const adjustedStart = new Date(startDate);
        const startDayOfWeek = adjustedStart.getDay();
        const daysToSubtract = (startDayOfWeek - firstDayOfWeek + 7) % 7;
        adjustedStart.setDate(adjustedStart.getDate() - daysToSubtract);
        
        const daysDiff = Math.ceil((endDate.getTime() - adjustedStart.getTime()) / (1000 * 60 * 60 * 24));
        const weeks = Math.ceil(daysDiff / 7);
        const weekWidth = SQUARE_SIZE + GAP;
        
        this.renderMonthLabels(container, adjustedStart, endDate, weeks, weekWidth);
        
        const graphWrapper = container.createEl('div', { cls: 'graph-wrapper' });
        this.renderDayLabels(graphWrapper);
        
        const weeksContainer = graphWrapper.createEl('div', { cls: 'graph-weeks' });
        this.renderWeeks(weeksContainer, activityData, adjustedStart, startDate, endDate, weeks);
        
        this.renderLegend(container);
    }

    renderMonthLabels(container: HTMLElement, adjustedStart: Date, endDate: Date, weeks: number, weekWidth: number): void {
        const monthLabels = container.createEl('div', { cls: 'graph-months' });
        
        let currentMonth = adjustedStart.getMonth();
        let currentYear = adjustedStart.getFullYear();
        
        for (let week = 0; week < weeks; week++) {
            const date = new Date(adjustedStart);
            date.setDate(date.getDate() + (week * 7));
            
            if (date > endDate) break;
            
            const dateMonth = date.getMonth();
            const dateYear = date.getFullYear();
            
            if (week === 0 || dateMonth !== currentMonth || dateYear !== currentYear) {
                const monthLabel = monthLabels.createEl('span', { 
                    text: getMonthShort(dateMonth),
                    cls: 'month-label'
                });
                monthLabel.style.left = (week * weekWidth) + 'px';
                
                currentMonth = dateMonth;
                currentYear = dateYear;
            }
        }
    }

    renderDayLabels(graphWrapper: HTMLElement): void {
        const dayLabels = graphWrapper.createEl('div', { cls: 'graph-days' });
        const firstDay = this.getFirstDayOfWeek();
        const labels = getDayLabels(firstDay);
        
        // Sunday start: labels at positions 1, 3, 5 (Mon, Wed, Fri)
        // Monday start: labels at positions 0, 2, 4 (Mon, Wed, Fri)
        const startOffset = firstDay === 0 ? 1 : 0;
        
        for (let i = 0; i < 7; i++) {
            const adjustedIndex = i - startOffset;
            if (adjustedIndex >= 0 && adjustedIndex % 2 === 0 && adjustedIndex / 2 < labels.length) {
                dayLabels.createEl('span', { text: labels[adjustedIndex / 2], cls: 'day-label' });
            } else {
                dayLabels.createEl('span', { text: '', cls: 'day-label' });
            }
        }
    }

    renderWeeks(weeksContainer: HTMLElement, activityData: ActivityData, adjustedStart: Date, originalStart: Date, endDate: Date, weeks: number): void {
        for (let week = 0; week < weeks; week++) {
            const weekCol = weeksContainer.createEl('div', { cls: 'graph-week' });
            
            for (let day = 0; day < 7; day++) {
                const date = new Date(adjustedStart);
                date.setDate(date.getDate() + (week * 7) + day);
                
                if (date > endDate) continue;
                
                if (date < originalStart) {
                    // Create empty placeholder for dates before original start
                    weekCol.createEl('div', { cls: 'graph-square empty' });
                    continue;
                }
                
                const dateStr = formatDate(date);
                const count = activityData[dateStr] || 0;
                const level = getActivityLevel(count);
                
                let squareClass = `graph-square level-${level}`;
                if (this.shouldHighlightToday() && this.isToday(dateStr)) {
                    squareClass += ' today';
                }
                
                const square = weekCol.createEl('div', { 
                    cls: squareClass
                });
                
                // Apply custom highlight color
                if (this.shouldHighlightToday() && this.isToday(dateStr)) {
                    square.style.outlineColor = this.getHighlightColor();
                }
                
                square.setAttribute('data-date', dateStr);
                square.setAttribute('data-count', String(count));
                
                this.addTooltipListeners(square, dateStr, count);
            }
        }
    }
}
