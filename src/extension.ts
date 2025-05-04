import * as vscode from "vscode";

interface TagOption {
  label: string;
  description: string;
  attributes?: string[];
}

const HTML_TAGS: TagOption[] = [
  { label: "div", description: "Generic container" },
  { label: "section", description: "Thematic grouping of content" },
  { label: "article", description: "Self-contained composition" },
  { label: "header", description: "Introductory content" },
  { label: "footer", description: "Footer content" },
  { label: "main", description: "Main content" },
  { label: "nav", description: "Navigation section" },
  { label: "aside", description: "Sidebar content" },
  { label: "form", description: "Form container" },
  { label: "table", description: "Table container" },
  { label: "blockquote", description: "Block quotation" },
  { label: "ul", description: "Unordered list" },
  { label: "ol", description: "Ordered list" },
  { label: "span", description: "Inline container" },
  { label: "a", description: "Hyperlink", attributes: ["href"] },
  { label: "strong", description: "Strong importance" },
  { label: "em", description: "Emphasized text" },
  { label: "code", description: "Code snippet" },
  { label: "mark", description: "Marked text" },
];

export function activate(context: vscode.ExtensionContext) {
  console.log('HTML Wrapper extension is now active!');

  let disposable = vscode.commands.registerTextEditorCommand(
    "html-wrapper.wrapper",
    async (textEditor: vscode.TextEditor) => {
      try {
        // Get the selected text or the current line if no selection
        const selection = textEditor.selection;
        const selectedText = textEditor.document.getText(selection);
        
        // If there's no selection, try to find the tag at cursor position
        if (selection.isEmpty) {
          const cursorPosition = selection.active;
          const line = textEditor.document.lineAt(cursorPosition.line).text;
          
          // Check if cursor is inside a tag
          const openingTag = findOpeningTag(textEditor.document, cursorPosition);
          if (!openingTag) {
            vscode.window.showErrorMessage("Please select an HTML element or place cursor inside one.");
            return;
          }
        }

        // Show Quick Pick to select a tag with descriptions
        const tag = await vscode.window.showQuickPick(
          HTML_TAGS.map(tag => ({
            label: tag.label,
            description: tag.description,
            detail: tag.attributes ? `Available attributes: ${tag.attributes.join(', ')}` : undefined
          })),
          {
            placeHolder: "Select the HTML tag to wrap with",
            matchOnDescription: true,
            matchOnDetail: true
          }
        );

        if (!tag) {
          vscode.window.showInformationMessage("No tag selected. Aborting wrap operation.");
          return;
        }

        // Get attributes if the tag has them
        let attributes = '';
        const selectedTag = HTML_TAGS.find(t => t.label === tag.label);
        if (selectedTag?.attributes?.length) {
          const attributeValues = await Promise.all(
            selectedTag.attributes.map(async (attr) => {
              const value = await vscode.window.showInputBox({
                prompt: `Enter value for ${attr} attribute`,
                placeHolder: `Enter ${attr} value...`
              });
              return value ? `${attr}="${value}"` : '';
            })
          );
          attributes = attributeValues.filter(v => v).join(' ');
        }

        const startPosition = selection.start;
        const openingTag = findOpeningTag(textEditor.document, startPosition);
        
        if (!openingTag) {
          // If no opening tag found, wrap the selection itself
          if (!selection.isEmpty) {
            const indentation = getIndentation(textEditor.document, selection.start.line);
            const wrappedText = formatWrappedText(selectedText, tag.label, attributes, indentation);
            
            const success = await textEditor.edit((editBuilder: vscode.TextEditorEdit) => {
              editBuilder.replace(selection, wrappedText);
            });

            if (success) {
              vscode.window.showInformationMessage(`Text wrapped in <${tag.label}> successfully!`);
            }
            return;
          }
          vscode.window.showErrorMessage("Failed to find HTML element to wrap.");
          return;
        }

        const closingTag = findClosingTag(textEditor.document, openingTag);
        if (!closingTag) {
          vscode.window.showErrorMessage("Failed to find matching closing tag.");
          return;
        }

        // Get the content to wrap and its indentation
        const contentToWrap = textEditor.document.getText(
          new vscode.Range(openingTag.start, closingTag.end)
        );
        const indentation = getIndentation(textEditor.document, openingTag.start.line);
        
        // Format the wrapped text with proper indentation
        const wrappedText = formatWrappedText(contentToWrap, tag.label, attributes, indentation);

        // Replace the selected HTML content with the wrapped text
        const success = await textEditor.edit((editBuilder: vscode.TextEditorEdit) => {
          editBuilder.replace(
            new vscode.Range(openingTag.start, closingTag.end),
            wrappedText
          );
        });

        if (success) {
          vscode.window.showInformationMessage(
            `HTML element wrapped in <${tag.label}> successfully!`
          );
        } else {
          vscode.window.showErrorMessage("Failed to replace text. Try again.");
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        vscode.window.showErrorMessage(`Error: ${errorMessage}`);
        console.error("Error in HTML wrapper:", error);
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}

function getIndentation(document: vscode.TextDocument, lineNumber: number): string {
  const line = document.lineAt(lineNumber).text;
  const match = line.match(/^\s*/);
  return match ? match[0] : '';
}

function formatWrappedText(content: string, tagName: string, attributes: string, indentation: string): string {
  const tabSize = 2; // You can adjust this based on your preferences
  const innerIndentation = indentation + ' '.repeat(tabSize);
  
  // Split content into lines and add proper indentation
  const lines = content.split('\n');
  const formattedLines = lines.map((line) => {
    // Skip indentation for the first line if it's just a single line
    if (lines.length === 1) {
      return line;
    }
    // Add inner indentation to all lines except empty ones
    return line.trim() ? innerIndentation + line : line;
  });

  // Join lines and add the wrapper tag
  const formattedContent = formattedLines.join('\n');
  const openingTag = attributes ? `<${tagName} ${attributes}>` : `<${tagName}>`;
  
  // If content is a single line, keep it on one line
  if (lines.length === 1) {
    return `${openingTag}${formattedContent}</${tagName}>`;
  }
  
  // For multi-line content, add proper line breaks and indentation
  return `${openingTag}\n${formattedContent}\n${indentation}</${tagName}>`;
}

function findOpeningTag(
  document: vscode.TextDocument,
  position: vscode.Position
): vscode.Range | undefined {
  const openingTagRegex = /<[a-zA-Z][a-zA-Z0-9-]*(?:\s+[^>]*)?>/g;
  let lineNumber = position.line;
  let bestMatch: vscode.Range | undefined;
  let bestMatchDistance = Infinity;

  // First, check the current line and a few lines above
  while (lineNumber >= 0) {
    const lineText = document.lineAt(lineNumber).text;
    const matches = [...lineText.matchAll(openingTagRegex)];
    
    for (const match of matches) {
      const startChar = match.index!;
      const endChar = startChar + match[0].length;
      
      // If we're on the same line as the position
      if (lineNumber === position.line) {
        // If position is within the tag
        if (position.character >= startChar && position.character <= endChar) {
          return new vscode.Range(
            new vscode.Position(lineNumber, startChar),
            new vscode.Position(lineNumber, endChar)
          );
        }
        // If position is after the tag, keep track of the closest tag
        else if (position.character > endChar) {
          const distance = position.character - endChar;
          if (distance < bestMatchDistance) {
            bestMatchDistance = distance;
            bestMatch = new vscode.Range(
              new vscode.Position(lineNumber, startChar),
              new vscode.Position(lineNumber, endChar)
            );
          }
        }
      }
      // For lines above, keep track of the last tag found
      else if (lineNumber < position.line) {
        bestMatch = new vscode.Range(
          new vscode.Position(lineNumber, startChar),
          new vscode.Position(lineNumber, endChar)
        );
      }
    }

    // If we found a match on the current line, return it
    if (lineNumber === position.line && bestMatch) {
      return bestMatch;
    }

    lineNumber--;
  }

  return bestMatch;
}

function findClosingTag(
  document: vscode.TextDocument,
  openingTagRange: vscode.Range
): vscode.Range | undefined {
  const openingTagText = document.getText(openingTagRange);
  const tagNameMatch = openingTagText.match(/<([a-zA-Z][a-zA-Z0-9-]*)/);
  
  if (!tagNameMatch) {
    return undefined;
  }

  const tagName = tagNameMatch[1];
  const closingTagRegex = new RegExp(`</${tagName}>`, "gi");
  const openingTagRegex = new RegExp(`<${tagName}(?:\\s+[^>]*)?>`,"gi");
  
  let lineNumber = openingTagRange.start.line;
  let tagCount = 1;
  let lastClosingTag: vscode.Range | undefined;

  // First pass: count tags and find the matching closing tag
  while (lineNumber < document.lineCount) {
    const lineText = document.lineAt(lineNumber).text;
    
    // Count opening tags in this line
    const openingMatches = lineText.match(openingTagRegex) || [];
    // Count closing tags in this line
    const closingMatches = lineText.match(closingTagRegex) || [];
    
    // Skip the first opening tag if we're on the same line as the opening tag range
    if (lineNumber === openingTagRange.start.line) {
      tagCount += openingMatches.length - 1;
    } else {
      tagCount += openingMatches.length;
    }
    
    tagCount -= closingMatches.length;

    // Found a potential closing tag
    if (closingMatches.length > 0) {
      const lastClosingTagMatch = [...lineText.matchAll(closingTagRegex)].pop();
      if (lastClosingTagMatch) {
        const startChar = lastClosingTagMatch.index!;
        const endChar = startChar + lastClosingTagMatch[0].length;
        lastClosingTag = new vscode.Range(
          new vscode.Position(lineNumber, startChar),
          new vscode.Position(lineNumber, endChar)
        );
        
        // If we've found our matching closing tag
        if (tagCount === 0) {
          return lastClosingTag;
        }
      }
    }

    lineNumber++;
  }

  // If we didn't find a matching closing tag but found some closing tags,
  // return the last one we found
  return lastClosingTag;
}
