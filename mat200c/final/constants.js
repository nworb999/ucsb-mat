const padding = 80;

const width = 800;
const height = 800;

export const squareSize = (width - padding * 4) / 3;
export const stallSize =
  (Math.min(width - padding * 2, height - padding * 2 - squareSize) / 2) * 0.5;

export const names = [
  "Clare",
  "Jerome",
  "Asuka",
  "Teresa",
  "Miria",
  "Rem",
  "Smith",
  "Scarecrow",
  "L",
];
export const order = "random";
export const alignments = [{ name: "Type 1" }, { name: "Type 2" }];

export const leftTable = {
  position: {
    x: width / 4 - squareSize / 2,
    y: (2 * height) / 5 - squareSize / 2,
  },
  size: squareSize,
};
export const rightTable = {
  position: {
    x: (3 * width) / 4 - squareSize / 2,
    y: (2 * height) / 5 - squareSize / 2,
  },
  size: squareSize,
};
export const bathroom = {
  position: { x: width / 2, y: (5 * height) / 6 - stallSize / 2 },
  size: squareSize / 2,
};
