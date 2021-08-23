import * as React from "react";
import styled from "@emotion/styled";
import { useAsync } from "react-async-hook";

import { DocumentContextProvider, useDocumentContext } from "./DocumentContext";
import { SelectionInfo } from "./SelectionInfo";
import { StateDocumentViewer } from "./StateDocumentViewer";

import {
  SerializableDocument,
  SerializableSelection,
  SerializableTransaction,
} from "@luke-john/prosemirror-devtools-plugin";

export function AsyncStateExplorer({
  editorId,
  id,
}: {
  editorId: number;
  id: number;
}) {
  const actions = useActions();
  const async = useAsync(actions.getHistoryEntry, [editorId, id]);

  if (async.loading) {
    return null;
    // return <>"Loading..."</>;
  }
  if (async.error) {
    return <>`Something went wrong: ${async.error.message}`</>;
  }

  const historyEntry = async.result!;

  return (
    <StateExplorer
      key={historyEntry.transaction?.time || "init"}
      document={historyEntry.doc}
      selection={historyEntry.selection}
      transaction={historyEntry.transaction!}
    />
  );
}

const StateExplorerContainer = styled.div`
  border: 1px solid black;
  padding: 1rem;
  margin-block-end: 1rem;

  & > :not(:first-of-type) {
    margin-top: 1rem;
  }
`;

export function StateExplorer({
  document,
  selection,
  transaction,
}: {
  document: SerializableDocument;
  transaction: SerializableTransaction;
  selection: SerializableSelection;
}) {
  const nodeWidth = 30;
  const tokenWidth = 20;

  return (
    <StateExplorerContainer>
      <DocumentContextProvider
        nodeWidth={nodeWidth}
        tokenWidth={tokenWidth}
        document={document}
        transaction={transaction}
        selection={selection}
      >
        <StateDocumentViewer />
        <SelectionInfo />
        <TransactionDetails />
      </DocumentContextProvider>
    </StateExplorerContainer>
  );
}

import { ObjectInspector } from "react-inspector";
import { useActions } from "../../ActionsProvider";

const TransactionContainer = styled.div`
  font-family: sans-serif;
  /* display: flex; */
  font-size: 0.8rem;

  & > :first-of-type {
    display: block;
    margin-block-end: 0.5rem;
  }
`;

function TransactionDetails() {
  const { transaction } = useDocumentContext();

  return (
    <TransactionContainer>
      <strong>Transaction</strong> <ObjectInspector data={transaction} />
    </TransactionContainer>
  );
}
