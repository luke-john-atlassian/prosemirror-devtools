import * as React from "react";
import * as ReactDom from "react-dom";

import { App as UiApp } from "@luke-john/prosemirror-devtools-shared-ui";

import { exportedPluginActions } from "@luke-john/prosemirror-devtools-plugin";

const mockPluginActions = Object.entries(exportedPluginActions).reduce(
  (acc, [key, value]) => {
    // @ts-expect-error
    acc[key] = async (...args: any[]) => await Promise.resolve(value(...args));

    return acc;
  },
  {} as any
) as React.ComponentProps<typeof UiApp>["pluginActions"];

function App() {
  return (
    <div className="container">
      <h1>Dev Tools Panel</h1>
      <UiApp pluginActions={mockPluginActions} />
    </div>
  );
}

const target = document.getElementById("react-demo");

ReactDom.render(
  <div
    style={{
      padding: "0 20px",
      marginTop: 20,
    }}
  >
    <App />
  </div>,
  target
);
