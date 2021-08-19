import * as React from "react";
import styled from "@emotion/styled";

import { useDocumentContext } from "./DocumentContext";

import { NodeDetails } from "./NodeDetails/NodeDetails";
import { PositionHorizontal } from "./PositionHorizontal";

const DocumentViewerContainer = styled.div`
  font-family: sans-serif;
  /* display: flex; */
  font-size: 0.8rem;

  & > :first-of-type {
    display: block;
    margin-block-end: 0.5rem;
  }
`;

export function StateDocumentViewer() {
  const { document, nodeWidth, selection } = useDocumentContext();

  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current && selection.to) {
      let backpressure = scrollRef.current.clientWidth / 2;
      scrollRef.current.scrollLeft = nodeWidth * selection.head - backpressure;
    }
  }, []);

  const maxPosition = document.nodeSize;
  return (
    <DocumentViewerContainer>
      <strong>Document</strong>
      <div
        style={{
          overflowX: "scroll",
        }}
        ref={scrollRef}
      >
        <div
          style={{
            // minHeight: "170px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <NodeDetails node={document} start={0} />
        </div>
        <div
          style={{
            marginInlineStart: nodeWidth - nodeWidth / 2,
          }}
        >
          <PositionHorizontal maxPosition={maxPosition} />
        </div>
      </div>
    </DocumentViewerContainer>
  );
}
