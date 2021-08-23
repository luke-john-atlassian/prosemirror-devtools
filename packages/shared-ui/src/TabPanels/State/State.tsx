import * as React from "react";
import { useAsync } from "react-async-hook";

import { useActions } from "../../ActionsProvider";
import { useRegisteredAppState } from "../../AppStateProvider";
import { Structure } from "../../components/Doc/Structure";

export function State() {
  const appState = useRegisteredAppState();
  const actions = useActions();

  const async = useAsync(async () => {
    const outcome = await Promise.all([
      actions.getEditorSchema(appState.selectedEditorId!),
      actions.getFirstHistoryEntry(appState.selectedEditorId!),
    ]);
    return outcome;
  }, [appState.selectedEditorId!]);

  if (async.loading) {
    return null;
  }

  if (async.error) {
    console.error(async.error);
    return <>Something went wrong: {async.error.message}</>;
  }

  const [schema, historyEntry] = async.result!;

  return <Structure schema={schema} doc={historyEntry.doc} />;
}
