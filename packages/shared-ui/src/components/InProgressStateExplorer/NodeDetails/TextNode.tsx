import * as React from "react";
import styled from "@emotion/styled";

import { SerializableDocument } from "@luke-john/prosemirror-devtools-plugin";

import { useDocumentContext } from "../DocumentContext";

type TextNodeContainerProps = {
  textWidth: number;
  hasMarks: boolean;
};
const TextNodeContainer = styled.div<TextNodeContainerProps>`
  box-sizing: border-box;
  margin-block-start: 2px;

  width: ${({ textWidth }: TextNodeContainerProps) => textWidth}px;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  ${({ hasMarks }: TextNodeContainerProps) =>
    hasMarks ? "margin-bottom: -18px" : null};

  :hover {
    background: #e6fcff;
    box-sizing: content-box;
  }
`;

type TextCharactersContainerProps = {
  nodeSize: number;
  nodeWidth: number;
  tokenWidth: number;
};
const TextCharactersContainer = styled.div<TextCharactersContainerProps>`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  width: ${({
    nodeSize,
    nodeWidth,
    tokenWidth,
  }: TextCharactersContainerProps) =>
    (nodeSize - 1) * nodeWidth + tokenWidth}px;
`;

type TextCharacterProps = {
  tokenWidth: number;
};
const TextCharacter = styled.div<TextCharacterProps>`
  width: ${({ tokenWidth }: TextCharacterProps) => tokenWidth}px;
  min-width: ${({ tokenWidth }: TextCharacterProps) => tokenWidth}px;
  max-width: ${({ tokenWidth }: TextCharacterProps) => tokenWidth}px;
  text-align: center;
`;

export function TextNode({ node }: { node: SerializableDocument }) {
  const { nodeWidth, tokenWidth } = useDocumentContext();

  const textCharacters: string[] = node.text?.split("") || [];

  const textWidth = (node.nodeSize - 1) * nodeWidth + tokenWidth;

  return (
    <TextNodeContainer
      textWidth={textWidth}
      hasMarks={!!node.marks && !!node.marks.length}
    >
      <TextCharactersContainer
        nodeSize={node.nodeSize}
        nodeWidth={nodeWidth}
        tokenWidth={tokenWidth}
      >
        {textCharacters.map((textCharacter, index) => (
          <React.Fragment key={index}>
            <TextCharacter tokenWidth={tokenWidth}>
              {textCharacter}
            </TextCharacter>
            <EmptyTokenSpace />
          </React.Fragment>
        ))}
      </TextCharactersContainer>
      <Marks marks={node.marks} textWidth={textWidth} />
    </TextNodeContainer>
  );
}

const InlineDialog = styled.div`
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  box-sizing: content-box; /* do not set this to border-box or it will break the overflow handling */
  color: #333;
  padding: 3px 8px;
  font-size: 0.8rem;
  font-family: sans-serif;
`;

const MarksContainer = styled.div<{ textWidth: number }>`
  width: ${({ textWidth }) => textWidth}px;
  /* TODO: currently these are manually tweaked */

  & button {
    color: inherit;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    outline: inherit;
    background: none;

    min-height: 5px;
    margin: 0;
    width: 100%;
  }
`;

const MarkLine = styled.div`
  height: 1px;
  margin-block-end: 1px;
  background: #403294;
  width: 100%;
`;

function Marks({
  marks,
  textWidth,
}: {
  textWidth: number;
  marks: SerializableDocument["marks"];
}) {
  const ref = React.useRef(null);
  const hovering = useHovering(ref);

  if (!marks) {
    return null;
  }

  return (
    <MarksContainer textWidth={textWidth}>
      <button aria-label="show marks" ref={ref}>
        {marks.map((mark, index) => (
          <MarkLine key={index} />
        ))}
      </button>
      {hovering && (
        <InlineDialog
          style={{
            position: "absolute",
          }}
        >
          Marks: {marks.map((mark) => mark.type.name).join(", ")}
        </InlineDialog>
      )}
    </MarksContainer>
  );
}

function EmptyTokenSpace() {
  const { nodeWidth, tokenWidth } = useDocumentContext();

  const width = nodeWidth - tokenWidth;

  return <div style={{ width: width, minWidth: width, maxWidth: width }}></div>;
}

function useHovering(ref: any) {
  const [value, setValue] = React.useState(false);

  const handleMouseOver = () => setValue(true);
  const handleMouseOut = () => setValue(false);

  React.useEffect(
    () => {
      const node = ref.current;
      if (node) {
        node.addEventListener("mouseover", handleMouseOver);
        node.addEventListener("mouseout", handleMouseOut);
        return () => {
          node.removeEventListener("mouseover", handleMouseOver);
          node.removeEventListener("mouseout", handleMouseOut);
        };
      }
      return;
    },
    [ref.current] // Recall only if ref changes
  );
  return [ref, value];
}
