# How to Deploy ifungconvertor

Since ifungconvertor is a static web application, it runs entirely in your browser with no backend server. 

**Newly Added Capabilities:**
- **HEIC/HEIF**: High-efficiency photos from iPhone.
- **PDF Tools**: Convert PDF pages to JPG/PNG images and extract text to DOCX.
- **Word Docs**: Convert DOCX to PDF or Text.
- **GIF Studio**: Combine multiple images into a GIF.
- **Privacy First**: All processing for these files still happens locally on your computer.

## Option 1: Netlify Drop (Easiest)

1.  **Build the project** by running this command in your terminal:
    ```bash
    npm run build
    ```
    This will create a `dist` folder in your project directory.

2.  Go to [Netlify Drop](https://app.netlify.com/drop).
3.  Drag and drop the entire `dist` folder onto the page.
4.  Netlify will give you a live URL instantly (e.g., `https://fluffy-unicorn-123456.netlify.app`).
5.  Share that link with your friends!

## Option 2: GitHub Pages (Automated)

We have set up an automated deployment script for you.

1.  **Deploy updates**: Whenever you want to update your live site, just run:
    ```bash
    npm run deploy
    ```
    This command will rebuild your project and publish it to the `gh-pages` branch.

2.  **View your site**:
    It will be live at: `https://ifung2020.github.io/ifungconvertor/`
    *(Note: It may take 1-2 minutes for changes to appear after deployment)*

## Option 3: Send the files directly

Since the app is bundled, you can also:
1.  Run `npm run build`.
2.  Zip the contents of the `dist` folder.
3.  Send the zip file to your friend.
4.  They just need to unzip it and double-click `index.html` (Note: some browser security settings might block local script execution, so a local server is better, but this often works for simple apps).
