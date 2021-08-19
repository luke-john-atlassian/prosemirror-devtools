import { DevtoolsPluginState } from "./index";

export let trackedPluginStates = new Set<DevtoolsPluginState>();

// @ts-expect-error
globalThis.trackedPluginStates = trackedPluginStates;
// @ts-expect-error
globalThis.__PROSEMIRROR_DEVTOOLS__ = true;

export type ExposedPluginState = {
  containerElementIndex: number;
  created: number;
  updated: number;
  leadingTextContent: string;
  history: HistoryEntry[];
};

const handlers = {
  listPluginState(): ExposedPluginState[] {
    return [...trackedPluginStates].map((trackedPluginState) => ({
      containerElementIndex: [...document.getElementsByTagName("*")].indexOf(
        trackedPluginState.editorView!.dom
      ),
      leadingTextContent: trackedPluginState.editorState.doc.textContent.slice(
        0,
        100
      ),
      created: trackedPluginState.created,
      updated: trackedPluginState.updated,
      history: trackedPluginState.history,
    }));
  },
};
export type Handlers = typeof handlers;

import { getMessageUtils } from "@luke-john/prosemirror-devtools-shared-utils";
import { HistoryEntry } from "./getHistoryEntry";

const { createResponseMessage, shouldHandleResponse } = getMessageUtils("page");

window.addEventListener("message", (event) => {
  if (event.data.target !== "page") {
    return;
  }

  if (!shouldHandleResponse(event.data)) {
    return;
  }

  if (event.data.type in handlers) {
    try {
      // @ts-expect-error
      const response = handlers[event.data.type](...event.data.args);

      const responseMessage = createResponseMessage({
        orignalMessage: event.data,
        response: response,
        status: "success",
      });

      window.postMessage(responseMessage, "*");
    } catch (err) {
      console.error(err);
      const responseMessage = createResponseMessage({
        orignalMessage: event.data,
        response: err,
        status: "failure",
      });

      window.postMessage(responseMessage, "*");
    }
  }
});
