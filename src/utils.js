/**
 * Format a date to YYYY-MM-DD string
 */
export function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Get activity level based on count (0-4)
 */
export function getActivityLevel(count) {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 5) return 2;
    if (count <= 10) return 3;
    return 4;
}

/**
 * Calculate date range based on settings
 */
export function getDateRange(settings) {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    let startDate = new Date(today);
    
    switch (settings.periodType) {
        case '1month':
            startDate.setMonth(today.getMonth() - 1);
            break;
        case '3months':
            startDate.setMonth(today.getMonth() - 3);
            break;
        case '6months':
            startDate.setMonth(today.getMonth() - 6);
            break;
        case '12months':
            startDate.setFullYear(today.getFullYear() - 1);
            break;
        case 'custom':
            if (settings.customStartDate && settings.customEndDate) {
                startDate = new Date(settings.customStartDate);
                const endDate = new Date(settings.customEndDate);
                endDate.setHours(23, 59, 59, 999);
                return { startDate, endDate };
            } else {
                startDate.setFullYear(today.getFullYear() - 1);
            }
            break;
        default:
            startDate.setFullYear(today.getFullYear() - 1);
    }
    
    startDate.setHours(0, 0, 0, 0);
    return { startDate, endDate: today };
}

/**
 * Get all months in a date range
 */
export function getMonthsInRange(startDate, endDate) {
    const months = [];
    const current = new Date(startDate);
    current.setDate(1);
    
    while (current <= endDate) {
        months.push(new Date(current));
        current.setMonth(current.getMonth() + 1);
    }
    
    return months;
}
