import { Toilet, Table } from "./models/furniture.js";

let game;
function setup() {
  createCanvas(800, 800);
  background(0);

  let padding = 80;
  let squareSize = (width - padding * 4) / 3;
  let stallSize =
    (min(width - padding * 2, height - padding * 2 - squareSize) / 2) * 0.5;

  const order = "random";
  const alignments = [{ name: "Type 1" }, { name: "Type 2" }];
  const leftTable = {
    x: width / 4 - squareSize / 2,
    y: (2 * height) / 5 - squareSize / 2,
    size: squareSize,
  };
  const rightTable = {
    x: (3 * width) / 4 - squareSize / 2,
    y: (2 * height) / 5 - squareSize / 2,
    size: squareSize,
  };
  const bathroom = {
    centerX: width / 2,
    centerY: (5 * height) / 6 - stallSize / 2,
    stallSize: 50,
  };

  toilet = new Toilet(bathroom);

  game = new Game(order, alignments, leftTable, rightTable, bathroom);

  // game.chooseSeats();
}

function draw() {
  // background(255);
  // game.drawFurniture();
  // game.updateCharacters();
}
