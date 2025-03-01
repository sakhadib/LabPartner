import * as vscode from 'vscode';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('labpartner.showInsertPanel', () => {
            const editor = vscode.window.activeTextEditor;
            
            if (!editor) {
                vscode.window.showErrorMessage('Please open a file first!');
                return;
            }

            const panel = vscode.window.createWebviewPanel(
                'labPartner',
                'LabPartner',
                vscode.ViewColumn.Beside,
                { 
                    enableScripts: true,
                    retainContextWhenHidden: true
                }
            );

            panel.webview.html = getWebviewContent(context);
            
            // Store the original editor reference
            let targetEditor = editor;

            panel.webview.onDidReceiveMessage(async (message) => {
                if (message.error) {
                    vscode.window.showErrorMessage(message.error);
                    return;
                }

                const text = message.text;
                
                if (text) {
                    try {
                        // Verify editor is still valid
                        if (!targetEditor || !targetEditor.document) {
                            vscode.window.showErrorMessage('Original editor is no longer available!');
                            panel.dispose();
                            return;
                        }
                        
                        await insertTextWithChunks(targetEditor, text);
                        panel.dispose();
                    } catch (error) {
                        vscode.window.showErrorMessage(`Insertion failed: ${error}`);
                    }
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

async function insertTextWithChunks(editor: vscode.TextEditor, text: string) {
    const chunks = splitTextIntoChunks(text);
    let position = editor.selection.active;

    for (const chunk of chunks) {
        // Use await to ensure sequential insertion
        const success = await editor.edit(editBuilder => {
            editBuilder.insert(position, chunk);
        });

        if (!success) {
            throw new Error('Edit operation failed');
        }

        // Update position after successful insertion
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
}