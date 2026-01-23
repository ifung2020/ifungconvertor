# How to Deploy PixelShift

Since PixelShift is a static web application (it runs entirely in the browser with no backend server), it's extremely easy to share with your friends.

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

## Option 2: GitHub Pages

1.  Push your code to a GitHub repository.
2.  Go to the repository **Settings** -> **Pages**.
3.  Select your main branch and the `/ (root)` folder (you might need to configure a workflow for Vite, or use the `gh-pages` package).
    *   *Simpler alternative*: Run the build command, then manually upload the contents of the `dist` folder to a new separate repository (e.g., `username.github.io/my-app`).

## Option 3: Send the files directly

Since the app is bundled, you can also:
1.  Run `npm run build`.
2.  Zip the contents of the `dist` folder.
3.  Send the zip file to your friend.
4.  They just need to unzip it and double-click `index.html` (Note: some browser security settings might block local script execution, so a local server is better, but this often works for simple apps).
