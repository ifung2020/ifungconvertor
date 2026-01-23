/**
 * Detection and conversion utility functions
 */

import { jsPDF } from 'jspdf';

/**
 * Detect file type using magic numbers (optional) or just mime-type for simplicity
 * In this case, we'll trust the browser's mime-type but provide a cleaner label
 */
export function getCleanFormat(type) {
  if (type === 'image/jpeg') return 'JPG';
  if (type === 'image/png') return 'PNG';
  if (type === 'image/webp') return 'WEBP';
  if (type === 'application/pdf') return 'PDF';
  return type.split('/')[1]?.toUpperCase() || 'IMG';
}

/**
 * Convert image to a different image format using Canvas
 */
export async function convertToImageFormat(imageElement, targetFormat) {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = imageElement.naturalWidth;
    canvas.height = imageElement.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imageElement, 0, 0);
    
    // Quality for JPEG/WEBP
    const quality = 0.92;
    
    canvas.toBlob((blob) => {
      resolve(blob);
    }, targetFormat, quality);
  });
}

/**
 * Convert image to PDF using jsPDF
 */
export async function convertToPDF(imageElement, fileName) {
  const width = imageElement.naturalWidth;
  const height = imageElement.naturalHeight;
  
  // Create PDF with same aspect ratio
  // orientation, unit, format
  const orientation = width > height ? 'l' : 'p';
  const pdf = new jsPDF(orientation, 'px', [width, height]);
  
  // Add image to PDF
  // (imageData, format, x, y, width, height)
  pdf.addImage(imageElement, 'JPEG', 0, 0, width, height);
  
  return pdf.output('blob');
}

/**
 * Download a blob as a file
 */
export function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
