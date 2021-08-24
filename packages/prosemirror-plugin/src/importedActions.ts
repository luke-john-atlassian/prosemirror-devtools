import {
  AsyncActions,
  setupImportedActions,
} from "@luke-john/prosemirror-devtools-shared-utils";
import type { SharedUiActions } from "@luke-john/prosemirror-devtools-shared-ui";

export let linkedDevtoolsActions: AsyncActions<{
  updateTrackedPmEditors: (updatedTrackedPmEditors: any[]) => void;
}>;

export function initializeImportedActions({
  postMessage,
  registerEventListener,
}: Pick<
  Parameters<typeof setupImportedActions>[0],
  "postMessage" | "registerEventListener"
>) {
  const { actions } = setupImportedActions<SharedUiActions>({
    runtime: "page",
    remoteRuntime: "devtools",
    postMessage,
    registerEventListener,
  });

  linkedDevtoolsActions = actions;
}
