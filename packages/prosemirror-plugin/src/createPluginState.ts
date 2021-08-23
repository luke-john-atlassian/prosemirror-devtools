import type { EditorState, Transaction } from "prosemirror-state";
import type { EditorView } from "prosemirror-view";

import {
  TrackedPmEditor,
  trackPmEditor,
  untrackPmEditor,
  updatePmEditor,
} from "./local-state";

/**
 * 
      const pluginStatesList = [...__trackedPluginStates];
      const exposedPluginStates = pluginStatesList.map(
        prepareExportedPluginState
      );
      linkedDevtoolsActions.updatePluginStates(exposedPluginStates);
 */

export type PluginState = {
  update: (pluginState: any, transaction: any) => void;
  unregister: () => void;
  register: (editorView: EditorView<any>) => void;
};

export function createPluginState(editorState: EditorState<any>): PluginState {
  const createdDate = Date.now();

  let trackedPmEditor: TrackedPmEditor = {
    editorView: undefined,
    editorState: editorState,
    transactionHistory: [{ editorState, timeStamp: createdDate }],
    created: createdDate,
    updated: createdDate,
  };

  let pluginState: PluginState = {
    update: (editorState: EditorState<any>, tr: Transaction<any>) => {
      trackedPmEditor.editorState = editorState;
      trackedPmEditor.updated = Date.now();

      trackedPmEditor.transactionHistory.unshift({
        editorState,
        tr,
        timeStamp: tr.time,
      });
      updatePmEditor(trackedPmEditor);
    },
    unregister: () => {
      untrackPmEditor(trackedPmEditor);
    },
    register: (_editorView) => {
      trackedPmEditor.editorView = _editorView;
      trackPmEditor(trackedPmEditor);
    },
  };

  updatePmEditor(trackedPmEditor);

  return pluginState;
}
