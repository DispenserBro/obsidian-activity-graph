import { Vault, App } from 'obsidian';
import { ActivityData } from './types/ActivityData';
import { TasksStatusData } from './types/DayTasksStatus';

/**
 * Extract completed task dates from file content
 */
function extractCompletedTaskDates(content: string): string[] {
    const dates: string[] = [];
    const lines = content.split('\n');
    
    for (const line of lines) {
        if (!/^[\s]*[-*]\s*\[x\]/i.test(line)) {
            continue;
        }
        
        // Pattern 1: Tasks plugin format with emoji ✅ YYYY-MM-DD
        const emojiMatch = line.match(/✅\s*(\d{4}-\d{2}-\d{2})/);
        if (emojiMatch) {
            dates.push(emojiMatch[1]);
            continue;
        }
        
        // Pattern 2: Dataview format done:: YYYY-MM-DD
        const dataviewMatch = line.match(/done::\s*(\d{4}-\d{2}-\d{2})/);
        if (dataviewMatch) {
            dates.push(dataviewMatch[1]);
            continue;
        }
        
        // Pattern 3: completion:: YYYY-MM-DD
        const completionMatch = line.match(/completion::\s*(\d{4}-\d{2}-\d{2})/);
        if (completionMatch) {
            dates.push(completionMatch[1]);
            continue;
        }
        
        // Pattern 4: [completion:: YYYY-MM-DD] (inline dataview)
        const inlineMatch = line.match(/\[completion::\s*(\d{4}-\d{2}-\d{2})\]/);
        if (inlineMatch) {
            dates.push(inlineMatch[1]);
            continue;
        }
    }
    
    return dates;
}

/**
 * Load tasks data from all markdown files in vault
 */
export async function loadTasksFromVault(vault: Vault): Promise<ActivityData> {
    const tasksData: ActivityData = {};
    const files = vault.getMarkdownFiles();
    
    for (const file of files) {
        try {
            const content = await vault.cachedRead(file);
            const completedDates = extractCompletedTaskDates(content);
            
            for (const date of completedDates) {
                if (!tasksData[date]) {
                    tasksData[date] = 0;
                }
                tasksData[date]++;
            }
        } catch {
            // Silently ignore errors reading files
        }
    }
    
    return tasksData;
}

/**
 * Analyze tasks in a file and return status
 */
function analyzeFileTasks(content: string): { hasCompleted: boolean; hasIncomplete: boolean } {
    const lines = content.split('\n');
    let hasCompleted = false;
    let hasIncomplete = false;
    
    for (const line of lines) {
        // Check for task markers
        const isTask = /^[\s]*[-*]\s*\[([ xX])\]/.test(line);
        if (!isTask) continue;
        
        // Check if completed
        const isCompleted = /^[\s]*[-*]\s*\[x\]/i.test(line);
        
        if (isCompleted) {
            hasCompleted = true;
        } else {
            hasIncomplete = true;
        }
        
        // Early exit if we found both types
        if (hasCompleted && hasIncomplete) {
            break;
        }
    }
    
    return { hasCompleted, hasIncomplete };
}

/**
 * Load tasks status for daily notes
 * Returns a map of date -> task status
 */
export async function loadTasksStatusFromDailyNotes(
    vault: Vault,
    app: App
): Promise<TasksStatusData> {
    const statusData: TasksStatusData = {};
    const files = vault.getMarkdownFiles();
    
    for (const file of files) {
        try {
            // Try to extract date from filename
            const dateMatch = file.basename.match(/(\d{4}-\d{2}-\d{2})/);
            if (!dateMatch) continue;
            
            const dateStr = dateMatch[1];
            const content = await vault.cachedRead(file);
            const { hasCompleted, hasIncomplete } = analyzeFileTasks(content);
            
            // Only add if file has tasks
            if (hasCompleted || hasIncomplete) {
                statusData[dateStr] = {
                    hasCompletedTasks: hasCompleted,
                    hasIncompleteTasks: hasIncomplete
                };
            }
        } catch {
            // Silently ignore errors analyzing files
        }
    }
    
    return statusData;
}
