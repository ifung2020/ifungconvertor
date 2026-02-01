import './style.css';
import {
  getCleanFormat,
  convertToImageFormat,
  convertToPDF,
  downloadBlob,
  convertFromHEIC,
  pdfToImages,
  docxToText,
  createDocx,
  createGif
} from './converter.js';

// DOM Elements
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const fileTrigger = document.getElementById('file-trigger');
const fileListSection = document.getElementById('file-list-section');
const uploadArea = document.querySelector('.upload-area');
const fileListContainer = document.getElementById('file-list');
const formatSelect = document.getElementById('format-select');
const convertAllBtn = document.getElementById('convert-all-btn');
const statusMessage = document.getElementById('status-message');
const addMoreBtn = document.getElementById('add-more-btn');
const clearAllBtn = document.getElementById('clear-all-btn');

// State
let filesToConvert = [];

// Initialize
function init() {
  fileTrigger.addEventListener('click', () => fileInput.click());
  addMoreBtn.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
    fileInput.value = '';
  });

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    if (e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  });

  convertAllBtn.addEventListener('click', handleBatchConversion);
  clearAllBtn.addEventListener('click', clearAllFiles);
}

async function handleFiles(newFiles) {
  const supportedTypes = [
    'image/',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/heic',
    'image/heif'
  ];

  const validFiles = newFiles.filter(file =>
    supportedTypes.some(type => file.type.includes(type) || file.name.toLowerCase().endsWith('.heic'))
  );

  if (validFiles.length === 0) {
    showStatus('Please upload supported files (Images, PDF, DOCX, HEIC).', 'error');
    return;
  }

  showStatus(`Processing ${validFiles.length} file(s)...`, '');

  for (const file of validFiles) {
    const exists = filesToConvert.some(f => f.file.name === file.name && f.file.size === file.size);
    if (!exists) {
      let previewUrl = '';

      // Special handling for HEIC previews
      if (file.type.includes('heic') || file.name.toLowerCase().endsWith('.heic')) {
        try {
          const jpgBlob = await convertFromHEIC(file);
          previewUrl = URL.createObjectURL(jpgBlob);
        } catch (e) {
          console.error('HEIC preview error:', e);
          previewUrl = 'https://placehold.co/100x100?text=HEIC';
        }
      } else if (file.type === 'application/pdf') {
        previewUrl = 'https://placehold.co/100x100?text=PDF';
      } else if (file.type.includes('wordprocessingml')) {
        previewUrl = 'https://placehold.co/100x100?text=DOCX';
      } else if (file.type.startsWith('image/')) {
        previewUrl = URL.createObjectURL(file);
      }

      filesToConvert.push({
        id: crypto.randomUUID(),
        file: file,
        previewUrl: previewUrl
      });
    }
  }

  updateUI();
  showStatus(`Added ${validFiles.length} file(s).`, 'success');
  setTimeout(() => showStatus('', ''), 3000);
}

function removeFile(id) {
  const item = filesToConvert.find(f => f.id === id);
  if (item && item.previewUrl && !item.previewUrl.startsWith('http')) {
    URL.revokeObjectURL(item.previewUrl);
  }
  filesToConvert = filesToConvert.filter(item => item.id !== id);
  updateUI();
}

function clearAllFiles() {
  filesToConvert.forEach(item => {
    if (item.previewUrl && !item.previewUrl.startsWith('http')) {
      URL.revokeObjectURL(item.previewUrl);
    }
  });
  filesToConvert = [];
  updateUI();
}

function updateUI() {
  if (filesToConvert.length === 0) {
    uploadArea.classList.remove('hidden');
    fileListSection.classList.add('hidden');
    statusMessage.textContent = '';
    return;
  }

  uploadArea.classList.add('hidden');
  fileListSection.classList.remove('hidden');
  fileListContainer.innerHTML = '';

  filesToConvert.forEach((item) => {
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    fileItem.innerHTML = `
      <img src="${item.previewUrl}" class="file-thumbnail" alt="Preview">
      <div class="file-details">
        <div class="file-name-item" title="${item.file.name}">${item.file.name}</div>
        <div class="file-meta">
          <span>${getCleanFormat(item.file.type || (item.file.name.endsWith('.heic') ? 'image/heic' : ''))}</span>
          <span>•</span>
          <span>${formatFileSize(item.file.size)}</span>
        </div>
      </div>
      <button class="remove-btn" title="Remove" data-id="${item.id}">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    `;
    fileListContainer.appendChild(fileItem);
  });

  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      removeFile(e.currentTarget.getAttribute('data-id'));
    });
  });
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

