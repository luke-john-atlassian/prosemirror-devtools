import * as React from "react";
import * as ReactDom from "react-dom";

import { StateExplorer } from "@luke-john/prosemirror-devtools-shared-ui";
import {
  trackedPluginStates,
  DevtoolsPluginState,
} from "@luke-john/prosemirror-devtools-plugin";

function App() {
  const [stateHistory, setStateHistory] = React.useState<
    DevtoolsPluginState["history"]
  >([]);

  React.useEffect(() => {
    const controller = new AbortController();
    let interval: ReturnType<typeof setInterval>;
    function loadDocument() {
      const firstTrackedPluginState = [...trackedPluginStates][0];
      if (controller.signal.aborted) {
        clearInterval(interval);
        return;
      }

      if (firstTrackedPluginState) {
        setStateHistory([...firstTrackedPluginState!.history]);
      }
    }
    interval = setInterval(loadDocument, 1000);

    return () => {
      controller.abort();
    };
  }, []);

  if (!stateHistory) {
    return null;
  }

  return (
    <React.Fragment>
      {stateHistory
        .reverse()
        .slice(0, 10)
        .map((historyEntry, index) => (
          <StateExplorer
            key={historyEntry.transaction?.time || "init"}
            document={historyEntry.doc}
            selection={historyEntry.selection}
            transaction={historyEntry.transaction!}
          />
        ))}
    </React.Fragment>
  );
}

const target = document.getElementById("react-demo");

ReactDom.render(
  <div
    style={{
      padding: "0 20px",
      marginTop: 20,
    }}
  >
    <App />
  </div>,
  target
);
