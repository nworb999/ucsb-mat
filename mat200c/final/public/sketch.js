// Assuming Socket.IO client library is loaded in your HTML

import Draw from "./draw.js"; // Assuming you have draw.js in the public directory

let draw;
let gameState = {};
let socket;
let fetchInterval = 5000;

const mySketch = (p) => {
  p.setup = () => {
    p.createCanvas(800, 800);

    draw = new Draw(p); // Initialize the Draw class with p5 instance

    startGame(); // Start the game

    socket = io.connect(window.location.origin);
    socket.emit("requestUpdate");

    socket.on("gameState", (newGameState) => {
      console.log(newGameState);
      gameState = newGameState;
    });

    // Set up an interval to fetch the game state
    setInterval(fetchGameState, fetchInterval);
  };

  p.draw = () => {
    p.background(255);
    if (gameState.characters) {
      draw.characters(gameState.characters);
    }
    if (gameState.leftTable && gameState.rightTable && gameState.toilet) {
      draw.furniture(gameState);
    }
  };
};

function startGame() {
  fetch("/api/game/start", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => console.log(data.message))
    .catch((error) => console.error("Error:", error));
}

function fetchGameState() {
  fetch("/api/game/state")
    .then((response) => response.json())
    .then((data) => {
      gameState = data;
    })
    .catch((error) => console.error("Error fetching game state:", error));
}

new p5(mySketch);
