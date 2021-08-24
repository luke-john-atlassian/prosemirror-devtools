import { Plugin, PluginKey } from "prosemirror-state";

import { createPluginState, PluginState } from "./createPluginState";
import { notifyTrackedPmEditors } from "./local-state";

export const pluginKey = new PluginKey("devtools-plugin");

export const devtoolsPlugin = new Plugin({
  key: pluginKey,
  view: (editorView) => {
    const state: PluginState = pluginKey.getState(editorView.state);
    state.register(editorView);

    notifyTrackedPmEditors();

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
  appendTransaction(transactions, oldState, newState) {},
});
