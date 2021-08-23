import * as React from "react";
import styled from "@emotion/styled";

import { useDocumentContext } from "../DocumentContext";
import { NodeDetails } from "./NodeDetails";

import { SerializableDocument } from "@luke-john/prosemirror-devtools-plugin";

function EmptyTokenSpace() {
  const { nodeWidth, tokenWidth } = useDocumentContext();

  return <div style={{ width: nodeWidth - tokenWidth }}></div>;
}

const BlockNodeContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  box-sizing: border-box;
  align-items: stretch;
  flex: 1;
`;

const TokenContainer = styled.div`
  text-align: center;
  flex: 1 0 auto;
  box-sizing: border-box;
  display: flex;
  flex-direction: column-reverse;
  justify-content: center;
  padding-block: 0.5rem;

  & > span {
    writing-mode: vertical-lr;
    transform: rotate(-180deg);
    font-size: 0.8rem;
    font-family: sans-serif;
    line-height: 1.7;
  }
`;
const TokenContainerStart = styled(TokenContainer)`
  border-inline-end: 1px solid black;
`;
const TokenContainerEnd = styled(TokenContainer)`
  border-inline-start: 1px solid black;
`;

export function BlockNode({
  node,
  start,
}: {
  node: SerializableDocument;
  start: number;
}) {
  const { tokenWidth } = useDocumentContext();

  return (
    <BlockNodeContainer>
      <TokenContainerStart style={{ width: tokenWidth }}>
        <span>start</span>
      </TokenContainerStart>
      <div style={{ width: "100%", display: "flex" }}>
        <EmptyTokenSpace />
        {node.content
          ? node.content.map((subNode) => {
              return (
                <React.Fragment key={subNode.parentOffset}>
                  <NodeDetails
                    node={subNode}
                    start={start + node.parentOffset + 1}
                  />

                  <EmptyTokenSpace />
                </React.Fragment>
              );
            })
          : node.text}
      </div>
      <TokenContainerEnd style={{ width: tokenWidth }}>
        <span>end</span>
      </TokenContainerEnd>
    </BlockNodeContainer>
  );
}
