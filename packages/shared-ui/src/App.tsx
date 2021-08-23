import * as React from "react";

import type { PluginActions } from "@luke-john/prosemirror-devtools-plugin";
import type { AsyncActions } from "@luke-john/prosemirror-devtools-shared-utils";

import { AppStateProvider, useAppState } from "./AppStateProvider";
import { ActionsProvider } from "./ActionsProvider";

import { RegisteredApp } from "./RegisteredApp";

export function App({
  pluginActions,
}: {
  pluginActions: AsyncActions<PluginActions>;
}) {
  return (
    <ActionsProvider pluginActions={pluginActions}>
      <AppStateProvider pluginActions={pluginActions}>
        <DevtoolsUI />
      </AppStateProvider>
    </ActionsProvider>
  );
}

export function DevtoolsUI() {
  const appState = useAppState();

  if (appState.status === "unregistered") {
    return <>Loading app state</>;
  }

  return <RegisteredApp />;
}
