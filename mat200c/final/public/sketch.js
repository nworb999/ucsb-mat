import { Game } from "./models/game.js";

let game;

// instance mode workaround
const mySketch = (p) => {
  p.setup = () => {
    p.createCanvas(800, 800);
    let padding = 80;

    let squareSize = (p.width - padding * 4) / 3;
    let stallSize =
      (p.min(p.width - padding * 2, p.height - padding * 2 - squareSize) / 2) *
      0.5;

    const order = "random";
    const alignments = [{ name: "Type 1" }, { name: "Type 2" }];

    const leftTable = {
      position: {
        x: p.width / 4 - squareSize / 2,
        y: (2 * p.height) / 5 - squareSize / 2,
      },
      size: squareSize,
    };
    const rightTable = {
      position: {
        x: (3 * p.width) / 4 - squareSize / 2,
        y: (2 * p.height) / 5 - squareSize / 2,
      },
      size: squareSize,
    };
    const bathroom = {
      position: { x: p.width / 2, y: (5 * p.height) / 6 - stallSize / 2 },
      size: squareSize / 2,
    };

    game = new Game(p, order, alignments, leftTable, rightTable, bathroom);
    game.chooseSeats();
  };

  p.draw = () => {
    p.background(255);
    game.updateCharacters();
    // game.update();
    game.drawAll();
  };
};

new p5(mySketch);
