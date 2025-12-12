/**
 * Extract completed task dates from file content
 */
function extractCompletedTaskDates(content) {
    const dates = [];
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
export async function loadTasksFromVault(vault) {
    const tasksData = {};
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
        } catch (error) {
            console.error(`Error reading file ${file.path}:`, error);
        }
    }
    
    return tasksData;
}
