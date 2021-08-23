import { setupExportedActions } from "@luke-john/prosemirror-devtools-shared-utils";
import { socket } from "../setupNode";

import {
  getEditorHistoryEntry,
  getTrackedPmEditor,
  getTrackedPmEditors,
} from "../local-state";

import { getSerializableHistoryEntry } from "./getSerializableHistoryEntry";
import { getSerializableSchema } from "./serializationUtils/getSerializableSchema";

export const exportedPluginActions = {
  getEditorSchema(editorId: number) {
    const trackedPmEditor = getTrackedPmEditor(editorId)!;

    const schema = getSerializableSchema(trackedPmEditor.editorState.schema);

    return schema;
  },
  getFirstHistoryEntry(editorId: number) {
    const rawHistoryEntry = getEditorHistoryEntry(editorId)!;

    const serializableHistoryEntry = getSerializableHistoryEntry(
      rawHistoryEntry.editorState,
      rawHistoryEntry.tr
    );

    return serializableHistoryEntry;
  },
  getHistoryEntry(editorId: number, historyTimestamp: number) {
    const rawHistoryEntry = getEditorHistoryEntry(editorId, historyTimestamp)!;

    const serializableHistoryEntry = getSerializableHistoryEntry(
      rawHistoryEntry.editorState,
      rawHistoryEntry.tr
    );

    return serializableHistoryEntry;
  },
  getTrackedPmEditorHistoryEntries(editorId: number) {
    const trackedPmEditor = getTrackedPmEditor(editorId)!;

    const historyEntries = trackedPmEditor.transactionHistory.map(
      (transactionHistoryEntry) => transactionHistoryEntry.timeStamp
    );

    return historyEntries;
  },
  listTrackedPmEditors() {
    const trackedPmEditors = getTrackedPmEditors();
    const serializableTrackedPmEditors = Object.values(trackedPmEditors).map(
      (trackedPmEditor) => {
        return {
          created: trackedPmEditor.created,
          updated: trackedPmEditor.updated,
        };
      }
    );

    return serializableTrackedPmEditors;
  },
};
export type PluginActions = typeof exportedPluginActions;

export function initializeExportedActions(runtime: "page" | "node") {
  if (runtime === "page") {
    setupExportedActions({
      runtime: "page",
      exportedActions: exportedPluginActions,
      postMessage: (message) => {
        window.postMessage(message, "*");
      },
      registerEventListener: (eventListener) => {
        window.addEventListener("message", (event) =>
          eventListener(event.data)
        );
      },
    });
  } else if (runtime === "node") {
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
  }
}
