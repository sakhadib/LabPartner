"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('labpartner.showInsertPanel', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('Please open a file first!');
            return;
        }
        const panel = vscode.window.createWebviewPanel('labPartner', 'LabPartner', vscode.ViewColumn.Beside, {
            enableScripts: true,
            retainContextWhenHidden: true
        });
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
                }
                catch (error) {
                    vscode.window.showErrorMessage(`Insertion failed: ${error}`);
                }
            }
        });
    }));
}
function getWebviewContent(context) {
    const stylesPath = vscode.Uri.file(context.asAbsolutePath('media/styles.css'));
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <link rel="stylesheet" href="${stylesPath.with({ scheme: 'vscode-resource' })}">
        </head>
        ${fs.readFileSync(context.asAbsolutePath('media/webview.html'), 'utf-8')}
        </html>
    `;
}
function splitTextIntoChunks(text) {
    const chunks = [];
    let index = 0;
    while (index < text.length) {
        const chunkSize = Math.min(Math.floor(Math.random() * 6) + 2, text.length - index);
        chunks.push(text.substr(index, chunkSize));
        index += chunkSize;
    }
    return chunks;
}
async function insertTextWithChunks(editor, text) {
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
            position = new vscode.Position(position.line + lines.length - 1, lines[lines.length - 1].length);
        }
        else {
            position = position.translate(0, chunk.length);
        }
    }
}
//# sourceMappingURL=extension.js.map