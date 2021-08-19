function backgroundListener(
  message: any,
  sender: chrome.runtime.MessageSender
) {
  // discard events we don't expect
  if (!message || !message.target || !message.source) {
    return;
  }

  try {
    switch (message.target) {
      case 'page': {
        window.postMessage(message, '*');
        break;
      }
      default: {
        // Discard unknown events
        break;
      }
    }
  } catch (err) {
    const failure = {
      type: 'failure',
      source: 'content_script',
      target: message.source,
      id: message.id,
      err,
    };

    chrome.runtime.sendMessage(failure);
  }
}

chrome.runtime.onMessage.addListener(backgroundListener);

window.addEventListener(
  'message',
  (event) => {
    // We only accept messages from ourselves
    if (event.source !== window) return;

    // discard events we don't expect
    if (!event.data.type || !event.data.target || !event.data.source) {
      return;
    }

    if (event.data.source !== 'page') {
      return;
    }

    const message = event.data;
    try {
      switch (message.target) {
        case 'content_script': {
          if (!['success', 'failure'].includes(message.type)) {
            chrome.runtime.sendMessage({
              type: 'success',
              source: message.target,
              target: message.source,
              id: message.id,
            });
          }
          break;
        }
        case 'page': {
          window.postMessage(message, '*');
          break;
        }
        case 'background':
        case 'devtools': {
          chrome.runtime.sendMessage(message);
          break;
        }
        default: {
          // Discard unknown events
          break;
        }
      }
    } catch (err) {
      const failure = {
        type: 'failure',
        source: 'content_script',
        target: event.data.source,
        id: event.data.id,
        err,
      };
      if (message.target === 'background' || message.target === 'devtools') {
        chrome.runtime.sendMessage(failure);
      } else {
        window.postMessage(failure, '*');
      }
    }
  },
  false
);
