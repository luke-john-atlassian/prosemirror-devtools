const nodesColors = [
  "#EA7C7F", // red
  "#67B0C6", // cyan 400
  "#94BB7F", // green
  "#CA9EDB", // deep purple
  "#DCDC5D", // lime
  "#B9CC7C", // light green
  "#DD97D8", // purple
  "#FFB761", // orange
  "#4D8FD1", // light blue
  "#F36E98", // pink
  "#E45F44", // deep orange
  "#A6A4AE", // blue grey
  "#FCC047", // yellow
  "#FFC129", // amber
  "#D3929C", // can can
  "#4CBCD4", // cyan
  "#8D7BC0", // indigo
];

function calculateSafeIndex(index: number, total: number) {
  const quotient = index / total;
  return Math.round(total * (quotient - Math.floor(quotient)));
}

export type NodeColors = {
  [key: string]: string;
};

export function buildColors(schema: any) {
  const colors = Object.keys(schema.nodes).reduce<NodeColors>(
    (acc, node, index) => {
      const safeIndex =
        index >= nodesColors.length
          ? calculateSafeIndex(index, nodesColors.length)
          : index;

      acc[node] = nodesColors[safeIndex]!;

      return acc;
    },
    {}
  );

  return colors;
}
