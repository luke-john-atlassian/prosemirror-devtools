import * as React from "react";
import type { AsyncActions } from "@luke-john/prosemirror-devtools-shared-utils";
import type { PluginActions } from "@luke-john/prosemirror-devtools-plugin";

const ActionsContext = React.createContext<AsyncActions<PluginActions> | null>(
  null
);

export function ActionsProvider({
  pluginActions,
  children,
}: {
  pluginActions: AsyncActions<PluginActions>;
  children: React.ReactNode;
}) {
  return (
    <ActionsContext.Provider value={pluginActions}>
      {children}
    </ActionsContext.Provider>
  );
}

export function useActions() {
  const actions = React.useContext(ActionsContext)!;

  return actions;
}
