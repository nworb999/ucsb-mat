function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();
}

function draw() {
  background(255);

  let padding = 80;
  let squareSize = (width - padding * 4) / 3;
  drawTable(
    width / 4 - squareSize / 2,
    (2 * height) / 5 - squareSize / 2,
    squareSize
  );
  drawTable(
    (3 * width) / 4 - squareSize / 2,
    (2 * height) / 5 - squareSize / 2,
    squareSize
  );

  let stallSize =
    (min(width - padding * 2, height - padding * 2 - squareSize) / 2) * 0.5; // Further reduced stall size
  drawToilet(width / 2, (5 * height) / 6 - stallSize / 2, stallSize);
}
