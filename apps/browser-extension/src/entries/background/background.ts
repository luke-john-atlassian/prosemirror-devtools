chrome.runtime.onInstalled.addListener(() => {});
chrome.runtime.onSuspend.addListener(() => {});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  try {
    switch (message.target) {
      /** handle messages from content_scripts */
      case 'devtools': {
        if (!message.pageTabId) {
          message.pageTabId = sender.tab!.id!;
        }
        respond(message);
        break;
      }
      /** handle messages from devtools */
      case 'page':
      case 'content_script': {
        respond(message);
        break;
      }
      default: {
        // Discard unknown events
        break;
      }
    }
  } catch (err) {
    respond({
      ljpmdt: true,
      type: 'failure',
      source: 'background',
      target: message.source,
      id: message.id,
      err,
    });
  }
});

function respond(message: any) {
  if (message.target === 'devtools') {
    safeRespondToDevtools(message);
  } else {
    chrome.tabs.sendMessage(message.pageTabId, message);
  }
}

function safeRespondToDevtools(message: any, count = 0) {
  if (!devToolsPort) {
    setTimeout(safeRespondToDevtools, 100, message, count + 1);
  } else {
    devToolsPort.postMessage(message);
  }
}

let devToolsPort: chrome.runtime.Port;

chrome.runtime.onConnect.addListener(function (port) {
  devToolsPort = port;
});
