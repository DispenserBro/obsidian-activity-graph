/**
 * Calendar Renderer - Monthly calendar view
 */
import { BaseRenderer } from './base-renderer.js';
import { formatDate, getActivityLevel, getMonthsInRange } from '../utils.js';
import { MONTH_NAMES_FULL, DAY_NAMES_SHORT } from '../constants.js';

export class CalendarRenderer extends BaseRenderer {
    render(container, activityData, startDate, endDate) {
        const months = getMonthsInRange(startDate, endDate);
        const calendarContainer = container.createEl('div', { cls: 'calendar-container' });
        
        for (const monthDate of months) {
            this.renderMonthCard(calendarContainer, monthDate, activityData, startDate, endDate);
        }
        
        this.renderLegend(container, 'calendar-legend');
    }

    renderMonthCard(container, monthDate, activityData, startDate, endDate) {
        const year = monthDate.getFullYear();
        const month = monthDate.getMonth();
        
        const monthCard = container.createEl('div', { cls: 'calendar-month-card' });
        
        const monthHeader = monthCard.createEl('div', { cls: 'calendar-month-header' });
        monthHeader.createEl('span', { text: `${MONTH_NAMES_FULL[month]} ${year}` });
        
        this.renderDayNamesRow(monthCard);
        
        const calendarGrid = monthCard.createEl('div', { cls: 'calendar-grid' });
        
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const firstDayWeekday = firstDayOfMonth.getDay();
        const totalDays = lastDayOfMonth.getDate();
        
        for (let i = 0; i < firstDayWeekday; i++) {
            calendarGrid.createEl('div', { cls: 'calendar-day empty' });
        }
        
        for (let day = 1; day <= totalDays; day++) {
            this.renderDayCell(calendarGrid, year, month, day, activityData, startDate, endDate);
        }
    }

    renderDayNamesRow(monthCard) {
        const dayNamesRow = monthCard.createEl('div', { cls: 'calendar-day-names' });
        DAY_NAMES_SHORT.forEach(day => {
            dayNamesRow.createEl('span', { text: day, cls: 'calendar-day-name' });
        });
    }

    renderDayCell(calendarGrid, year, month, day, activityData, startDate, endDate) {
        const date = new Date(year, month, day);
        const dateStr = formatDate(date);
        const isInRange = date >= startDate && date <= endDate;
        
        if (isInRange) {
            const count = activityData[dateStr] || 0;
            const level = getActivityLevel(count);
            
            let dayClass = `calendar-day level-${level}`;
            if (this.shouldHighlightToday() && this.isToday(dateStr)) {
                dayClass += ' today';
            }
            
            const dayCell = calendarGrid.createEl('div', { 
                cls: dayClass,
                text: day.toString()
            });
            
            // Apply custom highlight color
            if (this.shouldHighlightToday() && this.isToday(dateStr)) {
                dayCell.style.outlineColor = this.getHighlightColor();
            }
            
            dayCell.setAttribute('data-date', dateStr);
            dayCell.setAttribute('data-count', count);
            
            this.addTooltipListeners(dayCell, dateStr, count);
        } else {
            calendarGrid.createEl('div', { 
                cls: 'calendar-day out-of-range',
                text: day.toString()
            });
        }
    }
}
