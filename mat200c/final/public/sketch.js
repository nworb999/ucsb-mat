import Draw from "./draw.js";

let draw;
let gameState = { memory: {}, characters: [] };
let fetchInterval = 50;
let previousGameState = "";

startGame();

const mySketch = (p) => {
  p.setup = () => {
    p.createCanvas(800, 800);
    draw = new Draw(p);
    refreshGameMemory();
    setInterval(fetchGameState, fetchInterval);
  };

  p.draw = () => {
    p.background(255);
    if (gameState.leftTable && gameState.rightTable && gameState.toilet) {
      draw.furniture(gameState);
    }
    if (gameState.characters) {
      draw.characters(gameState.characters);
    }
  };
};

function startGame() {
  fetch("/api/game/start", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
}

// when conversing, wait til conversing, then read memory !  which will continue converstation and thus the game

function refreshGameMemory() {
  readMemoryData();
  setGameMemory(gameState.memory);
}

function fetchGameState() {
  fetch("/api/game/state")
    .then((response) => response.json())
    .then((data) => {
      gameState = data;
      // detect game state change
      if (
        gameState.state === "choosingSeats" &&
        previousGameState === "conversing"
      ) {
        storeCharacterMemory(gameState.memory);
      }
      if (
        gameState.state === "conversing" &&
        previousGameState === "choosingSeats"
      ) {
        console.log("refreshing game memory in sketch");
        refreshGameMemory();
        startGame();
      }

      previousGameState = gameState.state;
    })
    .catch((error) => console.error("Error fetching game state:", error));
}

function setGameMemory(memory) {
  console.log("setting this ", memory);
  fetch("/api/game/remember", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ memory }),
  })
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error));
}

function storeCharacterMemory(memory) {
  console.log("storeCharacterMemory", memory);
  fetch("/api/memory/store", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      memory,
    }),
  })
    .then((response) => {
      if (response.status === 304) {
        console.log("No new memory to store");
        return null; // No content to parse
      } else {
        return response.json();
      }
    })
    .then((data) => console.log("Memory stored for character", data))
    .catch((error) => console.error("Error storing memory:", error));
}

function readMemoryData() {
  fetch("/api/memory/retrieve", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      characters: gameState.characters,
    }),
  })
    .then((response) => response.json())
    .then((memoryData) => {
      console.log("readMemoryData", memoryData);
      gameState.memory = memoryData;
    })
    .catch((error) => console.error("Error fetching memory:", error));
}

new p5(mySketch);
