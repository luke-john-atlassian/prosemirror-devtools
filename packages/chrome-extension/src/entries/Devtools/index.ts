// Logic based on
// https://github.com/facebook/react/blob/f4161c3ec7d2ab2993695a458f771bb331e256d5/packages/react-devtools-extensions/src/main.js

let panelCreated = false;

function createPanelIfProsemirrorLoaded() {
  if (panelCreated) {
    return;
  }

  chrome.devtools.inspectedWindow.eval(
    'globalThis.__PROSEMIRROR_DEVTOOLS__',
    function (pageHasProsemirror, error) {
      if (!pageHasProsemirror || panelCreated) {
        return;
      }

      clearInterval(loadCheckInterval);

      panelCreated = true;

      chrome.devtools.panels.create('🦉 ProseMirror', '', 'panel.html');
    }
  );
}

// Check to see if React has loaded once per second in case React is added
// after page load
createPanelIfProsemirrorLoaded();
const loadCheckInterval = setInterval(function () {
  createPanelIfProsemirrorLoaded();
}, 1000);

export {};
