# Chrome Extension Boilerplate with React 17 and Webpack 5

This extension was bootstraped with https://github.com/lxieyang/chrome-extension-boilerplate-react.

## Structure

All the extension's code is under the `src/entries` folder.

## Development

Run `npm install` to install the dependencies.

Run `npm start` to start a development "server" (supports hot reloading the panel content).

Load your extension on Chrome following:

1. Access chrome://extensions/
2. Check Developer mode
3. Click on Load unpacked extension
4. Select the build folder.

## Building

```
$ NODE_ENV=production npm run build
```

Now, the content of `build` folder will be the extension ready to be submitted to the Chrome Web Store. Just take a look at the [official guide](https://developer.chrome.com/webstore/publish) to more infos about publishing.
