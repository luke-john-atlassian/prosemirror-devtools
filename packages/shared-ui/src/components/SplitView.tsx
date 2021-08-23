import styled from "@emotion/styled";

export const SplitView = styled.div`
  display: flex;
  height: 100%;
`;

type SplitViewColProps = {
  grow?: boolean;
  sep?: boolean;
  noPaddings?: boolean;
  minWidth?: number;
  maxWidth?: number;
};
export const SplitViewCol = styled.div<SplitViewColProps>`
  box-sizing: border-box;
  height: 100%;
  overflow: scroll;

  ${({ grow, sep, noPaddings, minWidth, maxWidth }) => ({
    flexGrow: grow ? 1 : 0,
    borderLeft: sep ? `1px solid #cacdd1` : "none",
    padding: noPaddings ? "" : "16px 18px 18px",
    minWidth: minWidth ? `${minWidth}px` : "none",
    maxWidth: maxWidth ? `${maxWidth}px` : "none",
  })}
`;
