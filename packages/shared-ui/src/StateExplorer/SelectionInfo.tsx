import * as React from "react";
import styled from "@emotion/styled";

import { ObjectInspector } from "react-inspector";

import { useDocumentContext } from "./DocumentContext";

const InfoContainer = styled.div`
  font-family: sans-serif;
  /* display: flex; */
  font-size: 0.8rem;

  & > :first-of-type {
    display: block;
    margin-block-end: 0.5rem;
  }
`;

export function SelectionInfo() {
  const { selection } = useDocumentContext();
  if (!selection || !Object.keys(selection).length) {
    return null;
  }
  return (
    <InfoContainer>
      <strong>Selection</strong> <ObjectInspector data={selection} />
    </InfoContainer>
  );
}
