import { PluginActions } from '@luke-john/prosemirror-devtools-plugin';
import { setupImportedActions } from '@luke-john/prosemirror-devtools-shared-utils';
import { setupUiExportedActions } from '@luke-john/prosemirror-devtools-shared-ui';

const backgroundPageConnection = chrome.runtime.connect({
  name: 'devtools-page',
});

const { actions: activePageActions } = setupImportedActions<PluginActions>({
  runtime: 'devtools',
  remoteRuntime: 'page',
  postMessage: (message) => {
    chrome.runtime.sendMessage({
      ...message,
      // this is used by the background worker which proxies
      // these events to the relevant windows content script
      pageTabId: chrome.devtools.inspectedWindow.tabId,
    });
  },
  registerEventListener: (messageHandler) => {
    backgroundPageConnection.onMessage.addListener((message) => {
      // discard page events which aren't from this devtools inspected window tab
      if (
        message.pageTabId !== undefined &&
        message.pageTabId !== chrome.devtools.inspectedWindow.tabId
      ) {
        return;
      }

      messageHandler(message);
    });
  },
});

export { activePageActions };

setupUiExportedActions({
  runtime: 'devtools',
  postMessage: (message) => {
    chrome.runtime.sendMessage({
      ...message,
      // this is used by the background worker which proxies
      // these events to the relevant windows content script
      pageTabId: chrome.devtools.inspectedWindow.tabId,
    });
  },
  registerEventListener: (messageHandler) => {
    backgroundPageConnection.onMessage.addListener((message) => {
      // discard page events which aren't from this devtools inspected window tab
      if (
        message.pageTabId !== undefined &&
        message.pageTabId !== chrome.devtools.inspectedWindow.tabId
      ) {
        return;
      }

      messageHandler(message);
    });
  },
});
