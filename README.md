# 🚀 ifungconvertor

**A modern, privacy-first browser-based suite for HEIC, PDF, DOCX, and GIF processing.**

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge)](https://ifung2020.github.io/ifungconvertor/)
[![Security](https://img.shields.io/badge/privacy-100%25%20local-blue?style=for-the-badge)](https://ifung2020.github.io/ifungconvertor/)
[![License](https://img.shields.io/badge/license-MIT-blueviolet?style=for-the-badge)](/LICENSE)

ifungconvertor is a powerful, client-side utility that handles complex file conversions entirely in your browser. No files are ever uploaded to a server, ensuring maximum privacy and speed.

---

## ✨ Key Features

- **📸 Advanced Image Processing**: Seamlessly convert **HEIC/HEIF** (iPhone photos), WEBP, PNG, and JPG.
- **📄 Document Toolkit**: 
  - Render **PDF pages to high-quality images**.
  - Extract text and layout from **DOCX to PDF**.
  - **PDF to Word** text extraction (Best-effort on-device).
- **🎞️ GIF Studio**: Create animated GIFs from multiple images with custom frame timing.
- **🔒 Privacy Zero-Knowledge**: All processing happens on your device using Web Workers and local WASM/JS libraries. No server side, no data leaks.
- **📱 Responsive UI**: Premium glassmorphism design that works across desktop and mobile.

## 🛠️ Tech Stack

- **Frontend**: Vanilla JS, Vite, CSS3 (Custom Design System).
- **Libraries**:
  - `heic2any`: HEIC image decoding.
  - `pdf.js`: High-fidelity PDF rendering.
  - `jspdf`: PDF generation.
  - `mammoth.js`: DOCX processing.
  - `gifshot`: GIF encoding.

## 🚀 Getting Started

### Local Development

1. **Clone the repo**:
   ```bash
   git clone https://github.com/ifung2020/ifungconvertor.git
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run local server**:
   ```bash
   npm run dev
   ```

### Deployment

To deploy your own version to GitHub Pages:
```bash
npm run deploy
```

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---
*Built with ❤️ by [ifung2020](https://github.com/ifung2020)*
