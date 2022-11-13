import { window } from "vscode";
import * as vscode from "vscode";
import * as assert from "assert";

const jump = (direction: number, select = false) => {
  const editor = window.activeTextEditor;
  assert(editor !== undefined);
  const currLine = editor.selection.active.line;
  const currColumn = editor.selection.active.character;

  // TODO: make configurable
  const skipClosestEdge = true;
  const jumpToBlockSeparator = false;

  const newLine = Math.max(
    0,
    getNewLine(currLine, direction, skipClosestEdge, jumpToBlockSeparator)
  );

  editor.revealRange(new vscode.Range(newLine, 0, newLine, 0));

  if (direction === -1) {
    if (select) {
      const currPos = new vscode.Position(
        editor.selections[0].anchor.line ?? currLine,
        editor.selections[0].anchor.line < newLine
          ? 0
          : editor.document.lineAt(editor.selections[0].anchor.line).text.length
      );
      const newPos = new vscode.Position(newLine, 0);
      editor.selections = [new vscode.Selection(currPos, newPos)];
    } else {
      const myPos = new vscode.Position(newLine, currColumn);
      editor.selection = new vscode.Selection(myPos, myPos);
    }
  } else {
    if (select) {
      const currPos = new vscode.Position(
        editor.selections[0].anchor.line ?? currLine,
        editor.selections[0].anchor.line > newLine
          ? editor.selections[0].anchor.character
          : 0
      );
      const newPos = new vscode.Position(
        newLine,
        editor.document.lineAt(newLine).text.length
      );
      editor.selections = [new vscode.Selection(currPos, newPos)];
    } else {
      const newPos = new vscode.Position(newLine, currColumn);
      editor.selection = new vscode.Selection(newPos, newPos);
    }
  }
};

const selectBlock = () => {
  const editor = window.activeTextEditor;
  assert(editor !== undefined);
  const currLine = editor.selection.active.line;

  const topLine = getNewLine(currLine, -1, true, false, true);
  const bottomLine = getNewLine(currLine, 1, true, false, true);
  const bottomLineLength = editor.document.lineAt(bottomLine).text.length;

  const topPos = new vscode.Position(topLine, 0);
  const bottomPos = new vscode.Position(bottomLine, bottomLineLength);
  editor.selection = new vscode.Selection(topPos, bottomPos);
};

const isInBounds = (lineNumber: number) => {
  return lineNumber >= 0 && lineNumber <= getLastLineNumber();
};
const getLastLineNumber = () => {
  assert(window.activeTextEditor);
  return window.activeTextEditor.document.lineCount - 1;
};

const isEmptyLine = (lineNumber: number): boolean => {
  assert(window.activeTextEditor);
  return window.activeTextEditor.document.lineAt(lineNumber)
    .isEmptyOrWhitespace;
};

const getNewLine = (
  currLine: number,
  direction: number,
  skipClosestEdge: boolean,
  jumpToBlockSeparator: boolean,
  stayInBlock: boolean = false
) => {
  const nextLine = currLine + direction;

  if (!isInBounds(nextLine)) {
    return currLine;
  }

  if (jumpToBlockSeparator) {
    currLine += direction;
    while (
      isInBounds(currLine + direction) &&
      isEmptyLine(currLine) === isEmptyLine(currLine + direction)
    ) {
      currLine += direction;
    }
    return currLine + (!isEmptyLine(currLine) ? direction : 0);
  }

  // moving in emptiness
  if (isEmptyLine(currLine) && isEmptyLine(nextLine)) {
    currLine += direction;
    while (
      isInBounds(currLine + direction) &&
      isEmptyLine(currLine + direction)
    ) {
      currLine += direction;
    }
    if (!stayInBlock) {
      currLine += direction;
    }
  }

  // moving inside a block
  else if (!isEmptyLine(currLine) && !isEmptyLine(nextLine)) {
    currLine += direction;
    while (
      isInBounds(currLine + direction) &&
      !isEmptyLine(currLine + direction)
    ) {
      currLine += direction;
    }
  }

  // moving from an edge of a block
  else if (!isEmptyLine(currLine) && isEmptyLine(nextLine) && !stayInBlock) {
    currLine += direction;
    if (skipClosestEdge) {
      while (
        isInBounds(currLine + direction) &&
        !(!isEmptyLine(currLine) && isEmptyLine(currLine + direction))
      ) {
        currLine += direction;
      }
    } else {
      while (isInBounds(currLine + direction) && isEmptyLine(currLine)) {
        currLine += direction;
      }
    }
  }

  // moving to an edge of a block
  else if (isEmptyLine(currLine) && !isEmptyLine(nextLine) && !stayInBlock) {
    currLine += direction;
  }

  return currLine;
};

const jumpUp = () => {
  jump(-1);
};
const jumpDown = () => {
  jump(1);
};

const jumpSelectUp = () => {
  jump(-1, true);
};

const jumpSelectDown = () => {
  jump(1, true);
};

export { jumpUp, jumpDown, jumpSelectUp, jumpSelectDown, selectBlock };
