/**
 * Calendar Renderer - Monthly calendar view with optional navigation
 */
import { BaseRenderer } from './base-renderer';
import { formatDate, getActivityLevel, getMonthsInRange } from '../utils';
import { getMonthFull, getDaysShort, ts } from '../localization';
import type { ActivityData, ActivityGraphPlugin } from '../types';
import type { ActivityGraphSettings } from '../types';

export class CalendarRenderer extends BaseRenderer {
    private compactMode: boolean;
    private months!: Date[];
    private currentMonthIndex!: number;
    private activityData!: ActivityData;
    private startDate!: Date;
    private endDate!: Date;
    private container!: HTMLElement;
    private calendarContainer!: HTMLElement;

    constructor(plugin: ActivityGraphPlugin | null = null, customSettings: Partial<ActivityGraphSettings> | null = null, compactMode: boolean = false) {
        super(plugin, customSettings);
        this.compactMode = compactMode; // true = single month with navigation, false = all months
    }

    render(container: HTMLElement, activityData: ActivityData, startDate: Date, endDate: Date): void {
        this.months = getMonthsInRange(startDate, endDate);
        this.currentMonthIndex = this.months.length - 1; // Start with most recent month
        this.activityData = activityData;
        this.startDate = startDate;
        this.endDate = endDate;
        this.container = container;
        
        // Add custom color styles if customSettings exist
        if (this.customSettings && this.customSettings.lightTheme && this.customSettings.darkTheme) {
            const light = this.customSettings.lightTheme;
            const dark = this.customSettings.darkTheme;
            
            // Set CSS variables for custom colors
            for (let i = 0; i <= 4; i++) {
                const bgColor = light[`level${i}` as keyof typeof light];
                if (bgColor) {
                    container.style.setProperty(`--activity-light-level-${i}`, bgColor);
                }
                const textColor = light[`textLevel${i}` as keyof typeof light];
                if (textColor) {
                    container.style.setProperty(`--activity-light-text-level-${i}`, textColor);
                }
            }
            for (let i = 0; i <= 4; i++) {
                const bgColor = dark[`level${i}` as keyof typeof dark];
                if (bgColor) {
                    container.style.setProperty(`--activity-dark-level-${i}`, bgColor);
                }
                const textColor = dark[`textLevel${i}` as keyof typeof dark];
                if (textColor) {
                    container.style.setProperty(`--activity-dark-text-level-${i}`, textColor);
                }
            }
        }
        
        // Add global handlers to hide tooltip on scroll/outside click
        this.addGlobalTooltipHandlers();
        
        this.calendarContainer = container.createEl('div', { cls: 'calendar-container' });
        
        if (this.compactMode) {
            this.renderCurrentMonth();
        } else {
            this.renderAllMonths();
        }
        
        this.renderLegend(container, 'calendar-legend');
    }

    renderAllMonths(): void {
        this.calendarContainer.empty();
        
        for (const monthDate of this.months) {
            this.renderMonthCard(this.calendarContainer, monthDate, false);
        }
    }

    renderCurrentMonth(): void {
        this.calendarContainer.empty();
        
        const monthDate = this.months[this.currentMonthIndex];
        const showNavigation = this.months.length > 1;
        
        this.renderMonthCard(this.calendarContainer, monthDate, showNavigation);
    }

    renderMonthCard(container: HTMLElement, monthDate: Date, showNavigation: boolean): void {
        const year = monthDate.getFullYear();
        const month = monthDate.getMonth();
        
        const monthCard = container.createEl('div', { cls: 'calendar-month-card' });
        
        const monthHeader = monthCard.createEl('div', { cls: 'calendar-month-header' });
        
        if (showNavigation) {
            // Left arrow
            const leftArrow = monthHeader.createEl('button', { 
                cls: 'calendar-nav-btn calendar-nav-prev',
                attr: { 'aria-label': ts('navPrevMonth') }
            });
            leftArrow.textContent = '‹';
            leftArrow.disabled = this.currentMonthIndex === 0;
            leftArrow.addEventListener('click', () => this.navigateMonth(-1));
        }
        
        monthHeader.createEl('span', { 
            text: `${getMonthFull(month)} ${year}`,
            cls: 'calendar-month-title'
        });
        
        if (showNavigation) {
            // Right arrow
            const rightArrow = monthHeader.createEl('button', { 
                cls: 'calendar-nav-btn calendar-nav-next',
                attr: { 'aria-label': ts('navNextMonth') }
            });
            rightArrow.textContent = '›';
            rightArrow.disabled = this.currentMonthIndex === this.months.length - 1;
            rightArrow.addEventListener('click', () => this.navigateMonth(1));
        }
        
        this.renderDayNamesRow(monthCard);
        
        const calendarGrid = monthCard.createEl('div', { cls: 'calendar-grid' });
        
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const firstDayWeekday = firstDayOfMonth.getDay();
        const totalDays = lastDayOfMonth.getDate();
        
        // Calculate empty cells based on first day of week setting
        const firstDayOfWeek = this.getFirstDayOfWeek();
        const emptyCells = (firstDayWeekday - firstDayOfWeek + 7) % 7;
        
        for (let i = 0; i < emptyCells; i++) {
            calendarGrid.createEl('div', { cls: 'calendar-day empty' });
        }
        
        for (let day = 1; day <= totalDays; day++) {
            this.renderDayCell(calendarGrid, year, month, day);
        }
    }

    navigateMonth(direction: number): void {
        const newIndex = this.currentMonthIndex + direction;
        if (newIndex >= 0 && newIndex < this.months.length) {
            this.currentMonthIndex = newIndex;
            this.renderCurrentMonth();
        }
    }

    renderDayNamesRow(monthCard: HTMLElement): void {
        const dayNamesRow = monthCard.createEl('div', { cls: 'calendar-day-names' });
        const firstDay = this.getFirstDayOfWeek();
        getDaysShort(firstDay).forEach(day => {
            dayNamesRow.createEl('span', { text: day, cls: 'calendar-day-name' });
        });
    }

    renderDayCell(calendarGrid: HTMLElement, year: number, month: number, day: number): void {
        const date = new Date(year, month, day);
        const dateStr = formatDate(date);
        const isInRange = date >= this.startDate && date <= this.endDate;
        
        if (isInRange) {
            const count = this.activityData[dateStr] || 0;
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
            dayCell.setAttribute('data-count', String(count));
            
            this.addTooltipListeners(dayCell, dateStr, count);
        } else {
            calendarGrid.createEl('div', { 
                cls: 'calendar-day out-of-range',
                text: day.toString()
            });
        }
    }
}
