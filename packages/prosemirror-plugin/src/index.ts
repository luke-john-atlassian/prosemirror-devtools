import type { EditorView } from "prosemirror-view";
import { Plugin, PluginKey, EditorState, Transaction } from "prosemirror-state";

import {
  getHistoryEntry,
  HistoryEntry,
  SerializableDocument,
  SerializableSelection,
  SerializableTransaction,
} from "./getHistoryEntry";
import {
  trackedPluginStates,
  Handlers,
  ExposedPluginState,
} from "./devtools-comms";

export {
  trackedPluginStates,
  Handlers,
  ExposedPluginState,
  SerializableDocument,
  SerializableSelection,
  SerializableTransaction,
};

export type DevtoolsPluginState = {
  created: number;
  updated: number;
  editorView?: EditorView<any>;
  editorState: EditorState<any>;
  history: HistoryEntry[];
  update: (pluginState: any, transaction: any) => void;
  unregister: () => void;
};
function createPluginState(editorState: EditorState<any>): DevtoolsPluginState {
  const createdDate = Date.now();
  let devToolsPluginState: DevtoolsPluginState = {
    editorView: undefined,
    editorState: editorState,
    history: [getHistoryEntry(editorState)],
    created: createdDate,
    updated: createdDate,
    update: (editorState: EditorState<any>, tr: Transaction<any>) => {
      devToolsPluginState.editorState = editorState;
      devToolsPluginState.updated = Date.now();
      devToolsPluginState.history.push(getHistoryEntry(editorState, tr));
    },
    unregister: () => {
      trackedPluginStates.delete(devToolsPluginState);
    },
  };

  trackedPluginStates.add(devToolsPluginState);

  return devToolsPluginState;
}

const pluginKey = new PluginKey("devtools-plugin");
export const prosemirrorDevtoolsPlugin = new Plugin({
  key: pluginKey,
  view: (editorView) => {
    const state: DevtoolsPluginState = pluginKey.getState(editorView.state);

    state.editorView = editorView;

    return {
      update: (view, prevState) => {},
      destroy: () => {
        state.unregister();
      },
    };
  },
  state: {
    init(config, pluginState) {
      return createPluginState(pluginState);
    },
    apply(tr, value, oldState, newState) {
      value.update(newState, tr);
      return value;
    },
  },
});
