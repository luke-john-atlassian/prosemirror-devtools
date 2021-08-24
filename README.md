# ProseMirror devtools

**Warning**: This tooling is provided as-is and is not currently supported. It is still under development.

## Key Features

- Browser extension (supports chromium browsers)
- Standalone app (supports connecting to prosemirror editors in node and web environments)

## Usage

### Browser devtools

Install the browser extension.

Add the window devtools plugin to your editor.

```ts
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { schema } from "prosemirror-schema-basic";

import { devtoolsPlugin } from "@luke-john/prosemirror-devtools-plugin/window";

const doc = schema.node("doc", undefined, []);
const plugins = exampleSetup({ schema });
plugins.push(devtoolsPlugin);

new EditorView({
  state: EditorState.create({ schema, plugins, doc }),
});
```

Load the editor in a browser tab and open the browser Developer Tools.

The Developer Tools should have a new Panel tab for ProseMirror.

### Standalone devtools

Install the standalone application.

Add the node devtools plugin to your editor which is used in a node environment.

```ts
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { schema } from "prosemirror-schema-basic";

import { devtoolsPlugin } from "@luke-john/prosemirror-devtools-plugin/node";

const doc = schema.node("doc", undefined, [])
const plugins = exampleSetup({ schema });
plugins.push(devtoolsPlugin);

jest.setTimeout(300000);
test("example jest test". async () => {
  new EditorView({
    state: EditorState.create({ schema, plugins, doc }),
  });

  let tr = editorView.state.tr;
  tr.insertText("Wash your hands! ");
  editorView.dispatch(tr);

  // needed to prevent the test completing and allowing you to inspect the
  // prosemirror document and history
  await new Promise((res) => {});
})
```

Open the standalone application.

Run the test, it should pause at the await.

The standalone application should have connected to the prosemirror plugin and be displaying the devtools.

## Development instructions

### Getting started

First you need to run `npm install` from the project root, this will install all the libraries dependencies.

Each app then requires unique development steps. Per app instructions for development are available in their individual README.md files.

### Repo structure

#### Apps

##### Browser extension

A chromium browser extension which connects to the current pages prosemirror devtools plugins.

##### Standalone app

An electron standalone app which supports connecting to a node environment with the prosemirror devtools plugin running.

##### Example editor

An application used for test purposes, useful for testing the browser extension.

- serves a page setup with a prosemirror editor configured with the ProseMirror plugin to speak to the browser,
- has a jest test setup with a prosemirror editor configured with the ProseMirror plugin to speak to the standalone,

#### Libraries

##### Shared UI

Shared user interface for interacting with the prosemirror view, state and history.

Runtime dependent of: Chromium extension, Electron app

Development dependency of: ProseMirror Plugin (used for types)

##### ProseMirror Plugin

ProseMirror plugin which can be configured to connect to either the browser extension or the standalone electron app.

Development dependency of: Shared UI (used for types)

##### Shared Utils

Messaging utils to support defining functions in one environment, and calling them in a remote environment.

Runtime dependent of: Chromium extension, Electron app, Shared UI
