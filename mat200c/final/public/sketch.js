import Draw from "./draw.js";

let draw;
let gameState = { characters: [], outcomes: [] };
let memory = {};
let fetchInterval = 50;
let previousGameState = "";

const mySketch = (p) => {
  p.setup = () => {
    p.createCanvas(800, 800);
    draw = new Draw(p);
    startGame();
    setInterval(fetchGameState, fetchInterval);
  };

  p.draw = () => {
    p.background(255);
    drawGameState(p);
  };
};

// api calls
function startGame() {
  fetch("/api/game/start", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
}

function fetchGameState() {
  fetch("/api/game/state")
    .then((response) => response.json())
    .then((data) => {
      gameState = data;
      handleGameState(gameState);
      previousGameState = gameState.state;
    })
    .catch((error) => console.error("Error fetching game state:", error));
}

function setGameMemory(memory) {
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

function storeNewMemories(outcomes) {
  fetch("/api/memory/store", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      outcomes,
    }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => console.log("memory stored"))
    .catch((error) => console.error("Error storing memory:", error));
}

function readMemoryData() {
  fetch("/api/memory/retrieve")
    .then((response) => response.json())
    .then((memoryData) => {
      console.log("retrieving memory data");
      memory = memoryData;
    })
    .catch((error) => console.error("Error fetching memory:", error));
}

// handling functions
function refreshGameMemory() {
  readMemoryData();
  setGameMemory(memory);
}

function handleGameState() {
  if (
    gameState.state === "choosingSeats" &&
    previousGameState === "conversing" &&
    gameState.outcomes.length
  ) {
    storeNewMemories(gameState.outcomes);
  }
  if (
    gameState.state === "conversing" &&
    previousGameState === "choosingSeats"
  ) {
    if (gameState.turn !== 1) {
      console.log("refreshing game memory in sketch");
      refreshGameMemory();
    }
    startGame();
  }
}

function drawGameState(p) {
  if (gameState.leftTable && gameState.rightTable && gameState.toilet) {
    draw.furniture(gameState);
  }
  if (gameState.characters) {
    draw.characters(gameState.characters);
  }
}

new p5(mySketch);
