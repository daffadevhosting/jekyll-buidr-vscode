// src/CreatePostViewProvider.ts

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export class CreatePostViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'jekyllBuildr.createPostView';

    private _view?: vscode.WebviewView;

    constructor(private readonly _extensionUri: vscode.Uri) { }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.joinPath(this._extensionUri, 'webview-dist')]
        };

        // Atur konten HTML untuk webview
        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        // Menangani pesan dari webview (misalnya saat user klik "Publish")
        webviewView.webview.onDidReceiveMessage(async (data) => {
            if (data.type === 'publishPost') {
                vscode.window.showInformationMessage('Received publish command from webview!');
                // Di sini kita akan panggil API backend untuk mem-publish post
            }
        });
    }

    private _getHtmlForWebview(webview: vscode.Webview): string {
        // Dapatkan path ke file hasil build
        const scriptPath = vscode.Uri.joinPath(this._extensionUri, 'out', 'webview-dist', 'assets', 'main.js');
        const stylePath = vscode.Uri.joinPath(this._extensionUri, 'out', 'webview-dist', 'assets', 'main.css');

        // Ubah URI menjadi URL yang bisa dibaca webview
        const scriptUri = webview.asWebviewUri(scriptPath);
        const styleUri = webview.asWebviewUri(stylePath);

        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-A">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" href="${styleUri}">
                <title>Create Post</title>
            </head>
            <body>
                <div id="root"></div>
                <script type="module" src="${scriptUri}"></script>
            </body>
            </html>
        `;
    }
}