import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "html-wrapper-" is now active!');

    let disposable = vscode.commands.registerTextEditorCommand('html-wrapper-.wrapper', (textEditor: vscode.TextEditor) => {
        const selection = textEditor.selection;
        const selectedText = textEditor.document.getText(selection);

        // Check if text is selected
        if (selectedText) {
            // Get the start and end positions of the selected text
            const startPos = selection.start;
            const endPos = selection.end;

            // Wrap the selected HTML element with a <div>
            const wrappedText = `<div>${selectedText}</div>`;

            // Replace the selected HTML element with the wrapped text
            textEditor.edit(editBuilder => {
                editBuilder.replace(new vscode.Range(startPos, endPos), wrappedText);
            });

            vscode.window.showInformationMessage('HTML element wrapped in <div> successfully!');
        } else {
            vscode.window.showInformationMessage('Please select an HTML element to wrap.');
        }
    });

    // Register the keybinding
    context.subscriptions.push(disposable);
    context.subscriptions.push(vscode.commands.registerCommand('html-wrapper-.wrapper', () => {
        vscode.commands.executeCommand('html-wrapper-.wrapper');
    }));
}

export function deactivate() {}