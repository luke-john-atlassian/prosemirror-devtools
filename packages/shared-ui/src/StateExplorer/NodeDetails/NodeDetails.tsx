import * as React from "react";
import styled from "@emotion/styled";

import { useDocumentContext } from "../DocumentContext";

import { TextNode } from "./TextNode";
import { LeafNode } from "./LeafNode";
import { BlockNode } from "./BlockNode";
import { SerializableDocument } from "@luke-john/prosemirror-devtools-plugin";

const NodeContainer = styled.div<{
  nodeSize: number;
  nodeWidth: number;
  tokenWidth: number;
}>`
  border-block-start: 1px solid black;
  border-inline-start: 1px solid black;
  border-inline-end: 1px solid black;

  box-sizing: border-box;
  margin-block-start: 2px;

  width: ${({ nodeSize, nodeWidth, tokenWidth }) =>
    nodeSize * nodeWidth - (nodeWidth - tokenWidth)}px;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;

  & > span {
    width: ${({ nodeSize, nodeWidth, tokenWidth }) =>
      nodeSize * nodeWidth - (nodeWidth - tokenWidth)}px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;

    padding-inline: 0.5rem;
    box-sizing: border-box;
    text-align: center;
    border-block-end: 1px solid black;
    font-size: 0.8rem;
    font-family: sans-serif;
    line-height: 1.5;
  }
`;

export function NodeDetails({
  node,
  start,
}: {
  node: SerializableDocument;
  start: number;
}) {
  const { nodeWidth, tokenWidth } = useDocumentContext();

  if (node.isText) {
    return <TextNode node={node} />;
  }

  if (node.isLeaf) {
    return <LeafNode node={node} />;
  }

  return (
    <NodeContainer
      nodeSize={node.nodeSize}
      nodeWidth={nodeWidth}
      tokenWidth={tokenWidth}
    >
      <span>{node.type.name}</span>
      <BlockNode node={node} start={start} />
    </NodeContainer>
  );
}
