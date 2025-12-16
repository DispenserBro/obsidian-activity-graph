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
    textColors?: string[];
    lightTextColors?: string[];
    darkTextColors?: string[];
    start?: string;
    end?: string;
    title?: string;
}
