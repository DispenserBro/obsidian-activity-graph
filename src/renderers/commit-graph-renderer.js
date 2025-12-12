/**
 * Commit Graph Renderer - GitHub-style contribution graph
 */
import { BaseRenderer } from './base-renderer.js';
import { formatDate, getActivityLevel } from '../utils.js';
import { MONTH_NAMES_SHORT, DAY_LABELS, SQUARE_SIZE, GAP } from '../constants.js';

export class CommitGraphRenderer extends BaseRenderer {
    render(container, activityData, startDate, endDate) {
        const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        const weeks = Math.ceil(daysDiff / 7);
        const weekWidth = SQUARE_SIZE + GAP;
        
        this.renderMonthLabels(container, startDate, endDate, weeks, weekWidth);
        
        const graphWrapper = container.createEl('div', { cls: 'graph-wrapper' });
        this.renderDayLabels(graphWrapper);
        
        const weeksContainer = graphWrapper.createEl('div', { cls: 'graph-weeks' });
        this.renderWeeks(weeksContainer, activityData, startDate, endDate, weeks);
        
        this.renderLegend(container);
    }

    renderMonthLabels(container, startDate, endDate, weeks, weekWidth) {
        const monthLabels = container.createEl('div', { cls: 'graph-months' });
        
        let currentMonth = startDate.getMonth();
        let currentYear = startDate.getFullYear();
        
        for (let week = 0; week < weeks; week++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + (week * 7));
            
            if (date > endDate) break;
            
            const dateMonth = date.getMonth();
            const dateYear = date.getFullYear();
            
            if (week === 0 || dateMonth !== currentMonth || dateYear !== currentYear) {
                const monthLabel = monthLabels.createEl('span', { 
                    text: MONTH_NAMES_SHORT[dateMonth],
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
        DAY_LABELS.forEach(day => {
            dayLabels.createEl('span', { text: day, cls: 'day-label' });
        });
    }

    renderWeeks(weeksContainer, activityData, startDate, endDate, weeks) {
        for (let week = 0; week < weeks; week++) {
            const weekCol = weeksContainer.createEl('div', { cls: 'graph-week' });
            
            for (let day = 0; day < 7; day++) {
                const date = new Date(startDate);
                date.setDate(date.getDate() + (week * 7) + day);
                
                if (date > endDate) continue;
                
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
