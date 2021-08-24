import type { EditorState, Transaction } from "prosemirror-state";
import type { EditorView } from "prosemirror-view";
import { linkedDevtoolsActions } from "./importedActions";

export type TrackedPmEditor = {
  created: number;
  updated: number;
  editorView?: EditorView<any>;
  editorState: EditorState<any>;
  transactionHistory: {
    timeStamp: number;
    editorState: EditorState;
    tr?: Transaction;
  }[];
};

const trackedPmEditors: {
  [id: string]: TrackedPmEditor;
} = {};

// @ts-expect-error
globalThis.trackedPmEditors = trackedPmEditors;

export function trackPmEditor(pmEditorToTrack: TrackedPmEditor) {
  trackedPmEditors[pmEditorToTrack.created] = pmEditorToTrack;
}
export function untrackPmEditor(pmEditorToTrack: TrackedPmEditor) {
  delete trackedPmEditors[pmEditorToTrack.created];
}

export async function notifyTrackedPmEditors() {
  const serializableTrackedPmEditors = Object.values(trackedPmEditors).map(
    (trackedPmEditor) => {
      return {
        created: trackedPmEditor.created,
        updated: trackedPmEditor.updated,
      };
    }
  );
  await linkedDevtoolsActions.updateTrackedPmEditors(
    serializableTrackedPmEditors
  );
}
export function updatePmEditor(_pmEditorToTrack: TrackedPmEditor) {
  notifyTrackedPmEditors();
}

export function getTrackedPmEditors() {
  return trackedPmEditors;
}

export function getTrackedPmEditor(editorId: number) {
  return trackedPmEditors[editorId];
}

export function getEditorHistoryEntry(
  editorId: number,
  historyTimestamp?: number
) {
  const trackedPmEditor = trackedPmEditors[editorId]!;

  if (!historyTimestamp) {
    return trackedPmEditor.transactionHistory[0];
  }

  return trackedPmEditor.transactionHistory.find((transactionHistory) => {
    return transactionHistory.timeStamp === historyTimestamp;
  });
}
