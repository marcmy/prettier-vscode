import {
  CancellationToken,
  DocumentFormattingEditProvider,
  DocumentRangeFormattingEditProvider,
  FormattingOptions,
  Position,
  Range,
  Selection,
  TextDocument,
  TextEdit,
  TextEditorRevealType,
  window,
  workspace,
} from "vscode";
import { ExtensionFormattingOptions } from "./types.js";

interface EditorState {
  documentUri: string;
  selections: Selection[];
}

export class PrettierEditProvider
  implements DocumentRangeFormattingEditProvider, DocumentFormattingEditProvider
{
  constructor(
    private provideEdits: (
      document: TextDocument,
      options: ExtensionFormattingOptions,
    ) => Promise<TextEdit[]>,
  ) {}

  public async provideDocumentRangeFormattingEdits(
    document: TextDocument,
    range: Range,
    _options: FormattingOptions,
    token: CancellationToken,
  ): Promise<TextEdit[]> {
    return this.provideEditsPreservingEditorState(
      document,
      {
        rangeEnd: document.offsetAt(range.end),
        rangeStart: document.offsetAt(range.start),
        force: false,
      },
      token,
    );
  }

  public async provideDocumentFormattingEdits(
    document: TextDocument,
    _options: FormattingOptions,
    token: CancellationToken,
  ): Promise<TextEdit[]> {
    return this.provideEditsPreservingEditorState(
      document,
      {
        force: false,
      },
      token,
    );
  }

  private async provideEditsPreservingEditorState(
    document: TextDocument,
    options: ExtensionFormattingOptions,
    token: CancellationToken,
  ): Promise<TextEdit[]> {
    const state = this.captureEditorState(document);
    const edits = await this.provideEdits(document, options);

    if (edits.length > 0 && !token.isCancellationRequested && state) {
      this.restoreEditorStateOnNextDocumentChange(state);
    }

    return edits;
  }

  private captureEditorState(document: TextDocument): EditorState | undefined {
    const editor = window.activeTextEditor;

    if (!editor || editor.document.uri.toString() !== document.uri.toString()) {
      return undefined;
    }

    return {
      documentUri: document.uri.toString(),
      selections: editor.selections.map(
        (selection: Selection) =>
          new Selection(selection.anchor, selection.active),
      ),
    };
  }

  private restoreEditorStateOnNextDocumentChange(state: EditorState): void {
    const disposable = workspace.onDidChangeTextDocument((event) => {
      if (event.document.uri.toString() !== state.documentUri) {
        return;
      }

      disposable.dispose();
      this.restoreEditorState(state);
    });
  }

  private restoreEditorState(state: EditorState): void {
    const editor = window.activeTextEditor;

    if (!editor || editor.document.uri.toString() !== state.documentUri) {
      return;
    }

    editor.selections = state.selections.map(
      (selection: Selection) =>
        new Selection(
          this.clampPosition(editor.document, selection.anchor),
          this.clampPosition(editor.document, selection.active),
        ),
    );

    const active = editor.selection.active;

    editor.revealRange(
      new Range(active, active),
      TextEditorRevealType.InCenterIfOutsideViewport,
    );
  }

  private clampPosition(document: TextDocument, position: Position): Position {
    const line = Math.min(position.line, document.lineCount - 1);
    const character = Math.min(
      position.character,
      document.lineAt(line).text.length,
    );

    return new Position(line, character);
  }
}
