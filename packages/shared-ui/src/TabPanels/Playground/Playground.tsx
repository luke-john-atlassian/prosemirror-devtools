import * as React from "react";

import { useActions } from "../../ActionsProvider";
import { useRegisteredAppState } from "../../AppStateProvider";

const exampleCode = `
let tr = editorState.tr;
tr.insertText("hello");
editorView.dispatch(tr);`.trim();

export function Playground() {
  const appState = useRegisteredAppState();
  const actions = useActions();
  const [code, setCode] = React.useState(exampleCode);
  let [commandOutput, setCommandOutput] = React.useState<undefined | string>();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = await actions.runTransaction(
      appState.selectedEditorId!,
      code
    );

    if (result.status === "success") {
      setCommandOutput(undefined);
    } else {
      setCommandOutput(result.err);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ padding: "1rem" }}>
      <textarea
        value={code}
        onChange={(event) => {
          setCode(event.target.value);
        }}
        rows={10}
        style={{
          width: "500px",
        }}
      />
      <br />
      <input type="submit" value="Run transaction" />
      {commandOutput !== undefined && <p>{commandOutput}</p>}
    </form>
  );
}
