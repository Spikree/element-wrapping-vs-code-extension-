# Wrapper HTML

[Install the extension from here](https://marketplace.visualstudio.com/items?itemName=Spikey.wrapper-html)

## Developed By
- [Avishkar Mahalingpure](https://github.com/Spikree)
- [Harsh Bailurkar](https://github.com/Harshbailurkar)

## Demo Video


https://github.com/user-attachments/assets/8dc17ec9-7bf7-4803-b850-2b9e524fbc60






## Features

The **Wrapper HTML** extension allows you to quickly and easily wrap selected HTML code with common HTML tags like `<div>`, `<section>`, `<article>`, etc. No more worrying about manually closing the tags—this extension handles that for you!

### Usage:

1. **Select the HTML code** you wish to wrap.
2. Use the keyboard shortcut `Ctrl+1` (or `Cmd+1` on macOS), or open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) and type `Wrap HTML Element`.
3. Pick your desired tag from the options in the quick pick menu.

### Extension Settings:

If the default keybinding conflicts with another extension or setting, you can customize it by updating your `keybindings.json` file as follows:

- Open the Command Palette: Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS).
- Type "Preferences: Open Keyboard Shortcuts (JSON)" and select it.
- Add your custom keybinding to the JSON file:

```json
[
    {
        "key": "ctrl+1", // Replace with your desired key combination
        "command": "html-wrapper-.wrapper",
        "when": "editorTextFocus"
    }
]
```
### Known Issues
Currently, the extension fully supports wrapping elements with a range of block-level tags. Future updates will include enhanced support for additional tags.

## Release Notes
### v2.0.0
- Full support for wrapping selected elements with a variety of HTML tags.
- Automatic identification of closing tags.

## Installation
Open Visual Studio Code.
In the Extension Store search wrapper html. or download it from here https://marketplace.visualstudio.com/items?itemName=Spikey.wrapper-html

if the keys are conflicting then change them as given below: 
Go to the "View" menu and select "Command Palette" (or use the shortcut Ctrl+Shift+P or Cmd+Shift+P on macOS).
Type "Preferences: Open Keyboard Shortcuts (JSON)" and select it from the dropdown.
In the keybindings.json file, add your custom key binding as shown above.
Enjoy your streamlined HTML wrapping experience!
