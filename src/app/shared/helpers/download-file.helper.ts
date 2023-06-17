import { saveAs } from "file-saver";

/**
 * 
 * Download file with blob format
 * 
 * @todo Enable user to choose file format
 */
export function downloadFile(data: Blob, fileName: string, type = 'application/ms-excel') {
    let blob = new Blob([data], { type: type });
    saveAs(blob, fileName);
   
}
export function viewFile(data: Blob, fileName: string) {
    const blob = new Blob([data], { type: `application/octet-stream}` });
    return `${URL.createObjectURL(blob)}${fileName}`
}
