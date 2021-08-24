import "./editor.css";

import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { schema } from "prosemirror-schema-basic";
// @ts-ignore
import { exampleSetup } from "prosemirror-example-setup";

import { devtoolsPlugin } from "@luke-john/prosemirror-devtools-plugin/window";

const plugins = exampleSetup({ schema });
plugins.push(devtoolsPlugin);

let doc = schema.node("doc", undefined, [
  schema.node("paragraph", undefined, [schema.text("One.")]),
  schema.node("horizontal_rule"),
  schema.node("paragraph", undefined, [schema.text("Two!")]),
]);

new EditorView(document.querySelector("#app0")!, {
  state: EditorState.create({ schema, plugins, doc }),
});

// import "./react-demo";
