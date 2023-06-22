import { Color } from 'vscode';
export function getLineContentAt(document: string, index: number) {
    if (index < 0) return null;
    let word = '';
    for (let i = index; i < document.length; i++) {
        const char = document.charAt(i);
        if (char === "\n") break;
        word += char;
    }
    return word;
}
function intToHex(int: number) {
    var hex = int.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}
export function rgbaToHex(r: number, g: number, b: number, a: number) {
    return '#' + intToHex(r) + intToHex(g) + intToHex(b) + intToHex(a);
}
export function hexToVSColor(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    if (hex.length > 7) return new Color(r, g, b, parseInt(hex.slice(7, 9), 16) / 255);
    return new Color(r, g, b, 1);
}