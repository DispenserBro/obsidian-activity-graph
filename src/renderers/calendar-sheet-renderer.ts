/**
 * Calendar Sheet Renderer - Single month calendar view similar to obsidian-calendar-plugin
 * Shows one month at a time with navigation arrows
 */
import { BaseRenderer } from './base-renderer';
import { formatDate, getMonthsInRange } from '../utils';
import { getMonthFull, getDaysShort, ts } from '../localization';
import type { ActivityData, TasksStatusData, ActivityDotPosition } from '../types';

export class CalendarSheetRenderer extends BaseRenderer {
    private months: Date[] = [];
    private currentMonthIndex: number = 0;
    private activityData: ActivityData = {};
    private tasksStatusData: TasksStatusData = {};
    private dotPosition: ActivityDotPosition = 'center';
    private startDate!: Date;
    private endDate!: Date;
    private container!: HTMLElement;
    private sheetContainer!: HTMLElement;

    render(
        container: HTMLElement, 
        activityData: ActivityData, 
        startDate: Date, 
        endDate: Date,
        tasksStatusData: TasksStatusData = {},
        dotPosition: ActivityDotPosition = 'center'
    ): void {
        this.months = getMonthsInRange(startDate, endDate);
        this.currentMonthIndex = this.months.length - 1; // Start with most recent month
        this.activityData = activityData;
        this.tasksStatusData = tasksStatusData;
        this.dotPosition = dotPosition;
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

        // Add global handlers to hide tooltip
        this.addGlobalTooltipHandlers();

        this.sheetContainer = container.createEl('div', { cls: 'calendar-sheet-container' });
        
        this.renderCurrentMonth();
    }

    private renderCurrentMonth(): void {
        this.sheetContainer.empty();

        const monthDate = this.months[this.currentMonthIndex];
        
        // Navigation header
        if (this.months.length > 1) {
            this.renderNavigation();
        }

        // Month card
        this.renderMonthCard(this.sheetContainer, monthDate);
    }

    private renderNavigation(): void {
        const nav = this.sheetContainer.createEl('div', { cls: 'calendar-sheet-nav' });

        // Previous month button
        const prevBtn = nav.createEl('button', { 
            cls: 'calendar-sheet-nav-btn',
            attr: { 'aria-label': ts('navPrevMonth') }
        });
        prevBtn.textContent = '‹';
        prevBtn.addEventListener('click', () => this.navigateMonth(-1));
        
        if (this.currentMonthIndex <= 0) {
            prevBtn.addClass('disabled');
        }

        // Current month title
        const monthDate = this.months[this.currentMonthIndex];
        nav.createEl('div', { 
            text: `${getMonthFull(monthDate.getMonth())} ${monthDate.getFullYear()}`,
            cls: 'calendar-sheet-nav-title'
        });

        // Next month button
        const nextBtn = nav.createEl('button', { 
            cls: 'calendar-sheet-nav-btn',
            attr: { 'aria-label': ts('navNextMonth') }
        });
        nextBtn.textContent = '›';
        nextBtn.addEventListener('click', () => this.navigateMonth(1));
        
        if (this.currentMonthIndex >= this.months.length - 1) {
            nextBtn.addClass('disabled');
        }
    }

    private navigateMonth(direction: number): void {
        const newIndex = this.currentMonthIndex + direction;
        if (newIndex >= 0 && newIndex < this.months.length) {
            this.currentMonthIndex = newIndex;
            this.renderCurrentMonth();
        }
    }

    private renderMonthCard(container: HTMLElement, monthDate: Date): void {
        const monthCard = container.createEl('div', { cls: 'calendar-sheet-month' });

        // Calendar grid
        const grid = monthCard.createEl('div', { cls: 'calendar-sheet-grid' });

        // Day headers
        this.renderDayHeaders(grid);

        // Calendar days
        this.renderDays(grid, monthDate);
    }

    private renderDayHeaders(grid: HTMLElement): void {
        const firstDay = this.getFirstDayOfWeek();
        const daysShort = getDaysShort();

        for (let i = 0; i < 7; i++) {
            const dayIndex = (firstDay + i) % 7;
            grid.createEl('div', { 
                text: daysShort[dayIndex],
                cls: 'calendar-sheet-day-header'
            });
        }
    }

    private renderDays(grid: HTMLElement, monthDate: Date): void {
        const firstDay = this.getFirstDayOfWeek();
        const year = monthDate.getFullYear();
        const month = monthDate.getMonth();
        const date = new Date(year, month, 1);
        const firstDayOfMonth = date.getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Calculate offset for first day
        const offset = (firstDayOfMonth - firstDay + 7) % 7;

        // Empty cells before month starts
        for (let i = 0; i < offset; i++) {
            grid.createEl('div', { cls: 'calendar-sheet-day empty' });
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(year, month, day);
            const dateStr = formatDate(currentDate);
            const count = this.activityData[dateStr] || 0;
            const taskStatus = this.tasksStatusData[dateStr];
            const level = this.getActivityLevel(count);
            
            const dayCell = grid.createEl('div', { cls: 'calendar-sheet-day' });
            
            // Add activity level class if there's activity
            if (count > 0) {
                dayCell.addClass('has-activity');
                dayCell.addClass(`level-${level}`);
            }

            // Date number
            const dayNumber = dayCell.createEl('div', { 
                text: String(day),
                cls: 'calendar-sheet-day-number'
            });

            // Task status indicators (dots below date)
            if (taskStatus) {
                const dotsContainer = dayCell.createEl('div', { cls: 'calendar-sheet-task-dots' });
                
                if (taskStatus.hasIncompleteTasks) {
                    // Show both filled and empty dots
                    dotsContainer.createEl('div', { cls: 'calendar-sheet-task-dot filled' });
                    dotsContainer.createEl('div', { cls: 'calendar-sheet-task-dot empty' });
                } else if (taskStatus.hasCompletedTasks) {
                    // Show only filled dot
                    dotsContainer.createEl('div', { cls: 'calendar-sheet-task-dot filled' });
                }
            }

            // Activity indicator (dot)
            if (count > 0) {
                const dot = dayCell.createEl('div', { cls: 'calendar-sheet-dot' });
                
                // Set color based on activity level
                dot.addClass(`level-${level}`);
                
                // Add position class
                dot.addClass(`position-${this.dotPosition}`);
                
                // For center position and higher activity levels (3-4), make text darker for better contrast
                if (this.dotPosition === 'center' && level >= 3) {
                    dayNumber.addClass('dark-text');
                }
            }

            // Highlight today
            if (this.shouldHighlightToday() && dateStr === this.todayStr) {
                dayCell.addClass('today');
                const highlightColor = this.getHighlightColor();
                dayCell.style.setProperty('--highlight-color', highlightColor);
            }

            // Check if date is in range
            if (currentDate < this.startDate || currentDate > this.endDate) {
                dayCell.addClass('out-of-range');
            }

            // Add tooltip and click listeners
            this.addTooltipListeners(dayCell, dateStr, count);
        }
    }

    private getActivityLevel(count: number): number {
        if (count === 0) return 0;
        if (count <= 2) return 1;
        if (count <= 5) return 2;
        if (count <= 10) return 3;
        return 4;
    }
}
