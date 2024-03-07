# html-wrapper- README

Welcome to the README for your "html-wrapper-" extension! This document provides information about the features, requirements, installation instructions, and more for your extension.

## Features

This extension allows you to  wrap your HTML code in a `<div>` element

## Requirements

recomended to use with the prettier extension

## Extension Settings

add this in your keybindings.json

[
    {
        "key": "ctrl+1",
        "command": "html-wrapper-.wrapper",
        "when": "editorTextFocus"
    }    
    
]

## Known Issues

you can only wrap an element with a div tag (we will add more  support for other tags soon)

## Release Notes

you can wrap selected element in a div tag you dont have to search for the ending tag.

### 0.0.1

- Initial release

### 0.0.1

- published extension

## Installation

Open Visual Studio Code.

Go to the "View" menu, and select "Command Palette" (or use the shortcut Ctrl+Shift+P or Cmd+Shift+P on macOS).

Type "Preferences: Open Keyboard Shortcuts (JSON)" and select it from the dropdown. This will open the keybindings.json file in JSON format.

In the keybindings.json file, you can add your custom key bindings using the following format:

[
    {
        "key": "ctrl+1",
        "command": "html-wrapper-.wrapper",
        "when": "editorTextFocus"
    }    
    
]

## Licence

The MIT License (MIT)
Copyright © 2024 Spikree, <avimahalingpure10@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


**Enjoy!**
