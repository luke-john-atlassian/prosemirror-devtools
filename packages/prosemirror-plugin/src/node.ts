import { setupExportedActions } from "@luke-john/prosemirror-devtools-shared-utils";

import { exportedPluginActions } from "./actions/exportedPluginActions";
import { initializeImportedActions } from "./importedActions";

import "./local-state";
import { socket } from "./setupNode";

setupExportedActions({
  runtime: "page",
  exportedActions: exportedPluginActions,
  postMessage: (message) => {
    socket.emit("pm-devtools", message);
  },
  registerEventListener: (eventListener) => {
    socket.on("pm-devtools", (message) => {
      eventListener(message);
    });
  },
});
initializeImportedActions({
  postMessage: (message) => {
    socket.emit("pm-devtools", message);
  },
  registerEventListener: (eventListener) => {
    socket.on("pm-devtools", (message) => {
      eventListener(message);
    });
  },
});

export { devtoolsPlugin, pluginKey } from "./plugin";
