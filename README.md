# ifungconvertor

**A privacy-focused browser-based suite for HEIC, PDF, DOCX, and GIF processing.**

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge)](https://ifung2020.github.io/ifungconvertor/)
[![Security](https://img.shields.io/badge/privacy-100%25%20local-blue?style=for-the-badge)](https://ifung2020.github.io/ifungconvertor/)
[![License](https://img.shields.io/badge/license-MIT-blueviolet?style=for-the-badge)](/LICENSE)

ifungconvertor is a client-side utility that handles file conversions entirely in the browser. No files are ever uploaded to a server, ensuring user privacy and data security.

---

## Features

- **Advanced Image Processing**: Support for HEIC/HEIF, WEBP, PNG, and JPG.
- **Document Tools**: 
  - Render PDF pages to high-quality images.
  - Convert DOCX to PDF formats.
  - PDF to Word text extraction (experimental on-device).
- **GIF Generation**: Create animated GIFs from multiple images.
- **Security-First Architecture**: All processing occurs locally on the browser using Web Workers.
- **Responsive Interface**: Modern design optimized for desktop and mobile performance.

## Technical Details

- **Frontend**: JavaScript, Vite, CSS3.
- **Libraries**:
  - `heic2any`: HEIC image decoding.
  - `pdf.js`: PDF rendering.
  - `jspdf`: PDF generation.
  - `mammoth.js`: DOCX processing.
  - `gifshot`: GIF encoding.

## Installation and Usage

### Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ifung2020/ifungconvertor.git
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Execute local server**:
   ```bash
   npm run dev
   ```

### Deployment

To deploy to GitHub Pages:
```bash
npm run deploy
```

## License

Distributed under the MIT License. See `LICENSE` for more information.

---
*Built by [ifung2020](https://github.com/ifung2020)*
