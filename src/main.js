import './style.css';
import { getCleanFormat, convertToImageFormat, convertToPDF, downloadBlob } from './converter.js';

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
  // Click to upload
  fileTrigger.addEventListener('click', () => fileInput.click());
  addMoreBtn.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
    // Reset inputs so same file selection works again
    fileInput.value = '';
  });

  // Drag and Drop
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

  // Actions
  convertAllBtn.addEventListener('click', handleBatchConversion);
  clearAllBtn.addEventListener('click', clearAllFiles);
}

function handleFiles(newFiles) {
  const images = newFiles.filter(file => file.type.startsWith('image/'));

  if (images.length === 0) {
    showStatus('Please upload image files.', 'error');
    return;
  }

  // Add distinct files (simple check by name+size for now)
  images.forEach(file => {
    const exists = filesToConvert.some(f => f.file.name === file.name && f.file.size === file.size);
    if (!exists) {
      filesToConvert.push({
        id: crypto.randomUUID(),
        file: file,
        previewUrl: URL.createObjectURL(file)
      });
    }
  });

  updateUI();
  showStatus(`Added ${images.length} image(s).`, 'success');
  // Clear success status after 3s
  setTimeout(() => showStatus('', ''), 3000);
}

function removeFile(id) {
  filesToConvert = filesToConvert.filter(item => item.id !== id);
  updateUI();
}

function clearAllFiles() {
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

  // Re-render list
  fileListContainer.innerHTML = '';

  filesToConvert.forEach((item, index) => {
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';

    fileItem.innerHTML = `
      <img src="${item.previewUrl}" class="file-thumbnail" alt="Preview">
      <div class="file-details">
        <div class="file-name-item" title="${item.file.name}">${item.file.name}</div>
        <div class="file-meta">
          <span>${getCleanFormat(item.file.type)}</span>
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

  // Attach event listeners to new buttons
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      removeFile(id);
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
  let extension = targetFormat === 'application/pdf' ? 'pdf' : targetFormat.split('/')[1];
  if (extension === 'jpeg') extension = 'jpg';

  convertAllBtn.disabled = true;
  convertAllBtn.innerHTML = `<span>Converting ${filesToConvert.length} files...</span>`;

  let successCount = 0;

  try {
    // Process sequentially to keep it simple and stable
    for (const item of filesToConvert) {
      await processSingleConversion(item, targetFormat, extension);
      successCount++;
    }

    showStatus(`Successfully converted ${successCount} files!`, 'success');
  } catch (error) {
    console.error('Batch conversion error:', error);
    showStatus('Some files failed to convert.', 'error');
  } finally {
    convertAllBtn.disabled = false;
    convertAllBtn.innerHTML = '<span>Convert All & Download</span>';
  }
}

async function processSingleConversion(item, targetFormat, extension) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = async () => {
      try {
        let resultBlob;
        const originalName = item.file.name.split('.')[0];
        const newFileName = `${originalName}_converted.${extension}`;

        if (targetFormat === 'application/pdf') {
          resultBlob = await convertToPDF(img, newFileName);
        } else {
          resultBlob = await convertToImageFormat(img, targetFormat);
        }

        downloadBlob(resultBlob, newFileName);
        resolve();
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = reject;
    img.src = item.previewUrl;
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
