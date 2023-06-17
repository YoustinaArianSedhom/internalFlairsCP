/**
 * 
 * Remove all Html tags from passed text
 */
export function cleanTextFromHtml(text: string): string {
    return text.replace(/<[^>]*>/g, '');
}
