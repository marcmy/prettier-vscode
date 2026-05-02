# Prettier viewport fix

This is a custom build of the VS Code Prettier extension with a small viewport-restoration patch.

It is based on `prettier-vscode` version `12.4.0` and keeps the original extension identity:

```text
esbenp.prettier-vscode
```

## What this fixes

On large JavaScript/TypeScript files, formatting with Prettier can sometimes make VS Code jump the editor viewport to the end of the file after format-on-save, format-on-paste, or manual document formatting.

This build preserves the active editor selection before Prettier formatting edits are returned, then restores the selection after VS Code applies those edits. The goal is to keep the editor near the same visible location instead of jumping to EOF.

## Install

Download the VSIX from the latest GitHub Release, then install it with VS Code:

```powershell
code --install-extension .\prettier-vscode-viewport-fix.vsix --force
```

Restart or reload VS Code after installing.

## Notes

Because this build keeps the same extension ID as the official Marketplace extension, installing it replaces the normal Prettier extension locally.

The VS Code Marketplace may later update it back to the official build. If the viewport bug returns, reinstall this VSIX.

## Recommended test settings

Use Prettier as the default formatter and enable the formatter path you want to test:

```jsonc
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.formatOnPaste": true
}
```

For JavaScript/TypeScript-specific testing:

```jsonc
{
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## Build locally

```powershell
npm ci
npm run check-types
npm run compile
npx vsce package --out .\prettier-vscode-viewport-fix.vsix
```

## Development host

To test the extension from source:

```powershell
code --extensionDevelopmentPath "$PWD"
```

## Scope

This is not a general fork of Prettier or a behavior change to formatting output. It only changes how the VS Code extension restores the editor state after formatting.

The upstream project README is still available in [`README.md`](./README.md).
