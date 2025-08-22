import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import fetch from 'node-fetch';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { firebaseConfig } from './firebaseConfig';
import { JEKYLL_BOILERPLATE_CONTENTS, JEKYLL_BOILERPLATE_STRUCTURE } from './boilerplate';

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const apiUrl = 'http://localhost:3000';

let currentUser: { displayName: string | null; role: string; } | null = null;
let idToken: string | null = null;

class CreatePostViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'jekyllBuildr.createPostView';
    private _view?: vscode.WebviewView;

    constructor(private readonly _extensionUri: vscode.Uri) {}

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };
        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        webviewView.webview.onDidReceiveMessage(async (data) => {
            switch (data.type) {
                case 'createPostRequest':
                    vscode.commands.executeCommand('jekyll-buildr.generateAndCreatePost', data.payload);
                    break;
                case 'showError':
                    vscode.window.showErrorMessage(data.message);
                    break;
            }
        });
    }

    public sendInitialData() {
        if (this._view) {
            this._view.webview.postMessage({ type: 'token', token: idToken });
            this._view.webview.postMessage({ type: 'userInfo', user: currentUser });
        }
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.css'));
        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Create Jekyll Post</title>
                <link href="${styleUri}" rel="stylesheet">
            </head>
            <body>
                <div class="card">
                    <h2>New Jekyll Post</h2>
                    <p class="description">Use AI to generate content based on your title.</p>
                    <form id="post-form">
                        <div class="form-group">
                            <label for="title">Title</label>
                            <input type="text" id="title" name="title" required>
                        </div>
                        <div class="form-group">
                            <label for="author">Author</label>
                            <input type="text" id="author" name="author">
                        </div>
                        <div class="form-group">
                            <label for="categories">Categories</label>
                            <input type="text" id="categories" name="categories" placeholder="e.g., tech, travel">
                        </div>
                        <button type="submit" id="submit-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
                            <span>Generate & Create Post</span>
                        </button>
                    </form>
                </div>
                <script>
                    const vscode = acquireVsCodeApi();
                    const form = document.getElementById('post-form');
                    const authorInput = document.getElementById('author');

                    window.addEventListener('message', event => {
                        const message = event.data;
                        if (message.type === 'userInfo' && message.user && message.user.displayName) {
                            authorInput.value = message.user.displayName;
                        }
                    });

                    form.addEventListener('submit', (e) => {
                        e.preventDefault();
                        const formData = new FormData(form);
                        const payload = {
                            title: formData.get('title'),
                            author: formData.get('author'),
                            categories: formData.get('categories'),
                        };
                        vscode.postMessage({ type: 'createPostRequest', payload: payload });
                    });
                </script>
            </body>
            </html>`;
    }
}

// --- PERBAIKAN: Fungsi login sekarang lebih cerdas ---
async function loginAndFetchUser(postProvider: CreatePostViewProvider, options: { silent: boolean } = { silent: false }) {
    const session = await vscode.authentication.getSession('github', ['read:user'], { createIfNone: !options.silent });
    if (!session) {
        if (!options.silent) {
            vscode.window.showErrorMessage('GitHub login was cancelled.');
        }
        return;
    }

    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "Authenticating with Jekyll Buildr...",
        cancellable: false
    }, async () => {
        try {
            const response = await fetch(`${apiUrl}/api/auth/vscode-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ githubToken: session.accessToken }),
            });

            if (!response.ok) throw new Error('Backend login failed. Please try again.');

            const { firebaseCustomToken } = await response.json();
            const userCredential = await signInWithCustomToken(auth, firebaseCustomToken);
            idToken = await userCredential.user.getIdToken();

            const roleResponse = await fetch(`${apiUrl}/api/getUserRole`, {
                headers: { 'Authorization': `Bearer ${idToken}` }
            });

            if (!roleResponse.ok) throw new Error('Could not fetch user role.');

            const userData = await roleResponse.json();
            currentUser = userData;

            vscode.commands.executeCommand('setContext', 'jekyllBuildr.isPro', currentUser?.role === 'proUser');
            postProvider.sendInitialData(); // Kirim data ke webview

            if (!options.silent) {
                vscode.window.showInformationMessage(`Welcome back, ${currentUser?.displayName}!`);
            }
        } catch (error: any) {
            console.error(error);
            if (!options.silent) {
                vscode.window.showErrorMessage(`Login Failed: ${error.message}`);
            }
        }
    });
}

