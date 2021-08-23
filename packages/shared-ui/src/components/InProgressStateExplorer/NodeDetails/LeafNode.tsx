import * as React from "react";
import styled from "@emotion/styled";

import { useDocumentContext } from "../DocumentContext";
import { SerializableDocument } from "@luke-john/prosemirror-devtools-plugin";

const LeafNodeContainer = styled.div<{
  nodeWidth: number;
  tokenWidth: number;
}>`
  width: ${({ tokenWidth }) => tokenWidth}px;
  margin-block-start: 2px;

  box-sizing: border-box;
  border-block-start: 1px solid black;
  border-inline-start: 1px solid black;
  border-inline-end: 1px solid black;

  flex: 1 0 auto;

  display: flex;
  flex-direction: column-reverse;
  justify-content: center;
  padding-block: 0.5rem;

  & > span {
    writing-mode: vertical-lr;
    transform: rotate(-180deg);
    font-size: 0.8rem;
    font-family: sans-serif;
    line-height: 1.5;
  }
`;

export function LeafNode({ node }: { node: SerializableDocument }) {
  const { nodeWidth, tokenWidth } = useDocumentContext();

  return (
    <LeafNodeContainer nodeWidth={nodeWidth} tokenWidth={tokenWidth}>
      <span>{node.type.name}</span>
    </LeafNodeContainer>
  );
}
