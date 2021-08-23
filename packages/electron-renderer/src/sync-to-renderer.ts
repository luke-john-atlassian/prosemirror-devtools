import { PluginActions } from "@luke-john/prosemirror-devtools-plugin";
import { setupImportedActions } from "@luke-john/prosemirror-devtools-shared-utils";
import { setupUiExportedActions } from "@luke-john/prosemirror-devtools-shared-ui";

const { ipcRenderer: untypedIpcRenderer } = window.require("electron");
import type { ipcRenderer as IpcRenderer } from "electron";

const ipcRenderer: typeof IpcRenderer = untypedIpcRenderer;

const { actions: activePageActions } = setupImportedActions<PluginActions>({
  runtime: "devtools",
  remoteRuntime: "page",
  postMessage: (message) => {
    ipcRenderer.send("pm-devtools", message);
  },
  registerEventListener: (messageHandler) => {
    ipcRenderer.on("pm-devtools", (event, arg) => {
      messageHandler(arg);
    });
  },
});

export { activePageActions };

setupUiExportedActions({
  runtime: "devtools",
  postMessage: (message) => {
    ipcRenderer.send("pm-devtools", message);
  },
  registerEventListener: (messageHandler) => {
    ipcRenderer.on("pm-devtools", (event, arg) => {
      messageHandler(arg);
    });
  },
});
