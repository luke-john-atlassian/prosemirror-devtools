import { Schema } from "prosemirror-model";

function getSafeMark(mark: Schema<any>["marks"][string]) {
  return {
    name: mark.name,
    // @ts-ignore
    rank: mark.rank,
    // @ts-ignore
    excludes: mark.excluded.map((excludedMark) => ({
      name: excludedMark.name,
    })),
  };
}

function getSafeNode(node: Schema<any>["nodes"][string]) {
  return {
    name: node.name,
    // spec: node.spec,
    isBlock: node.isBlock,
    isText: node.isText,
    isAtom: node.isAtom,
    inlineContent: node.inlineContent,
  };
}

export function getSerializableSchema(schema: Schema<any>) {
  return {
    nodes: Object.entries(schema.nodes).reduce<{
      [key: string]: ReturnType<typeof getSafeNode>;
    }>((acc, [nodeName, nodeValue]) => {
      acc[nodeName] = getSafeNode(nodeValue);
      return acc;
    }, {}),
    marks: Object.entries(schema.marks).reduce<{
      [key: string]: ReturnType<typeof getSafeMark>;
    }>((acc, [markName, markValue]) => {
      acc[markName] = getSafeMark(markValue);
      return acc;
    }, {}),
  };
}
