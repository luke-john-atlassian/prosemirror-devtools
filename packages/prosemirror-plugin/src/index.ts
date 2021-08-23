export { exportedPluginActions } from "./actions/exportedPluginActions";

export type { PluginActions } from "./actions/exportedPluginActions";
export type { SerializableDocument } from "./actions/serializationUtils/getSerializableDocument";
export type { SerializableSelection } from "./actions/serializationUtils/getSerializableSelection";
export type { SerializableTransaction } from "./actions/serializationUtils/getSerializableTransaction";
export type { HistoryEntry } from "./actions/getSerializableHistoryEntry";

// Used by the devtools script to decide whether to create a panel
// @ts-expect-error
globalThis.__PROSEMIRROR_DEVTOOLS__ = true;

export { pluginKey, createPlugin } from "./plugin";
