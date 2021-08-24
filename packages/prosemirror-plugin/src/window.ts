import { setupExportedActions } from "@luke-john/prosemirror-devtools-shared-utils";

import { exportedPluginActions } from "./actions/exportedPluginActions";
import { initializeImportedActions } from "./importedActions";

import "./local-state";

// Used by the devtools script to decide whether to create a panel
// @ts-expect-error
globalThis.__PROSEMIRROR_DEVTOOLS__ = true;

setupExportedActions({
  runtime: "page",
  exportedActions: exportedPluginActions,
  postMessage: (message) => {
    window.postMessage(message, "*");
  },
  registerEventListener: (eventListener) => {
    window.addEventListener("message", (event) => eventListener(event.data));
  },
});
initializeImportedActions({
  postMessage: (message) => {
    window.postMessage(message, "*");
  },
  registerEventListener: (eventListener) => {
    window.addEventListener("message", (event) => eventListener(event.data));
  },
});

export { devtoolsPlugin, pluginKey } from "./plugin";
