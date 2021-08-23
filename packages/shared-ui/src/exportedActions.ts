import { setupExportedActions as _setupExportedActions } from "@luke-john/prosemirror-devtools-shared-utils";

import { updateTrackedPmEditors } from "./local-state";

const exportedActions = {
  updateTrackedPmEditors: updateTrackedPmEditors,
};

export type SharedUiActions = typeof exportedActions;

export function setupUiExportedActions({
  runtime,
  postMessage,
  registerEventListener,
}: Omit<Parameters<typeof _setupExportedActions>[0], "exportedActions">) {
  _setupExportedActions({
    runtime,
    exportedActions,
    postMessage,
    registerEventListener,
  });
}
