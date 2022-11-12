// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

import * as sbtj from "./space-block-text-jumper";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("space-block-text-jumper.jumpUp", () => {
      sbtj.jumpUp();
    }),
    vscode.commands.registerCommand("space-block-text-jumper.jumpDown", () => {
      sbtj.jumpDown();
    }),
    vscode.commands.registerCommand(
      "space-block-text-jumper.jumpSelectUp",
      () => {
        sbtj.jumpSelectUp();
      }
    ),
    vscode.commands.registerCommand(
      "space-block-text-jumper.jumpSelectDown",
      () => {
        sbtj.jumpSelectDown();
      }
    ),
    vscode.commands.registerCommand(
      "space-block-text-jumper.selectBlock",
      () => {
        sbtj.selectBlock();
      }
    )
  );
}

export function deactivate() {}
