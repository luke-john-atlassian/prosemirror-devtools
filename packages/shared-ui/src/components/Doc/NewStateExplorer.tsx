import * as React from "react";
import styled from "@emotion/styled";

import {
  DocumentContextProvider,
  useDocumentContext,
} from "../InProgressStateExplorer/DocumentContext";
import { SelectionInfo } from "../InProgressStateExplorer/SelectionInfo";

import {
  PluginActions,
  SerializableDocument,
  SerializableSelection,
  SerializableTransaction,
} from "@luke-john/prosemirror-devtools-plugin";

export function StateExplorer({
  document,
  selection,
  transaction,
  schema,
}: {
  document: SerializableDocument;
  transaction: SerializableTransaction;
  selection: SerializableSelection;
  schema: ReturnType<PluginActions["getEditorSchema"]>;
}) {
  const nodeWidth = 30;
  const tokenWidth = 20;

  return (
    <DocumentContextProvider
      nodeWidth={nodeWidth}
      tokenWidth={tokenWidth}
      document={document}
      transaction={transaction}
      selection={selection}
    >
      <Structure schema={schema} doc={document} />
      <SelectionInfo />
      <TransactionDetails />
      <StateDocumentViewer />
    </DocumentContextProvider>
  );
}

import { ObjectInspector } from "react-inspector";
import { Structure } from "./Structure";
import { StateDocumentViewer } from "../InProgressStateExplorer/StateDocumentViewer";

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
