import {
  getEditorHistoryEntry,
  getTrackedPmEditor,
  getTrackedPmEditors,
} from "../local-state";
import { codeEval } from "./codeEval";

import { getSerializableHistoryEntry } from "./getSerializableHistoryEntry";
import { getSerializableSchema } from "./serializationUtils/getSerializableSchema";

export const exportedPluginActions = {
  runTransaction(editorId: number, code: string) {
    const trackedPmEditor = getTrackedPmEditor(editorId)!;

    try {
      codeEval(code, {
        editorView: trackedPmEditor.editorView,
        editorState: trackedPmEditor.editorState,
      });

      return { status: "success" as const };
    } catch (err) {
      return {
        status: "failure" as const,
        // @ts-ignore
        err: err?.message,
      };
    }
  },
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
