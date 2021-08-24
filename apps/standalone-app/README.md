# Working on the client desktop

The desktop client is an electron app, and it's frontend is a vite powered react-ts app.

It uses electon-builder for releases.

## Working on the backend (main)

To start the development app run `npm run start` inside /electron-main.

To work on the electron "main", run `npm run watch-main` inside /electron-main. The src files for the main live under /client-desktop/src-main.

## Working on the frontend (renderer)

To work on the electron "renderer", run `npm run start` inside /client-desktop-renderer. The src files for the renderer live under /client-desktop-renderer/src.

The frontend requires the development backend (main) to also be running.
