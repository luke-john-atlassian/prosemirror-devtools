/**
 * @jest-environment jsdom
 */

import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { schema } from "prosemirror-schema-basic";
// @ts-ignore
import { exampleSetup } from "prosemirror-example-setup";

import { devtoolsPlugin } from "@luke-john/prosemirror-devtools-plugin/node";

const plugins = exampleSetup({ schema });
plugins.push(devtoolsPlugin);

let doc = schema.node("doc", undefined, [
  schema.node("paragraph", undefined, [schema.text("One.")]),
  schema.node("horizontal_rule"),
  schema.node("paragraph", undefined, [schema.text("Two!")]),
]);

jest.setTimeout(300000);

// @ts-ignore
test("adds 1 + 2 to equal 3", async () => {
  const element = document.createElement("div");
  element.id = "app0";
  document.body.appendChild(element);
  const editorView = new EditorView(document.querySelector("#app0")!, {
    state: EditorState.create({ schema, plugins, doc }),
  });

  let tr = editorView.state.tr;

  tr.insertText("Wash your hands! ");

  editorView.dispatch(tr);

  let tr2 = editorView.state.tr;

  tr2.insertText("And again! ");

  editorView.dispatch(tr2);

  await new Promise((res) => {});

  debugger;
});
