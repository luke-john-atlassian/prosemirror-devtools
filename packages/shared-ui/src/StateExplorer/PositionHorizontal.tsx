import * as React from "react";
import styled from "@emotion/styled";
import { useDocumentContext } from "./DocumentContext";

type GridProps = { columns: number; nodeWidth: number };
const Grid = styled.div<GridProps>`
  margin-block-start: 10px;
  display: flex;
  flex-direction: row;
  height: 30px;
  align-items: flex-end;
  width: ${({ columns, nodeWidth }: GridProps) => columns * nodeWidth}px;
`;

type PositionProps = { nodeWidth: number };
const Position = styled.div<PositionProps>`
  width: ${({ nodeWidth }: PositionProps) => nodeWidth}px;
  height: auto;
  text-align: center;
`;

const PositionNumber = styled.div`
  box-sizing: border-box;
  height: 20px;
  width: 20px;
  border: 1px solid #0747a6;
  border-radius: 50%;
  font-size: 0.7rem;

  display: table-cell;
  vertical-align: middle;

  font-weight: bold;

  margin: auto;
`;

export function PositionHorizontal({ maxPosition }: { maxPosition: number }) {
  const positions = Array.from(Array(maxPosition).keys());
  const { nodeWidth } = useDocumentContext();

  return (
    <Grid columns={maxPosition} nodeWidth={nodeWidth}>
      {positions.map((position) => (
        <PositionItem key={position} position={position} />
      ))}
    </Grid>
  );
}

function PositionItem({ position }: { position: number }) {
  const { nodeWidth, selection } = useDocumentContext();

  const isAnchor = selection.anchor === position;
  const isHead = selection.head === position;
  const notARange = selection.anchor === selection.head;
  const isLeftDirection = selection.head < selection.anchor;
  const isInsideSelection = notARange
    ? false
    : !isLeftDirection
    ? selection.anchor < position && position < selection.head
    : selection.head < position && position < selection.anchor;

  return (
    <Position nodeWidth={nodeWidth}>
      <PositionNumber
        style={{
          background: isAnchor
            ? "#0052CC"
            : isHead
            ? "#B3D4FF"
            : isInsideSelection
            ? "#2684FF"
            : undefined,
          color:
            isAnchor || isInsideSelection
              ? "#FFFFFF"
              : isHead
              ? "#172B4D"
              : // no background color
                "#253858",
          borderColor:
            isAnchor || isInsideSelection || isHead
              ? "#0747a6"
              : // no background color
                "#8993A4",
        }}
      >
        {position}
      </PositionNumber>
    </Position>
  );
}
