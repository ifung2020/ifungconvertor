/**
 * Detection and conversion utility functions
 */

import { jsPDF } from 'jspdf';
import heic2any from 'heic2any';
import * as pdfjs from 'pdfjs-dist';
import * as mammoth from 'mammoth';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import gifshot from 'gifshot';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

/**
 * Clean format label
 */
export function getCleanFormat(type) {
  if (type === 'image/jpeg') return 'JPG';
  if (type === 'image/png') return 'PNG';
  if (type === 'image/webp') return 'WEBP';
  if (type === 'image/gif') return 'GIF';
  if (type === 'image/svg+xml') return 'SVG';
  if (type === 'application/pdf') return 'PDF';
  if (type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return 'DOCX';
  if (type.includes('heic') || type.includes('heif')) return 'HEIC';
  return type.split('/')[1]?.toUpperCase() || 'FILE';
}

/**
 * Convert HEIC/HEIF to JPG/PNG
 */
export async function convertFromHEIC(blob, targetFormat = 'image/jpeg') {
  const result = await heic2any({
    blob,
    toType: targetFormat,
    quality: 0.9
  });
  return Array.isArray(result) ? result[0] : result;
}

/**
 * Render PDF pages to images
 */
export async function pdfToImages(blob) {
  const arrayBuffer = await blob.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  const images = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2.0 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: context, viewport }).promise;

    const imageBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9));
    images.push(imageBlob);
  }
  return images;
}

/**
 * Convert DOCX to HTML/Text (Mammoth)
 */
export async function docxToText(blob) {
  const arrayBuffer = await blob.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

/**
 * Create DOCX from Text (docx library)
 */
export async function createDocx(text) {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          children: [new TextRun(text)],
        }),
      ],
    }],
  });

  return await Packer.toBlob(doc);
}

/**
 * Create GIF from images
 */
export async function createGif(imageUrls) {
  return new Promise((resolve, reject) => {
    gifshot.createGIF({
      images: imageUrls,
      gifWidth: 400,
      gifHeight: 400,
      interval: 0.5,
      numFrames: imageUrls.length,
    }, (obj) => {
      if (!obj.error) {
        // Convert base64 to blob
        fetch(obj.image)
          .then(res => res.blob())
          .then(resolve)
          .catch(reject);
      } else {
        reject(obj.error);
      }
    });
  });
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

    const quality = 0.92;
    canvas.toBlob((blob) => {
      resolve(blob);
    }, targetFormat, quality);
  });
}

/**
 * Convert image/content to PDF using jsPDF
 */
export async function convertToPDF(imageElement) {
  const width = imageElement.naturalWidth;
  const height = imageElement.naturalHeight;
  const orientation = width > height ? 'l' : 'p';
  const pdf = new jsPDF(orientation, 'px', [width, height]);
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
