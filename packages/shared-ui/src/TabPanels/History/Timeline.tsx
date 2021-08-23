import React from "react";
import styled from "@emotion/styled";

const ListContainer = styled.div`
  width: 100%;
  max-width: 100%;
  overflow-y: scroll;
`;

const List = styled.ol`
  padding: 0;
  margin: 0;
  width: 100%;

  > li:nth-child(odd) button {
    background: #f5f5f5;
  }

  > li:nth-child(even) button {
    background: #ffffff;
  }

  > li {
    margin: 0;
    width: 100%;

    > button {
      text-align: left;
      width: 100%;
      height: 21px;
      border: none;
      font-size: 12px;
      padding: 1px 4px;

      :hover {
        background: rgba(235, 242, 252, 0.7);
        cursor: pointer;
      }
    }
  }
`;

export function Timeline({
  entries,
  selectedIndex,
  updateSelectedIndex,
}: {
  entries: number[];
  selectedIndex: number;
  updateSelectedIndex: (selectedIndex: number) => void;
}) {
  return (
    <ListContainer>
      <List>
        {entries.map((entry, index) => {
          const date = new Date(entry);

          return (
            <li data-selected={selectedIndex === index} key={entry}>
              <button onClick={(event) => updateSelectedIndex(index)}>
                {date.toLocaleTimeString()}.{date.getMilliseconds()}
              </button>
            </li>
          );
        })}
      </List>
    </ListContainer>
  );
}
