export function removeSpaces(text: string): string {
    return text.replace(/\s/g, '');
}
export function cleanString(input: string): string {
    return input.replace(/\t/g, '').trim();
}