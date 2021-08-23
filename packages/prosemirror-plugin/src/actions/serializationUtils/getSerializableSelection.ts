import type { EditorState } from "prosemirror-state";

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

export function getSerializableSelection(
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
