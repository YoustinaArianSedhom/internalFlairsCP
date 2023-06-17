export function copyToClipboard(text: string) {
    const fakeEl = document.createElement('textarea');
    fakeEl.value = text;
    document.body.appendChild(fakeEl);
    fakeEl.select();
    document.execCommand('copy');
    document.body.removeChild(fakeEl);
}