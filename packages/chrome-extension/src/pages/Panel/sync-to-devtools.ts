import { getMessageUtils } from '@luke-john/prosemirror-devtools-shared-utils';

const subscriptions: [id: number, cb: (data: any) => void][] = [];
const { createMessage } = getMessageUtils('devtools');

import type { Handlers } from '@luke-john/prosemirror-devtools-plugin';

type AsyncHandlers<Handlers extends { [key: string]: () => any }> = {
  [Key in keyof Handlers]: (
    ...args: Parameters<Handlers[Key]>
  ) => Promise<ReturnType<Handlers[Key]>>;
};

const actionsTarget = {} as AsyncHandlers<Handlers>;

const proxiedFakeActions = new Proxy(actionsTarget, {
  get: function (target, property: string) {
    if (property in target) {
      // @ts-ignore
      return target[property];
    }

    async function process(...args: any[]) {
      try {
        const message = createMessage({
          target: 'page',
          targetTabId: chrome.devtools.inspectedWindow.tabId,
          type: property,
          args: [],
        });

        const response = new Promise<void>((res) => {
          subscriptions.push([
            message.id,
            (data) => {
              res(data);
            },
          ]);
        });
        chrome.runtime.sendMessage(message);

        await response;

        return response;
      } catch (err) {
        throw err;
      }
    }

    return process;
  },
});

const backgroundPageConnection = chrome.runtime.connect({
  name: 'devtools-page',
});

backgroundPageConnection.onMessage.addListener(function (message, sender) {
  /** only handle messages we expect */
  if (!message.type) {
    return;
  }
  try {
    switch (message.target) {
      case 'devtools': {
        if (['success', 'failure'].includes(message.type)) {
          const subscriptionIndex = subscriptions.findIndex((subscription) => {
            return subscription[0] === message.id;
          });
          const [[, cb]] = subscriptions.splice(subscriptionIndex, 1);
          cb(message.response);
        } else {
          sender.postMessage({
            source: message.target,
            target: message.source,
            type: 'success',
            targetTabId: message.targetTabId,
            id: message.id,
          });
        }
        break;
      }
      default:
        // Discard unknown events
        break;
    }
  } catch (err) {
    sender.postMessage({
      source: 'devtools',
      target: message.source,
      targetTabId: message.targetTabId,
      type: 'failure',
      id: message.id,
      err,
    });
  }
});

export { proxiedFakeActions };
