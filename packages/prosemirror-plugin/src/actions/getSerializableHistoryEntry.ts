import type { EditorState, Transaction } from "prosemirror-state";

import {
  getSerializableDocument,
  SerializableDocument,
} from "./serializationUtils/getSerializableDocument";
import {
  getSerializableSelection,
  SerializableSelection,
} from "./serializationUtils/getSerializableSelection";
import {
  getSerializableTransaction,
  SerializableTransaction,
} from "./serializationUtils/getSerializableTransaction";

export type HistoryEntry = {
  doc: SerializableDocument;
  selection: SerializableSelection;
  transaction?: SerializableTransaction;
};

export function getSerializableHistoryEntry(
  editorState: EditorState<any>,
  tr?: Transaction
): HistoryEntry {
  const transaction = tr ? getSerializableTransaction(tr) : undefined;

  return {
    doc: getSerializableDocument(editorState.doc),
    selection: getSerializableSelection(editorState.selection),
    transaction,
  };
}
