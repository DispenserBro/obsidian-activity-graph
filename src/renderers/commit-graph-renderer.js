/**
 * Commit Graph Renderer - GitHub-style contribution graph
 */
import { BaseRenderer } from './base-renderer.js';
import { formatDate, getActivityLevel } from '../utils.js';
import { SQUARE_SIZE, GAP } from '../constants.js';
import { getMonthShort, getDayLabels } from '../localization.js';

export class CommitGraphRenderer extends BaseRenderer {
    render(container, activityData, startDate, endDate) {
        const firstDayOfWeek = this.getFirstDayOfWeek();
        
        // Calculate adjusted start date to align with first day of week
        const adjustedStart = new Date(startDate);
        const startDayOfWeek = adjustedStart.getDay();
        const daysToSubtract = (startDayOfWeek - firstDayOfWeek + 7) % 7;
        adjustedStart.setDate(adjustedStart.getDate() - daysToSubtract);
        
        const daysDiff = Math.ceil((endDate - adjustedStart) / (1000 * 60 * 60 * 24));
        const weeks = Math.ceil(daysDiff / 7);
        const weekWidth = SQUARE_SIZE + GAP;
        
        this.renderMonthLabels(container, adjustedStart, endDate, weeks, weekWidth);
        
        const graphWrapper = container.createEl('div', { cls: 'graph-wrapper' });
        this.renderDayLabels(graphWrapper);
        
        const weeksContainer = graphWrapper.createEl('div', { cls: 'graph-weeks' });
        this.renderWeeks(weeksContainer, activityData, adjustedStart, startDate, endDate, weeks);
        
        this.renderLegend(container);
    }

    renderMonthLabels(container, adjustedStart, endDate, weeks, weekWidth) {
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

    renderDayLabels(graphWrapper) {
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

    renderWeeks(weeksContainer, activityData, adjustedStart, originalStart, endDate, weeks) {
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
                square.setAttribute('data-count', count);
                
                this.addTooltipListeners(square, dateStr, count);
            }
        }
    }
}
