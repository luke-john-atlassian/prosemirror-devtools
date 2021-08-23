import React from "react";
import { useAsync } from "react-async-hook";

import { useActions } from "../../ActionsProvider";
import { useRegisteredAppState } from "../../AppStateProvider";
import { StateExplorer } from "../../components/Doc/NewStateExplorer";
import { Structure } from "../../components/Doc/Structure";
import { SplitView, SplitViewCol } from "../../components/SplitView"; // import { AsyncStateExplorer } from "../../components/InProgressStateExplorer/StateExplorer";

import { Timeline } from "./Timeline";

export function History() {
  const actions = useActions();
  const { trackedPmEditors, selectedEditorId } = useRegisteredAppState();
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const selectedEditor = trackedPmEditors.find((trackedPmEditor) => {
    return trackedPmEditor.created === selectedEditorId;
  })!;

  const async = useAsync(
    () => actions.getTrackedPmEditorHistoryEntries(selectedEditor.created),
    [selectedEditorId, selectedEditor.updated]
  );

  if (async.loading || async.currentParams?.[0] !== selectedEditorId) {
    return null;
  }

  const historyEntries = async.result!;

  const selectedHistory = historyEntries[selectedIndex];

  console.log({ selectedHistory });

  return (
    <SplitView>
      <SplitViewCol noPaddings minWidth={190}>
        <Timeline
          entries={historyEntries}
          selectedIndex={selectedIndex}
          updateSelectedIndex={(selectedIndex) =>
            setSelectedIndex(selectedIndex)
          }
        />
      </SplitViewCol>
      <SplitViewCol grow sep>
        {selectedHistory ? (
          <AsyncHistoryStructure selectedHistory={selectedHistory} />
        ) : // <AsyncStateExplorer
        //   editorId={selectedEditor.created}
        //   id={selectedHistory}
        // />
        null}
      </SplitViewCol>
    </SplitView>
  );
}

function AsyncHistoryStructure({
  selectedHistory,
}: {
  selectedHistory: number;
}) {
  const appState = useRegisteredAppState();
  const actions = useActions();

  const async = useAsync(async () => {
    const outcome = await Promise.all([
      actions.getEditorSchema(appState.selectedEditorId!),
      actions.getHistoryEntry(appState.selectedEditorId!, selectedHistory),
    ]);
    return outcome;
  }, [appState.selectedEditorId!, selectedHistory]);

  if (async.loading) {
    return null;
  }

  if (async.error) {
    console.error(async.error);
    return <>Something went wrong: {async.error.message}</>;
  }

  const [schema, historyEntry] = async.result!;
  return (
    <StateExplorer
      schema={schema}
      document={historyEntry.doc}
      selection={historyEntry.selection}
      transaction={historyEntry.transaction!}
    />
  );
}