export function activate(context: vscode.ExtensionContext) {
    console.log('Jekyll Buildr extension is now active!');

    const postProvider = new CreatePostViewProvider(context.extensionUri);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(CreatePostViewProvider.viewType, postProvider, {
            webviewOptions: { retainContextWhenHidden: true }
        })
    );
    
    loginAndFetchUser(postProvider, { silent: true });

    context.subscriptions.push(vscode.commands.registerCommand('jekyll-buildr.login', () => {
        loginAndFetchUser(postProvider, { silent: false });
    }));

    context.subscriptions.push(vscode.commands.registerCommand('jekyll-buildr.generateAndCreatePost', async (payload) => {
        if (!currentUser || !idToken) {
            const selection = await vscode.window.showWarningMessage(
                'You must be logged in to use this feature.', 'Login', 'Cancel'
            );
            if (selection === 'Login') {
                await loginAndFetchUser(postProvider, { silent: false });
            }
            return;
        }

        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Jekyll Buildr AI is generating content...",
            cancellable: false
        }, async () => {
            try {
                const response = await fetch(`${apiUrl}/api/ai/generatePost`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` },
                    body: JSON.stringify(payload),
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to generate post content.');
                }
                const result = await response.json();
                vscode.commands.executeCommand('jekyll-buildr.createPostFile', result.filename, result.content);
            } catch (error: any) {
                vscode.window.showErrorMessage(`Generation Failed: ${error.message}`);
            }
        });
    }));

    context.subscriptions.push(vscode.commands.registerCommand('jekyll-buildr.generateComponent', async () => {
        if (!currentUser || !idToken) {
             const selection = await vscode.window.showWarningMessage(
                'You must be logged in to use this feature.', 'Login', 'Cancel'
            );
            if (selection === 'Login') {
                await loginAndFetchUser(postProvider, { silent: false });
            }
            return;
        }
        
        const activeEditor = vscode.window.activeTextEditor;
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage("Please open a project folder first.");
            return;
        }
        const rootPath = workspaceFolders[0].uri.fsPath;
        const activeFilePath = activeEditor ? path.relative(rootPath, activeEditor.document.uri.fsPath) : undefined;

        const prompt = await vscode.window.showInputBox({
            prompt: "Describe the Jekyll component you want to create",
            placeHolder: activeFilePath ? `e.g., a header for ${activeFilePath}` : "e.g., a responsive navigation bar"
        });

        if (!prompt) return;

        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Jekyll Buildr AI is generating your component...",
            cancellable: false
        }, async () => {
            try {
                const response = await fetch(`${apiUrl}/api/ai/generateComponent`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` },
                    body: JSON.stringify({ prompt, activeFilePath }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to generate component.');
                }

                const { filename, content } = await response.json();
                const absolutePath = path.join(rootPath, filename);
                const dirName = path.dirname(absolutePath);
                if (!fs.existsSync(dirName)) {
                    fs.mkdirSync(dirName, { recursive: true });
                }
                fs.writeFileSync(absolutePath, content, 'utf8');
                const doc = await vscode.workspace.openTextDocument(absolutePath);
                await vscode.window.showTextDocument(doc);
                vscode.window.showInformationMessage(`Component '${filename}' created successfully!`);
            } catch (error: any) {
                vscode.window.showErrorMessage(`Generation Failed: ${error.message}`);
            }
        });
    }));

    context.subscriptions.push(vscode.commands.registerCommand('jekyll-buildr.createPostFile', (filename: string, content: string) => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage("Please open a project folder first.");
            return;
        }
        const rootPath = workspaceFolders[0].uri.fsPath;
        const postsPath = path.join(rootPath, '_posts');
        if (!fs.existsSync(postsPath)) {
            fs.mkdirSync(postsPath, { recursive: true });
        }
        const filePath = path.join(postsPath, filename);
        fs.writeFile(filePath, content, 'utf8', (err) => {
            if (err) {
                vscode.window.showErrorMessage(`Failed to create file: ${err.message}`);
                return;
            }
            vscode.workspace.openTextDocument(filePath).then(doc => {
                vscode.window.showTextDocument(doc);
            });
            vscode.window.showInformationMessage(`Successfully created ${filename}`);
        });
    }));
    
    // --- DEBUGGING BOILERPLATE: MELEWATI DIALOG KONFIRMASI ---
    context.subscriptions.push(vscode.commands.registerCommand('jekyll-buildr.scaffoldBoilerplate', async () => {
        console.log('[DEBUG] Boilerplate command triggered.');

        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage("Please open a project folder first to create boilerplate.");
            return;
        }
        const rootPath = workspaceFolders[0].uri.fsPath;
        console.log(`[DEBUG] Workspace root path: ${rootPath}`);
        
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Creating Jekyll Boilerplate...",
            cancellable: false
        }, async (progress) => {
            try {
                console.log('[DEBUG] Inside withProgress callback.');
                progress.report({ increment: 10, message: "Creating directories..." });

                const createStructure = (nodes: any[], currentBasePath: string) => {
                    for (const node of nodes) {
                        const fullPath = path.join(currentBasePath, node.name);
                        if (node.type === 'folder') {
                            if (!fs.existsSync(fullPath)) {
                                fs.mkdirSync(fullPath, { recursive: true });
                            }
                            if (node.children) {
                                createStructure(node.children, fullPath);
                            }
                        }
                    }
                };
                
                createStructure(JEKYLL_BOILERPLATE_STRUCTURE, rootPath);
                console.log('[DEBUG] Directory structure created.');
                
                progress.report({ increment: 50, message: "Writing files..." });

                for (const filePath in JEKYLL_BOILERPLATE_CONTENTS) {
                    const absolutePath = path.join(rootPath, filePath);
                    const content = JEKYLL_BOILERPLATE_CONTENTS[filePath as keyof typeof JEKYLL_BOILERPLATE_CONTENTS];
                    const dirName = path.dirname(absolutePath);
                    if (!fs.existsSync(dirName)) {
                        fs.mkdirSync(dirName, { recursive: true });
                    }
                    fs.writeFileSync(absolutePath, content, 'utf8');
                }
                
                console.log('[DEBUG] Files written successfully.');
                progress.report({ increment: 100, message: "Done!" });
                vscode.window.showInformationMessage('Jekyll boilerplate created successfully!');

            } catch (error: any) {
                console.error(`[DEBUG] ERROR caught in withProgress:`, error);
                vscode.window.showErrorMessage(`Failed to create boilerplate: ${error.message}`);
            }
        });
        console.log('[DEBUG] After withProgress call.');
    }));

    // --- PERINTAH BARU UNTUK UPGRADE ---
    context.subscriptions.push(vscode.commands.registerCommand('jekyll-buildr.upgradeToPro', () => {
        vscode.window.showInformationMessage("Redirecting you to upgrade to Jekyll Buildr Pro...");
        // Buka link ke halaman upgrade di webapp
        vscode.env.openExternal(vscode.Uri.parse(`${apiUrl}/settings`));
    }));

    // --- COMMAND BARU UNTUK GENERATE IMAGE ---
    context.subscriptions.push(vscode.commands.registerCommand('jekyll-buildr.generateImage', async () => {
        // Cek login
        if (!currentUser || !idToken) {
            const selection = await vscode.window.showWarningMessage(
               'You must be logged in to use this feature.', 'Login', 'Cancel'
           );
           if (selection === 'Login') {
               await loginAndFetchUser(postProvider, { silent: false });
           }
           return;
       }

        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage("Please open a project folder first.");
            return;
        }
        const rootUri = workspaceFolders[0].uri;

        // Minta prompt dari user
        const prompt = await vscode.window.showInputBox({
            prompt: "Describe the image you want to create",
            placeHolder: "e.g., a futuristic cat wearing sunglasses, cyberpunk style"
        });

        if (!prompt) return; // User membatalkan

        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Jekyll Buildr AI is creating your image...",
            cancellable: false
        }, async (progress) => {
            try {
                const response = await fetch(`${apiUrl}/api/ai/generateImage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` },
                    body: JSON.stringify({ prompt }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to generate image.');
                }

                const { filename, content } = await response.json();

                // `content` adalah data URI (e.g., "data:image/webp;base64,iVBORw...")
                // Kita perlu mengambil bagian base64-nya saja
                const base64Data = content.split(',')[1];
                const imageBuffer = Buffer.from(base64Data, 'base64');

                // Tentukan path untuk menyimpan gambar
                const imagePath = vscode.Uri.joinPath(rootUri, 'assets', 'images', filename);

                // Buat direktori jika belum ada
                await vscode.workspace.fs.createDirectory(vscode.Uri.joinPath(rootUri, 'assets', 'images'));

                // Simpan file
                await vscode.workspace.fs.writeFile(imagePath, imageBuffer);

                vscode.window.showInformationMessage(`Image '${filename}' saved successfully in assets/images!`);
                
                // Buka gambar yang baru dibuat
                vscode.commands.executeCommand('vscode.open', imagePath);

            } catch (error: any) {
                vscode.window.showErrorMessage(`Image Generation Failed: ${error.message}`);
            }
        });
    }));
}

export function deactivate() {}