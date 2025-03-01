# Lab Partner

Lab Partner is a Visual Studio Code extension designed to help you copy and paste code snippets from anywhere to your code editor while keeping your actions discreet. The extension allows for step-by-step removal of pasted code upon pressing `Ctrl+Z`, which helps you avoid getting caught by your lab instructor.

## Features

- **Copy and Paste Anywhere**: Paste code snippets from anywhere (e.g., websites, documents) into the VS Code editor.
- **Discreet Undo**: When you press `Ctrl+Z`, the pasted code is not removed at once. Instead, it is removed in small chunks, ensuring you won't raise suspicion.
- **Helps During Lab Sessions**: This feature helps you avoid getting caught when copying code during coding sessions.

## How to Use

1. **Install the Extension**: Open VS Code and search for `Lab Partner` in the Extensions Marketplace or install it manually from the `.vsix` file.
2. **Copy Code Snippets**: Copy code snippets from anywhere (e.g., websites, documents).
3. **Paste Code**: Paste the copied code into your VS Code editor.
4. **Use `Ctrl+Z`**: When you want to undo your paste, press `Ctrl+Z`. The code will be undone step by step, instead of all at once.

## Requirements

- Visual Studio Code

## Extension Settings

This extension does not require any configuration settings.

## Known Issues

- **Undo Step Size**: Currently, the chunks of code are removed randomly in sizes from 2–7 characters. Fine-tuning for a smoother experience might be considered in future releases.

## Release Notes

### 1.0.0

- Initial release of Lab Partner.
- Allows step-by-step removal of pasted code when `Ctrl+Z` is pressed.

---

## Contributing

If you'd like to contribute to the development of Lab Partner, please feel free to open an issue or submit a pull request. Contributions are always welcome!

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.