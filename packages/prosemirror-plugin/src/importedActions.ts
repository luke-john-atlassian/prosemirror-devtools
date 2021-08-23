import {
  AsyncActions,
  setupImportedActions,
} from "@luke-john/prosemirror-devtools-shared-utils";
import type { SharedUiActions } from "@luke-john/prosemirror-devtools-shared-ui";
import { socket } from "./setupNode";

export let linkedDevtoolsActions: AsyncActions<{
  updateTrackedPmEditors: (updatedTrackedPmEditors: any[]) => void;
}>;

export function initializeImportedActions(runtime: "page" | "node") {
  if (runtime === "page") {
    const { actions } = setupImportedActions<SharedUiActions>({
      runtime: "page",
      remoteRuntime: "devtools",
      postMessage: (message) => {
        window.postMessage(message, "*");
      },
      registerEventListener: (eventListener) => {
        window.addEventListener("message", (event) =>
          eventListener(event.data)
        );
      },
    });
    linkedDevtoolsActions = actions;
  } else if (runtime === "node") {
    const { actions } = setupImportedActions<SharedUiActions>({
      runtime: "page",
      remoteRuntime: "devtools",
      postMessage: (message) => {
        socket.emit("pm-devtools", message);
      },
      registerEventListener: (eventListener) => {
        socket.on("pm-devtools", (message) => {
          eventListener(message);
        });
      },
    });

    linkedDevtoolsActions = actions;
  }
}
