# Jekyll Buildr for VS Code

![Status](https://img.shields.io/badge/status-prerelease-yellow)
![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/YOUR_PUBLISHER.jekyll-buildr-vscode?label=Marketplace)

Supercharge your Jekyll workflow directly inside Visual Studio Code. The **Jekyll Buildr** extension brings the power of the Jekyll Buildr web app and generative AI into your favorite code editor.

![Jekyll Buildr Extension Demo](https://placehold.co/800x400?text=Demo+GIF+of+Extension+Features)

---

## 🚧 Prerelease Status

Please note that this extension is currently in **prerelease**. Features are still under development and you may encounter bugs. Your feedback is highly appreciated!

## ✨ Key Features

- **🤖 AI Post Generator** – Create new blog posts right from the sidebar. Simply provide a title, and AI will generate a relevant Markdown draft complete with *front matter*.
- **🧠 AI Component Generator (Context-Aware)** – Run a command to generate Jekyll components. AI uses the file you have open as context to produce more relevant code.
- **🚀 Jekyll Boilerplate** – Start a new Jekyll project in seconds. Run a single command to scaffold a ready-to-use folder and file structure.
- **🔐 Login Sync** – Sign in once with your GitHub account and stay authenticated across both the web app and the VS Code extension, including Pro account status.

---

## 🚀 How to Use

### 1. Login
To use AI-powered features, you’ll need to log in first.
1. Open the *Command Palette* (`Ctrl+Shift+P` or `Cmd+Shift+P`).
2. Search for and run `Jekyll Buildr: Login`.
3. Complete the GitHub authentication process. The extension will automatically sync your account status.

### 2. Create a New Jekyll Project
If starting from scratch, use the boilerplate command.
1. Open an empty folder in VS Code.
2. Run `Jekyll Buildr: Create Jekyll Boilerplate`.
3. Confirm, and a full Jekyll project structure will be generated for you.

### 3. Generate a New Post with AI
Quickly create content from the sidebar.
1. Click the Jekyll Buildr icon in the *Activity Bar*.
2. In the "Create Post" panel, enter a **Title** and other details.
3. Click **Generate & Create Post**.
4. The extension will generate a `.md` file and open it inside your `_posts/` folder.

### 4. Generate a Component with AI
1. (Optional) Open a relevant file (e.g., `_layouts/default.html`) to provide context for the AI.
2. Run `Jekyll Buildr: Generate AI Component`.
3. Enter a description of the component (e.g., `a modern footer with social media links`).
4. AI will generate the component file (e.g., `_includes/footer.html`) and open it for you.

---

## 📚 Available Commands

- `Jekyll Buildr: Login` – Authenticate with your Jekyll Buildr account.
- `Jekyll Buildr: Create Jekyll Boilerplate` – Scaffold a standard Jekyll project.
- `Jekyll Buildr: Generate AI Component` – Create new components with AI assistance.

---

## 📄 License

This project is released under the CC0 1.0 Universal License.
