import Draw from "./services/draw.js";
import { prompt } from "./services/chat.js";
import {
  startGame,
  fetchGameState,
  drawGameState,
} from "./services/gameState.js";

let fetchInterval = 50;
let draw;

// Function to initialize the sketch with async data
async function initSketch() {
  try {
    const response = await prompt("name some colors");
    console.log("Response from server:", response);

    // Now initialize the p5 sketch with the response
    new p5((p) => mySketch(p, response));
  } catch (error) {
    console.error("Error initializing sketch:", error);
  }
}

const mySketch = (p, serverResponse) => {
  p.setup = () => {
    p.createCanvas(800, 800);
    draw = new Draw(p);
    startGame();
    fetchGameState();
    setInterval(fetchGameState, fetchInterval);
  };

  p.draw = () => {
    p.background(255);
    drawGameState(draw);
  };
};

initSketch();
