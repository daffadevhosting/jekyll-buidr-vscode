// src/extension.ts

import * as vscode from 'vscode';
import fetch from 'node-fetch';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken } from 'firebase/auth'; // Ganti import
import { firebaseConfig } from './firebaseConfig';
import { CreatePostViewProvider } from './CreatePostViewProvider';

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

async function verifyProStatus(uid: string): Promise<boolean> {
    // Kita bisa gunakan API yang sama atau buat yang baru, tapi mari kita asumsikan
    // kita bisa dapatkan role langsung setelah login.
    // Kode ini sekarang hanya contoh, karena verifikasi sudah terjadi di backend.
    return true; // Kita akan perbaiki ini nanti
}

let currentUser: { displayName: string | 'null'; role: string; };

export function activate(context: vscode.ExtensionContext) {
    let loginCommand = vscode.commands.registerCommand('jekyll-buildr.login', async () => {
        try {
            const githubSession = await vscode.authentication.getSession('github', ['read:user'], { createIfNone: true });

            if (githubSession) {
                vscode.window.showInformationMessage(`GitHub authenticated for ${githubSession.account.label}. Finalizing login...`);

                // Panggil endpoint backend baru kita
                const response = await fetch('https://jekyll-buildr.vercel.app/api/auth/vscode-login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ githubToken: githubSession.accessToken }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Backend login failed.');
                }
                
                const { firebaseCustomToken } = await response.json();
                
                // Login ke Firebase menggunakan Custom Token
                const userCredential = await signInWithCustomToken(auth, firebaseCustomToken);
                
                // --- BAGIAN BARU ---
                // Setelah login, dapatkan ID token terbaru untuk otentikasi API
            const idToken = await userCredential.user.getIdToken();
            console.log('[DEBUG] Got latest ID token. Calling /api/getUserRole...');

            const roleResponse = await fetch('https://jekyll-buildr.vercel.app/api/getUserRole', {
                headers: { 'Authorization': `Bearer ${idToken}` }
            });

            console.log(`[DEBUG] Role API responded with status: ${roleResponse.status}`);

            if (!roleResponse.ok) {
                const errorText = await roleResponse.text(); // Ambil sebagai teks dulu
                console.error('[DEBUG] Role API response was not OK. Body:', errorText);
                throw new Error(`Could not fetch user role. Server responded with: ${errorText}`);
            }
            
            // Coba parsing JSON dengan aman
            try {
                const userData = await roleResponse.json();
                console.log('[DEBUG] Successfully parsed JSON from role API:', userData); // INI CCTV PENTING
                
                currentUser = userData;

                vscode.window.showInformationMessage(`Welcome, ${currentUser.displayName}! Status: ${currentUser.role}`);

                if (currentUser.role === 'proUser') {
                    vscode.window.showInformationMessage('✅ Pro features are now unlocked!');
                    vscode.commands.executeCommand('setContext', 'jekyllBuildr.isPro', true);
                } else {
                    vscode.window.showWarningMessage('Upgrade to Pro to unlock all features.');
                    vscode.commands.executeCommand('setContext', 'jekyllBuildr.isPro', false);
                }

            } catch (jsonError) {
                console.error('[DEBUG] Failed to parse JSON response:', jsonError);
                const rawText = await roleResponse.text();
                console.error('[DEBUG] Raw response body was:', rawText);
                throw new Error("Received an invalid response from the server.");
            }
            }
        } catch (error) {
            console.error('[DEBUG] ERROR in login command:', error);
            vscode.window.showErrorMessage(`Login process failed: ${error}`);
        }
    });

    context.subscriptions.push(loginCommand);

    // --- COMMAND BARU UNTUK GENERATE COMPONENT ---
    let generateCommand = vscode.commands.registerCommand('jekyll-buildr.generateComponent', async () => {
        // Cek lagi status Pro
        if (currentUser?.role !== 'proUser') {
            vscode.window.showErrorMessage("This is a Pro feature. Please upgrade your account.");
            return;
        }

        // Minta deskripsi dari pengguna
        const prompt = await vscode.window.showInputBox({
            placeHolder: "e.g., a responsive footer with social media links",
            prompt: "Describe the Jekyll component you want to create",
            title: "Generate Component with AI 👑"
        });

        if (!prompt) return; // Jika pengguna membatalkan

        // Dapatkan path file yang sedang aktif untuk memberikan konteks ke AI
        const activeEditor = vscode.window.activeTextEditor;
        const activeFilePath = activeEditor ? activeEditor.document.uri.fsPath : undefined;

        // Tampilkan notifikasi progres
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Jekyll AI is building your component...",
            cancellable: false
        }, async (progress) => {
            try {
                // Dapatkan ID token untuk otentikasi
                const idToken = await auth.currentUser?.getIdToken();
                if (!idToken) throw new Error("Not authenticated.");

                // Panggil backend API AI
                const response = await fetch('https://jekyll-buildr.vercel.app/api/ai/generateComponent', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${idToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ prompt, activeFilePath })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error);
                }

                const result = await response.json() as { filename: string; content: string };

                // Buat dan buka file baru dengan hasil dari AI
                const workspaceFolders = vscode.workspace.workspaceFolders;
                if (workspaceFolders) {
                    const workspacePath = workspaceFolders[0].uri;
                    const newFilePath = vscode.Uri.joinPath(workspacePath, result.filename);
                    
                    await vscode.workspace.fs.writeFile(newFilePath, Buffer.from(result.content, 'utf8'));
                    
                    const document = await vscode.workspace.openTextDocument(newFilePath);
                    await vscode.window.showTextDocument(document);
                    
                    vscode.window.showInformationMessage(`Successfully generated ${result.filename}!`);
                }
            } catch (error: any) {
                vscode.window.showErrorMessage(`AI Generation Failed: ${error.message}`);
            }
        });
    });

    context.subscriptions.push(generateCommand);
    const provider = new CreatePostViewProvider(context.extensionUri);

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(CreatePostViewProvider.viewType, provider)
    );
}

export function deactivate() {}