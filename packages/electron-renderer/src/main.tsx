import React from "react";
import ReactDOM from "react-dom";
// import "./index.css";
// import App from "./App";
import { App as SharedApp } from "@luke-john/prosemirror-devtools-shared-ui";

import { activePageActions } from "./sync-to-renderer";

ReactDOM.render(
  <React.StrictMode>
    <SharedApp pluginActions={activePageActions} />
  </React.StrictMode>,
  document.getElementById("app-container")
);
