import { Plugin, PluginKey } from "prosemirror-state";
import { initializeExportedActions } from "./actions/exportedPluginActions";

import { createPluginState, PluginState } from "./createPluginState";
import { initializeImportedActions } from "./importedActions";

import "./local-state";

export const pluginKey = new PluginKey("devtools-plugin");

export function createPlugin(runtime: "page" | "node") {
  initializeExportedActions(runtime);
  initializeImportedActions(runtime);

  const plugin = new Plugin({
    key: pluginKey,
    view: (editorView) => {
      const state: PluginState = pluginKey.getState(editorView.state);
      state.register(editorView);

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

  return plugin;
}
