/**
 * Options interface for code block processor
 */
export interface CodeBlockOptions {
    period?: string;
    style?: string;
    tasks?: string;
    highlightToday?: string;
    colors?: string[];
    lightColors?: string[];
    darkColors?: string[];
    start?: string;
    end?: string;
    title?: string;
}
