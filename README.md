# Space Block Text Jumper

Navigational package for the VS Code text editor.

This package lets you jump with the cursor vertically across space/whitespace separated blocks/paragraphs and skip empty lines as well as skipping the closest edge of the new block when jumping out of a block. It also lets you select while jumping and has a command that selects current block/paragraph.

# Usage

The extension registers the following commands

![Imgur](https://i.imgur.com/KEr7YbH.png)

Jumping inside a block takes you to the its edge. When jumping from an edge of a block the cursor skips the closest edge in the new block. Consecutive empty lines are always skipped.

# Demo

Moving between blocks and using selection

![Imgur](https://imgur.com/75gEEQk.gif)

Using the block selection command

![Imgur](https://imgur.com/b5vOWdZ.gif)

# Port

A clone for sublime text exists here [https://github.com/aronj/sublime-space-block-jumper](https://github.com/aronj/sublime-space-block-jumper)
