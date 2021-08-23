import * as React from "react";
import styled from "@emotion/styled";
import { SerializableDocument } from "@luke-john/prosemirror-devtools-plugin";

import { mainTheme as theme } from "./theme";
import { buildColors, NodeColors } from "./buildColors";

export function Structure({
  schema,
  doc,
}: {
  schema: any;
  doc: SerializableDocument;
}) {
  const nodeColors = buildColors(schema);

  return (
    <GraphWrapper>
      <BlockNode
        colors={nodeColors}
        node={doc}
        startPos={0}
        onNodeSelected={(nodeId: number) => {}}
      />
    </GraphWrapper>
  );
}

const GraphWrapper = styled("div")({
  marginTop: "12px",
});

const BlockNodeWrapper = styled("div")({});

const BlockNodeContentView = styled("div")({
  padding: "0 12px",
  boxSizing: "border-box",
  borderLeft: `1px solid ${theme.white20}`,
  borderRight: `1px solid ${theme.white20}`,
});

const BlockNodeContentViewWithInline = styled("div")({
  padding: "0 12px",
  display: "flex",
  width: "100%",
  boxSizing: "border-box",
  borderLeft: `1px solid ${theme.white20}`,
  borderRight: `1px solid ${theme.white20}`,
  flexWrap: "wrap",
});

const BlockNodeView = styled.div<{ bg?: string }>(
  {
    width: "100%",
    marginBottom: "3px",
    boxSizing: "border-box",
    display: "flex",

    "&:hover": {
      cursor: "pointer",
    },
  },
  ({ bg }) => ({
    background: bg,
  })
);

const Side = styled("div")({
  padding: "3px 6px",
  background: "rgba(255, 255, 255, 0.3)",
});

const Center = styled("div")({
  flexGrow: 1,
  padding: "3px 9px",
  whiteSpace: "pre",
});

const InlineNodeView = styled.div<{ bg?: string }>(
  {
    flexGrow: 1,
    marginBottom: "3px",
    display: "flex",
    boxSizing: "border-box",

    "&:hover": {
      cursor: "pointer",
    },
  },
  ({ bg }) => ({
    background: bg,
  })
);

function BlockNodeContent(props: {
  content?: SerializableDocument;
  colors: NodeColors;
  startPos: number;
  onNodeSelected: (node: any) => void;
}) {
  if (!props.content || !props.content.content || !props.content.content.length)
    return null;

  const content = props.content.content!;

  if (content[0]!.isBlock) {
    let startPos = props.startPos + 1;
    return (
      <BlockNodeContentView>
        {content.map((childNode, index) => {
          const pos = startPos;
          startPos += childNode.nodeSize;
          return (
            <BlockNode
              key={index}
              node={childNode}
              colors={props.colors}
              onNodeSelected={props.onNodeSelected}
              startPos={pos}
            />
          );
        })}
      </BlockNodeContentView>
    );
  }

  let startPos = props.startPos;
  return (
    <BlockNodeContentViewWithInline>
      {content.map((childNode, index) => {
        const pos = startPos;
        startPos += childNode.nodeSize;
        return (
          <InlineNode
            key={index}
            index={index}
            node={childNode}
            bg={props.colors[childNode.type.name]!}
            onNodeSelected={props.onNodeSelected}
            startPos={pos}
          />
        );
      })}
    </BlockNodeContentViewWithInline>
  );
}

function InlineNode(props: {
  index: number;
  node: SerializableDocument;
  bg: string;
  onNodeSelected: (node: any) => void;
  startPos: number;
}) {
  const { node, bg, startPos, index } = props;
  const marks =
    node.marks?.length === 1
      ? ` - [${node.marks[0]!.type.name}]`
      : node.marks?.length! > 1
      ? ` - [${node.marks!.length} marks]`
      : "";
  return (
    <InlineNodeView onClick={() => props.onNodeSelected({ node })} bg={bg}>
      {index === 0 ? <Side>{startPos}</Side> : null}
      <Center>
        {node.type.name} {marks}
      </Center>
      <Side>{startPos + node.nodeSize}</Side>
    </InlineNodeView>
  );
}

function BlockNode(props: {
  colors: NodeColors;
  node: SerializableDocument;
  startPos: number;
  onNodeSelected: (node: any) => void;
}) {
  const { colors, node, startPos } = props;
  const color = colors[node.type.name];
  return (
    <BlockNodeWrapper>
      <BlockNodeView bg={color} onClick={() => props.onNodeSelected({ node })}>
        <Side>{startPos}</Side>
        <Center>{node.type.name}</Center>
        <Side>{startPos + node.nodeSize - 1}</Side>
      </BlockNodeView>
      <BlockNodeContent
        content={node}
        colors={colors}
        onNodeSelected={props.onNodeSelected}
        startPos={startPos}
      />
    </BlockNodeWrapper>
  );
}
