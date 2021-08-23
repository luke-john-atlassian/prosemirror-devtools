import type { EditorState } from "prosemirror-state";

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

export function getSerializableDocument(
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
