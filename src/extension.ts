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

// FIX: Make API URL configurable and add fallback
const getApiUrl = (): string => {
    const config = vscode.workspace.getConfiguration('jekyllBuildr');
    return config.get('apiUrl') || 'https://jekyll-buildr.vercel.app'; // Default to production
};

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

// FIX: Enhanced login function with better error handling and notifications
async function loginAndFetchUser(postProvider: CreatePostViewProvider, options: { silent: boolean } = { silent: false }) {
    console.log(`[DEBUG] Login attempt - silent: ${options.silent}`);
    
    try {
        const session = await vscode.authentication.getSession('github', ['read:user'], { createIfNone: !options.silent });
        
        if (!session) {
            if (!options.silent) {
                vscode.window.showErrorMessage('GitHub login was cancelled or failed.');
            }
            console.log('[DEBUG] No GitHub session obtained');
            return;
        }

        console.log('[DEBUG] GitHub session obtained successfully');

        // FIX: Show progress notification immediately
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Jekyll Buildr: Authenticating...",
            cancellable: false
        }, async (progress) => {
            try {
                progress.report({ increment: 25, message: "Connecting to Jekyll Buildr server..." });
                
                const apiUrl = getApiUrl();
                console.log(`[DEBUG] Using API URL: ${apiUrl}`);
                
                const response = await fetch(`${apiUrl}/api/auth/vscode-login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ githubToken: session.accessToken }),
                });

                progress.report({ increment: 50, message: "Verifying credentials..." });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`[DEBUG] Backend login failed: ${response.status} - ${errorText}`);
                    throw new Error(`Backend authentication failed (${response.status}). Please try again.`);
                }

                const { firebaseCustomToken } = await response.json();
                console.log('[DEBUG] Firebase custom token received');
                
                progress.report({ increment: 75, message: "Signing in to Jekyll Buildr..." });
                
                const userCredential = await signInWithCustomToken(auth, firebaseCustomToken);
                idToken = await userCredential.user.getIdToken();
                
                console.log('[DEBUG] Firebase sign-in successful');

                const roleResponse = await fetch(`${apiUrl}/api/getUserRole`, {
                    headers: { 'Authorization': `Bearer ${idToken}` }
                });

                if (!roleResponse.ok) {
                    console.error(`[DEBUG] Role fetch failed: ${roleResponse.status}`);
                    throw new Error('Could not fetch user role from server.');
                }

                const userData = await roleResponse.json();
                currentUser = userData;
                
                console.log(`[DEBUG] User data: ${JSON.stringify(currentUser)}`);

                progress.report({ increment: 100, message: "Authentication complete!" });

                // FIX: Set context and send data
                vscode.commands.executeCommand('setContext', 'jekyllBuildr.isPro', currentUser?.role === 'proUser');
                postProvider.sendInitialData();

                if (!options.silent) {
                    vscode.window.showInformationMessage(
                        `✅ Welcome back, ${currentUser?.displayName || 'User'}! ${currentUser?.role === 'proUser' ? '👑 Pro' : 'Free'} account active.`
                    );
                }
            } catch (error: any) {
                console.error(`[DEBUG] Error in login progress:`, error);
                throw error; // Re-throw to be caught by outer catch
            }
        });
        
    } catch (error: any) {
        console.error(`[DEBUG] Login error:`, error);
        if (!options.silent) {
            vscode.window.showErrorMessage(`🔐 Jekyll Buildr Login Failed: ${error.message}`);
        }
    }
}

export function activate(context: vscode.ExtensionContext) {
    console.log('🚀 Jekyll Buildr extension is now active!');
    
    // FIX: Show activation notification
    vscode.window.showInformationMessage('Jekyll Buildr extension loaded successfully!');

    const postProvider = new CreatePostViewProvider(context.extensionUri);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(CreatePostViewProvider.viewType, postProvider, {
            webviewOptions: { retainContextWhenHidden: true }
        })
    );
    
    // FIX: Try silent login on activation with better feedback
    loginAndFetchUser(postProvider, { silent: true }).catch(error => {
        console.log('[DEBUG] Silent login failed on activation:', error.message);
    });

    // FIX: Enhanced login command
    context.subscriptions.push(vscode.commands.registerCommand('jekyll-buildr.login', async () => {
        console.log('[DEBUG] Manual login command triggered');
        await loginAndFetchUser(postProvider, { silent: false });
    }));

    // FIX: Enhanced post generation with better notifications
    context.subscriptions.push(vscode.commands.registerCommand('jekyll-buildr.generateAndCreatePost', async (payload) => {
        console.log('[DEBUG] Generate post command triggered:', payload);
        
        if (!currentUser || !idToken) {
            const selection = await vscode.window.showWarningMessage(
                '🔐 You must be logged in to use AI features.', 'Login Now', 'Cancel'
            );
            if (selection === 'Login Now') {
                await loginAndFetchUser(postProvider, { silent: false });
                if (!currentUser || !idToken) {
                    vscode.window.showErrorMessage('❌ Login failed. Please try again.');
                    return;
                }
            } else {
                return;
            }
        }

        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `🤖 Generating "${payload.title}"...`,
            cancellable: false
        }, async (progress) => {
            try {
                progress.report({ increment: 25, message: "Contacting AI service..." });
                
                const apiUrl = getApiUrl();
                const response = await fetch(`${apiUrl}/api/ai/generatePost`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` },
                    body: JSON.stringify(payload),
                });
                
                progress.report({ increment: 75, message: "Processing AI response..." });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('[DEBUG] AI generation failed:', errorData);
                    throw new Error(errorData.error || `Server error: ${response.status}`);
                }
                
                const result = await response.json();
                progress.report({ increment: 100, message: "Creating post file..." });
                
                vscode.commands.executeCommand('jekyll-buildr.createPostFile', result.filename, result.content);
                
            } catch (error: any) {
                console.error('[DEBUG] Post generation error:', error);
                vscode.window.showErrorMessage(`🚫 Post Generation Failed: ${error.message}`);
            }
        });
    }));

    // FIX: Enhanced component generation
    context.subscriptions.push(vscode.commands.registerCommand('jekyll-buildr.generateComponent', async () => {
        console.log('[DEBUG] Generate component command triggered');
        
        if (!currentUser || !idToken) {
             const selection = await vscode.window.showWarningMessage(
                '🔐 You must be logged in to use AI features.', 'Login Now', 'Cancel'
            );
            if (selection === 'Login Now') {
                await loginAndFetchUser(postProvider, { silent: false });
                if (!currentUser || !idToken) {
                    vscode.window.showErrorMessage('❌ Login failed. Please try again.');
                    return;
                }
            } else {
                return;
            }
        }
        
        const activeEditor = vscode.window.activeTextEditor;
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage("📁 Please open a project folder first.");
            return;
        }
        const rootPath = workspaceFolders[0].uri.fsPath;
        const activeFilePath = activeEditor ? path.relative(rootPath, activeEditor.document.uri.fsPath) : undefined;

        const prompt = await vscode.window.showInputBox({
            prompt: "🎨 Describe the Jekyll component you want to create",
            placeHolder: activeFilePath ? `e.g., a modern header for ${activeFilePath}` : "e.g., a responsive navigation bar"
        });

        if (!prompt) return;

        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `🤖 Creating Jekyll component...`,
            cancellable: false
        }, async (progress) => {
            try {
                progress.report({ increment: 25, message: "Analyzing context..." });
                
                const apiUrl = getApiUrl();
                const response = await fetch(`${apiUrl}/api/ai/generateComponent`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` },
                    body: JSON.stringify({ prompt, activeFilePath }),
                });

                progress.report({ increment: 75, message: "Generating component code..." });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('[DEBUG] Component generation failed:', errorData);
                    throw new Error(errorData.error || `Server error: ${response.status}`);
                }

                const { filename, content } = await response.json();
                
                progress.report({ increment: 90, message: "Creating file..." });
                
                const absolutePath = path.join(rootPath, filename);
                const dirName = path.dirname(absolutePath);
                if (!fs.existsSync(dirName)) {
                    fs.mkdirSync(dirName, { recursive: true });
                }
                fs.writeFileSync(absolutePath, content, 'utf8');
                
                progress.report({ increment: 100, message: "Done!" });
                
                const doc = await vscode.workspace.openTextDocument(absolutePath);
                await vscode.window.showTextDocument(doc);
                vscode.window.showInformationMessage(`✅ Component '${filename}' created successfully!`);
                
            } catch (error: any) {
                console.error('[DEBUG] Component generation error:', error);
                vscode.window.showErrorMessage(`🚫 Component Generation Failed: ${error.message}`);
            }
        });
    }));

    // FIX: Enhanced file creation with better notifications
    context.subscriptions.push(vscode.commands.registerCommand('jekyll-buildr.createPostFile', async (filename: string, content: string) => {
        console.log('[DEBUG] Creating post file:', filename);
        
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage("📁 Please open a project folder first.");
            return;
        }
        
        const rootPath = workspaceFolders[0].uri.fsPath;
        const postsPath = path.join(rootPath, '_posts');
        
        try {
            if (!fs.existsSync(postsPath)) {
                fs.mkdirSync(postsPath, { recursive: true });
                console.log('[DEBUG] Created _posts directory');
            }
            
            const filePath = path.join(postsPath, filename);
            fs.writeFileSync(filePath, content, 'utf8');
            
            console.log('[DEBUG] Post file written successfully');
            
            const doc = await vscode.workspace.openTextDocument(filePath);
            await vscode.window.showTextDocument(doc);
            
            vscode.window.showInformationMessage(`✅ Post "${filename}" created and opened!`);
            
        } catch (error: any) {
            console.error('[DEBUG] File creation error:', error);
            vscode.window.showErrorMessage(`❌ Failed to create post: ${error.message}`);
        }
    }));
    
    // FIX: Enhanced boilerplate creation with detailed progress
    context.subscriptions.push(vscode.commands.registerCommand('jekyll-buildr.scaffoldBoilerplate', async () => {
        console.log('[DEBUG] Boilerplate command triggered');

        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage("📁 Please open a project folder first to create boilerplate.");
            return;
        }
        
        // Use the Uri object, not the string fsPath
        const rootUri = workspaceFolders[0].uri;
        console.log(`[DEBUG] Workspace root URI: ${rootUri.toString()}`);
        
        const confirm = await vscode.window.showWarningMessage(
            `🏗️ This will create a Jekyll boilerplate structure in your current workspace.\n\nContinue?`,
            { modal: true }, // Use a modal dialog for confirmation
            'Yes, Create Boilerplate'
        );
        
        if (confirm !== 'Yes, Create Boilerplate') {
            vscode.window.showInformationMessage('Boilerplate creation cancelled.');
            return;
        }
        
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "🏗️ Creating Jekyll Boilerplate...",
            cancellable: false
        }, async (progress) => {
            try {
                // Use vscode.workspace.fs for all file operations
                const fs = vscode.workspace.fs;

                // Create a list of all files and directories to be created
                const allFiles = Object.keys(JEKYLL_BOILERPLATE_CONTENTS);
                const allDirs = new Set<string>();

                // Add all parent directories to the set
                allFiles.forEach(f => {
                    const dir = path.dirname(f);
                    if (dir !== '.') {
                        dir.split(path.sep).reduce((acc, part) => {
                            const current = path.join(acc, part);
                            allDirs.add(current);
                            return current;
                        }, '');
                    }
                });

                // Also add empty dirs from the structure definition
                JEKYLL_BOILERPLATE_STRUCTURE.forEach(node => {
                    if(node.type === 'folder') {
                        allDirs.add(node.path);
                    }
                });

                // Create all directories first
                progress.report({ increment: 10, message: "Creating directories..." });
                for (const dir of Array.from(allDirs)) {
                    const dirUri = vscode.Uri.joinPath(rootUri, dir);
                    await fs.createDirectory(dirUri);
                }
                
                progress.report({ increment: 40, message: "Writing files..." });

                // Write all files
                for (const filePath of allFiles) {
                    const fileUri = vscode.Uri.joinPath(rootUri, filePath);
                    const contentStr = JEKYLL_BOILERPLATE_CONTENTS[filePath as keyof typeof JEKYLL_BOILERPLATE_CONTENTS];
                    const contentBytes = new TextEncoder().encode(contentStr);
                    await fs.writeFile(fileUri, contentBytes);
                }

                progress.report({ increment: 100, message: "Boilerplate created!" });
                
                const action = await vscode.window.showInformationMessage(
                    `✅ Jekyll boilerplate created successfully!`,
                    'Open _config.yml', 'Done'
                );
                
                if (action === 'Open _config.yml') {
                    const configUri = vscode.Uri.joinPath(rootUri, '_config.yml');
                    const doc = await vscode.workspace.openTextDocument(configUri);
                    await vscode.window.showTextDocument(doc);
                }

            } catch (error: any) {
                console.error(`[DEBUG] Boilerplate creation error:`, error);
                vscode.window.showErrorMessage(`❌ Failed to create boilerplate: ${error.message}`);
            }
        });
    }));

    // FIX: Enhanced upgrade command
    context.subscriptions.push(vscode.commands.registerCommand('jekyll-buildr.upgradeToPro', async () => {
        const apiUrl = getApiUrl();
        vscode.window.showInformationMessage("🚀 Redirecting to Jekyll Buildr Pro upgrade page...");
        vscode.env.openExternal(vscode.Uri.parse(`${apiUrl}/settings`));
    }));

    // FIX: Enhanced image generation
    context.subscriptions.push(vscode.commands.registerCommand('jekyll-buildr.generateImage', async () => {
        console.log('[DEBUG] Generate image command triggered');
        
        if (!currentUser || !idToken) {
            const selection = await vscode.window.showWarningMessage(
               '🔐 You must be logged in to use AI image generation.', 'Login Now', 'Cancel'
           );
           if (selection === 'Login Now') {
               await loginAndFetchUser(postProvider, { silent: false });
               if (!currentUser || !idToken) {
                   vscode.window.showErrorMessage('❌ Login failed. Please try again.');
                   return;
               }
           } else {
               return;
           }
       }

        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage("📁 Please open a project folder first.");
            return;
        }
        const rootUri = workspaceFolders[0].uri;

        const prompt = await vscode.window.showInputBox({
            prompt: "🎨 Describe the image you want to create",
            placeHolder: "e.g., a futuristic cat wearing sunglasses, cyberpunk style"
        });

        if (!prompt) return;

        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "🤖 Creating AI image...",
            cancellable: false
        }, async (progress) => {
            try {
                progress.report({ increment: 25, message: "Sending request to AI..." });
                
                const apiUrl = getApiUrl();
                const response = await fetch(`${apiUrl}/api/ai/generateImage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` },
                    body: JSON.stringify({ prompt }),
                });

                progress.report({ increment: 75, message: "Processing image..." });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('[DEBUG] Image generation failed:', errorData);
                    throw new Error(errorData.error || `Server error: ${response.status}`);
                }

                const { filename, content } = await response.json();

                progress.report({ increment: 90, message: "Saving image..." });

                const base64Data = content.split(',')[1];
                const imageBuffer = Buffer.from(base64Data, 'base64');
                const imagePath = vscode.Uri.joinPath(rootUri, 'assets', 'images', filename);

                await vscode.workspace.fs.createDirectory(vscode.Uri.joinPath(rootUri, 'assets', 'images'));
                await vscode.workspace.fs.writeFile(imagePath, imageBuffer);

                progress.report({ increment: 100, message: "Image saved!" });

                const action = await vscode.window.showInformationMessage(
                    `✅ Image '${filename}' created successfully!`, 
                    'Open Image', 'Show in Explorer'
                );
                
                if (action === 'Open Image') {
                    vscode.commands.executeCommand('vscode.open', imagePath);
                } else if (action === 'Show in Explorer') {
                    vscode.commands.executeCommand('revealFileInOS', imagePath);
                }

            } catch (error: any) {
                console.error('[DEBUG] Image generation error:', error);
                vscode.window.showErrorMessage(`🚫 Image Generation Failed: ${error.message}`);
            }
        });
    }));
}

export function deactivate() {
    console.log('Jekyll Buildr extension deactivated');
}