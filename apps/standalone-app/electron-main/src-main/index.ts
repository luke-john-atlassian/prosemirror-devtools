try {
  require("electron-reloader")(module, { watchRenderer: false });
} catch {}

const path = require("path");

// require("./update");

import "./proxy";

const { app, BrowserWindow } = require("electron");

const devMode = process.env["NODE_ENV"] === "development";

function createWindow() {
  const broswerWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "./renderer-preload.js"),
    },
  });

  if (devMode) {
    broswerWindow.loadURL("http://localhost:3000/");
  } else {
    broswerWindow.loadFile("./compiled-renderer/index.html");
  }
}

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
