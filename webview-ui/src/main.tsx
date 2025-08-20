// webview-ui/src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { PostEditor } from './post-editor'; // Impor komponen form-nya
import './index.css'; // Pastikan Tailwind CSS diimpor

// @ts-ignore
const vscode = acquireVsCodeApi();

function App() {
  const handlePublish = (data: any) => {
    vscode.postMessage({
      type: 'publishPost',
      data: data,
    });
  };

  const handleGenerateContent = (title: string) => {
    vscode.postMessage({
      type: 'generateContent',
      data: { title },
    });
  };

  const handleGenerateImage = (prompt: string) => {
    vscode.postMessage({
      type: 'generateImage',
      data: { prompt },
    });
  };

  return (
    <React.StrictMode>
      <PostEditor
        onPublish={handlePublish}
        onGenerateContent={handleGenerateContent}
        onGenerateImage={handleGenerateImage}
      />
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);