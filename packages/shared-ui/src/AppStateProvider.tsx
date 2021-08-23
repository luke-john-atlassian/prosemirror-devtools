import * as React from "react";

import type { PluginActions } from "@luke-john/prosemirror-devtools-plugin";
import type { AsyncActions } from "@luke-john/prosemirror-devtools-shared-utils";
import { subscribeToTrackedPmEditors, UiTrackedPmEditor } from "./local-state";

type RegisteredAppState = {
  status: "registered";
  lastSynced: number;
  selectedEditorId?: number;
  trackedPmEditors: UiTrackedPmEditor[];
};

type UnregisteredAppState = {
  status: "unregistered";
  lastSynced?: undefined;
  selectedEditorId?: undefined;
  trackedPmEditors?: undefined;
};

type AppState = RegisteredAppState | UnregisteredAppState;

type Action =
  | { type: "register"; trackedPmEditors: UiTrackedPmEditor[] }
  | { type: "updateTrackedPmEditors"; trackedPmEditors: UiTrackedPmEditor[] }
  | { type: "changeEditor"; editorId: number }
  | { type: "unregister" };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "register":
      return {
        status: "registered",
        lastSynced: Date.now(),
        selectedEditorId: action.trackedPmEditors[0]?.created,
        trackedPmEditors: action.trackedPmEditors,
      };
    case "changeEditor": {
      return {
        status: "registered",
        lastSynced: state.lastSynced!,
        selectedEditorId: action.editorId,
        trackedPmEditors: state.trackedPmEditors!,
      };
    }
    case "updateTrackedPmEditors":
      const selectedEditorIdStillExists = action.trackedPmEditors.some(
        (trackedPmEditor) => trackedPmEditor.created === state.selectedEditorId
      );
      return {
        status: "registered",
        lastSynced: Date.now(),
        // NOTE instead could display editor removed
        selectedEditorId: selectedEditorIdStillExists
          ? state.selectedEditorId
          : action.trackedPmEditors[0]?.created,
        trackedPmEditors: action.trackedPmEditors,
      };
    case "unregister":
      return { status: "unregistered" };
    default:
      return state;
  }
}

export type AppAction = Parameters<typeof reducer>[1];
export type AppDispatch = (action: AppAction) => void;

type AppContextValue = {
  appState: RegisteredAppState | UnregisteredAppState;
  appDispatch: (action: Action) => void;
};

const AppContext = React.createContext<AppContextValue | null>(null);

export function AppStateProvider({
  children,
  pluginActions,
}: {
  children: React.ReactNode;
  pluginActions: AsyncActions<PluginActions>;
}) {
  const [appState, appDispatch] = React.useReducer(reducer, {
    status: "unregistered",
  });

  React.useEffect(() => {
    const controller = new AbortController();
    const unsubscribe = subscribeToTrackedPmEditors((trackedPmEditors) => {
      appDispatch({
        type: "updateTrackedPmEditors",
        trackedPmEditors: trackedPmEditors,
      });
    });

    async function initialisePluginStates() {
      const initialTrackedPmEditors =
        await pluginActions.listTrackedPmEditors();
      if (!controller.signal.aborted) {
        appDispatch({
          type: "register",
          trackedPmEditors: initialTrackedPmEditors,
        });
      }
    }

    initialisePluginStates();

    return () => {
      controller.abort();
      unsubscribe();
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        appState,
        appDispatch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const { appState } = React.useContext(AppContext)!;

  return appState;
}

export function useAppDispatch() {
  const { appDispatch } = React.useContext(AppContext)!;

  return appDispatch;
}

export function useRegisteredAppState() {
  const appContextValue = React.useContext(AppContext);

  return appContextValue!.appState as RegisteredAppState;
}
