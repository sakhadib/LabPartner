import * as vscode from 'vscode';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('labpartner.showInsertPanel', () => {
            const panel = vscode.window.createWebviewPanel(
                'labPartner',
                'LabPartner',
                vscode.ViewColumn.Beside,
                { enableScripts: true }
            );

            panel.webview.html = getWebviewContent(context);
            
            panel.webview.onDidReceiveMessage(async (message) => {
                const text = message.text;
                const editor = vscode.window.activeTextEditor;
                
                if (editor && text) {
                    insertTextWithChunks(editor, text);
                    panel.dispose();
                }
            });
        })
    );
}

function getWebviewContent(context: vscode.ExtensionContext): string {
    const stylesPath = vscode.Uri.file(
        context.asAbsolutePath('media/styles.css')
    );
    
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <link rel="stylesheet" href="${stylesPath.with({ scheme: 'vscode-resource' })}">
        </head>
        ${fs.readFileSync(context.asAbsolutePath('src/webview.html'), 'utf-8')}
        </html>
    `;
}

function splitTextIntoChunks(text: string): string[] {
    const chunks: string[] = [];
    let index = 0;
    
    while (index < text.length) {
        const chunkSize = Math.min(Math.floor(Math.random() * 6) + 2, text.length - index);
        chunks.push(text.substr(index, chunkSize));
        index += chunkSize;
    }
    
    return chunks;
}

function insertTextWithChunks(editor: vscode.TextEditor, text: string) {
    const chunks = splitTextIntoChunks(text);
    let position = editor.selection.active;
    
    chunks.forEach(chunk => {
        editor.edit(editBuilder => {
            editBuilder.insert(position, chunk);
        }).then(success => {
            if (success) {
                const lines = chunk.split('\n');
                if (lines.length > 1) {
                    position = new vscode.Position(
                        position.line + lines.length - 1,
                        lines[lines.length - 1].length
                    );
                } else {
                    position = position.translate(0, chunk.length);
                }
            }
        });
    });
}