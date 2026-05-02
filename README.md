# Prettier viewport fix

This fork is a custom build of the VS Code Prettier extension with a viewport-restoration fix.

It is based on [`prettier/prettier-vscode`](https://github.com/prettier/prettier-vscode) `12.4.0` and keeps the original VS Code extension ID:

```text
esbenp.prettier-vscode
```

## What it fixes

On large JavaScript/TypeScript files, the official Prettier VS Code extension can sometimes make VS Code jump the editor viewport to the end of the file after formatting.

This is most noticeable with:

- format on save
- format on paste
- manual **Format Document**
- large files where Prettier changes text above or around the cursor

This build captures the active editor selection before Prettier returns formatting edits, waits for VS Code to apply those edits, then restores the selection and reveals the restored cursor position. The goal is to keep the editor near the same visible location instead of jumping to EOF.

## Download

Grab the VSIX from the latest GitHub release:

[Latest release](https://github.com/marcmy/prettier-vscode/releases/latest)

## Install

```powershell
code --install-extension .\prettier-vscode-viewport-fix.vsix --force
```

Restart or reload VS Code after installing.

## Important notes

Because this build keeps the same extension ID as the official Marketplace extension, installing it replaces the normal Prettier extension locally.

The VS Code Marketplace may later update it back to the official build. If the viewport bug returns, reinstall this VSIX.

This is not an official Prettier release. It is a small fork for testing/using the viewport fix.

## Recommended test settings

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

## Test from source

```powershell
code --extensionDevelopmentPath "$PWD"
```

## Scope

This fork does not change Prettier's formatting output. The patch only changes how the VS Code extension restores editor state after formatting.

For the full upstream documentation, see the official project:

[`prettier/prettier-vscode`](https://github.com/prettier/prettier-vscode)
