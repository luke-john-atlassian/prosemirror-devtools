import type { EditorState, Transaction } from "prosemirror-state";

export type SerializableSelectionPosition = {
  depth: number;
  node: { name: string };
  "start()": number;
  "end()": number;
  "before()": number;
  "after()": number;
};
export type SerializableSelection = {
  head: number;
  $head: SerializableSelectionPosition;
  anchor: number;
  $anchor: SerializableSelectionPosition;
  from: number;
  $from: SerializableSelectionPosition;
  to: number;
  $to: SerializableSelectionPosition;
};

function getSerializableSelection(
  selection: EditorState<any>["selection"]
): SerializableSelection {
  const getPropsForPositionSide = (positionSide: typeof selection.$head) => ({
    depth: positionSide.depth,

    node: { name: positionSide.node().type.name },
    "start()": positionSide.start(),
    "end()": positionSide.end(),
    "before()": positionSide.before(),
    "after()": positionSide.after(),
  });
  return {
    head: selection.head,
    $head: getPropsForPositionSide(selection.$head),
    anchor: selection.anchor,
    $anchor: getPropsForPositionSide(selection.$anchor),
    from: selection.from,
    $from: getPropsForPositionSide(selection.$from),
    to: selection.to,
    $to: getPropsForPositionSide(selection.$to),
  };
}

export type SerializableDocument = {
  parentOffset: number;
  type: { name: string };
  nodeSize: number;
  isBlock: boolean;
  isInline: boolean;
  isLeaf: boolean;
  isText: boolean;
  content?: SerializableDocument[];
  text?: string;
  marks?: { type: { name: string }; attrs: { [key: string]: any } }[];
};

function getSerializableDocument(
  doc: EditorState<any>["doc"],
  parentOffset = 0
) {
  const serializableDocument: SerializableDocument = {
    parentOffset,
    type: {
      name: doc.type.name,
    },
    nodeSize: doc.nodeSize,
    isBlock: doc.isBlock,
    isInline: doc.isInline,
    isLeaf: doc.isLeaf,
    isText: doc.isText,
    content: doc.isInline ? undefined : [],
    text: doc.text || undefined,
    marks:
      doc.marks && doc.marks.length
        ? doc.marks.map((mark) => ({
            type: { name: mark.type.name },
            attrs: mark.attrs,
          }))
        : undefined,
  };

  if (!doc.isInline) {
    doc.content.forEach((item, offset) => {
      serializableDocument.content?.push(getSerializableDocument(item, offset));
    });
  }

  return serializableDocument;
}

export type SerializableTransaction = Transaction<any>;

export type HistoryEntry = {
  doc: SerializableDocument;
  selection: SerializableSelection;
  transaction?: Transaction<any>;
};

export function getHistoryEntry(
  editorState: EditorState<any>,
  tr?: Transaction
): HistoryEntry {
  const trString = safeStringify(tr);
  const transaction = trString ? JSON.parse(trString) : undefined;

  return {
    doc: getSerializableDocument(editorState.doc),
    selection: getSerializableSelection(editorState.selection),
    transaction,
  };
}

function safeStringify(obj: any, indent = 2) {
  let cache: any[] = [];

  const retVal = JSON.stringify(
    obj,
    (key, value) =>
      typeof value === "object" && value !== null
        ? cache.includes(value)
          ? undefined // Duplicate reference found, discard key
          : cache.push(value) && value // Store value in our collection
        : value,
    indent
  );

  return retVal;
}
