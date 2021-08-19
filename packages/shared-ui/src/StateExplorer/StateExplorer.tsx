import * as React from "react";
import styled from "@emotion/styled";

import { DocumentContextProvider, useDocumentContext } from "./DocumentContext";
import { SelectionInfo } from "./SelectionInfo";
import { StateDocumentViewer } from "./StateDocumentViewer";

import {
  SerializableDocument,
  SerializableSelection,
  SerializableTransaction,
} from "@luke-john/prosemirror-devtools-plugin";

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
