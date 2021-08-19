import * as React from "react";

import {
  SerializableDocument,
  SerializableSelection,
  SerializableTransaction,
} from "@luke-john/prosemirror-devtools-plugin";

type DocumentContextValue = {
  document: SerializableDocument;
  selection: SerializableSelection;
  transaction: SerializableTransaction;
  nodeWidth: number;
  tokenWidth: number;
  inspectedNodePosition?: number;
};

export const DocumentContext = React.createContext<DocumentContextValue | null>(
  null
);

export function DocumentContextProvider({
  children,
  document,
  selection,
  transaction,
  nodeWidth,
  tokenWidth,
}: {
  children: React.ReactNode;
  document: SerializableDocument;
  transaction: SerializableTransaction;
  selection: SerializableSelection;
  nodeWidth: number;
  tokenWidth: number;
}) {
  return (
    <DocumentContext.Provider
      value={{
        document,
        nodeWidth,
        tokenWidth,
        selection,
        transaction,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
}

export const useDocumentContext = () => {
  const contextValue = React.useContext(DocumentContext);

  return contextValue!;
};
