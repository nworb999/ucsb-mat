import Draw from "./services/draw.js";
import {
  startGame,
  fetchGameState,
  drawGameState,
} from "./services/gameState.js";

let fetchInterval = 50;
let draw;

const mySketch = (p) => {
  p.setup = () => {
    p.createCanvas(800, 800);
    draw = new Draw(p);
    startGame();
    setInterval(fetchGameState, fetchInterval);
  };

  p.draw = () => {
    p.background(255);
    drawGameState(draw);
  };
};

new p5(mySketch);