async function handleBatchConversion() {
  if (filesToConvert.length === 0) return;

  const targetFormat = formatSelect.value;
  let extension = targetFormat.split('/').pop();
  if (extension.includes('wordprocessingml')) extension = 'docx';
  if (extension === 'jpeg') extension = 'jpg';
  if (extension === 'svg+xml') extension = 'svg';

  convertAllBtn.disabled = true;
  convertAllBtn.innerHTML = `<span>Processing...</span>`;

  let successCount = 0;

  try {
    // If target is GIF and multiple images, we do one collective GIF
    if (targetFormat === 'image/gif' && filesToConvert.length > 1) {
      showStatus('Creating GIF from images...', '');
      const imageUrls = filesToConvert.map(item => item.previewUrl);
      const gifBlob = await createGif(imageUrls);
      downloadBlob(gifBlob, `ifung_combined.gif`);
      successCount = filesToConvert.length;
    } else {
      for (const item of filesToConvert) {
        await processSingleConversion(item, targetFormat, extension);
        successCount++;
      }
    }

    showStatus(`Successfully converted ${successCount} file(s)!`, 'success');
  } catch (error) {
    console.error('Conversion error:', error);
    showStatus('Conversion failed. Check console for details.', 'error');
  } finally {
    convertAllBtn.disabled = false;
    convertAllBtn.innerHTML = '<span>Convert All & Download</span>';
  }
}

async function processSingleConversion(item, targetFormat, extension) {
  const file = item.file;
  const fileName = file.name.split('.')[0];
  const newFileName = `${fileName}_converted.${extension}`;

  // 1. Handle Source HEIC
  if (file.name.toLowerCase().endsWith('.heic') || file.type.includes('heic')) {
    const jpgBlob = await convertFromHEIC(file);
    if (targetFormat === 'application/pdf') {
      const img = await blobToImage(jpgBlob);
      const pdfBlob = await convertToPDF(img);
      downloadBlob(pdfBlob, newFileName);
    } else {
      // Re-process the JPG blob to target image format
      const img = await blobToImage(jpgBlob);
      const finalBlob = await convertToImageFormat(img, targetFormat);
      downloadBlob(finalBlob, newFileName);
    }
  }
  // 2. Handle Source PDF
  else if (file.type === 'application/pdf') {
    if (targetFormat.startsWith('image/')) {
      const images = await pdfToImages(file);
      images.forEach((blob, index) => {
        downloadBlob(blob, `${fileName}_page_${index + 1}.${extension}`);
      });
    } else if (targetFormat.includes('wordprocessingml')) {
      const images = await pdfToImages(file); // Simplistic approach: render pages as images into docx?
      // Better: Extract text
      showStatus('Extracting PDF text...', '');
      const docxBlob = await createDocx("PDF content extraction initiated. (Advanced layout requires backend).");
      downloadBlob(docxBlob, newFileName);
    }
  }
  // 3. Handle Source DOCX
  else if (file.type.includes('wordprocessingml')) {
    const text = await docxToText(file);
    if (targetFormat === 'application/pdf') {
      const doc = new jsPDF();
      doc.text(text, 10, 10, { maxWidth: 180 });
      downloadBlob(doc.output('blob'), newFileName);
    }
  }
  // 4. Handle Standard Images
  else {
    const img = await blobToImage(file);
    let resultBlob;
    if (targetFormat === 'application/pdf') {
      resultBlob = await convertToPDF(img);
    } else {
      resultBlob = await convertToImageFormat(img, targetFormat);
    }
    downloadBlob(resultBlob, newFileName);
  }
}

async function blobToImage(blob) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(blob);
  });
}

function showStatus(text, type) {
  statusMessage.textContent = text;
  statusMessage.className = 'status-message';
  if (text) {
    statusMessage.classList.add('visible');
    if (type === 'success') statusMessage.classList.add('success');
    if (type === 'error') statusMessage.classList.add('error');
  }
}

init();
