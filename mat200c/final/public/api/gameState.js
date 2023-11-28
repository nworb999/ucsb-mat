import express from "express";

const router = express.Router();

let game;

router.post("/start", (req, res) => {
  if (game) {
    game.startGame();
    res.json({ message: "Game started" });
  } else {
    res.status(400).json({ message: "Game not initialized" });
  }
});

router.get("/state", (req, res) => {
  if (game) {
    res.json(game.getState());
  } else {
    res.status(404).json({ message: "Game not started" });
  }
});

function setGame(gameInstance) {
  game = gameInstance;
}

export { router as default, setGame };
