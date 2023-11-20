import { Toilet, Table } from "./models/furniture.js";
import { Game } from "./models/game.js";

let game, toilet;

// instance mode workaround
const mySketch = (p) => {
  p.setup = () => {
    p.createCanvas(800, 800).background(100);
    let padding = 80;

    let squareSize = (p.width - padding * 4) / 3;
    let stallSize =
      (p.min(p.width - padding * 2, p.height - padding * 2 - squareSize) / 2) *
      0.5;

    const order = "random";
    const alignments = [{ name: "Type 1" }, { name: "Type 2" }];

    const leftTable = {
      x: p.width / 4 - squareSize / 2,
      y: (2 * p.height) / 5 - squareSize / 2,
      size: squareSize,
    };
    const rightTable = {
      x: (3 * p.width) / 4 - squareSize / 2,
      y: (2 * p.height) / 5 - squareSize / 2,
      size: squareSize,
    };
    const bathroom = {
      centerX: p.width / 2,
      centerY: (5 * p.height) / 6 - stallSize / 2,
      stallSize: 50,
    };

    toilet = new Toilet(bathroom);

    game = new Game(order, alignments, leftTable, rightTable, bathroom);

    game.chooseSeats();
  };

  p.draw = () => {
    //   // background(255);
    //   // game.drawFurniture();
    //   // game.updateCharacters();
  };
};

new p5(mySketch);
