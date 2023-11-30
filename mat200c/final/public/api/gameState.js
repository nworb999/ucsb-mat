import express from "express";

const router = express.Router();

let game;

router.post("/start", (req, res) => {
  if (game) {
    console.log(`${new Date().toISOString()} :: starting game`);
    game.startGame();
    res.json({ message: "game started" });
  } else {
    res.status(400).json({ message: "game not started " });
  }
});

router.post("/remember", (req, res) => {
  if (game) {
    console.log(
      `${new Date().toISOString()} :: setting memory : `,
      req.body.memory
    );
    game.setMemory(req.body.memory);
    res.json({ message: "memory set" });
  } else {
    res.status(400).json({ message: "memory not set" });
  }
});

router.get("/state", (req, res) => {
  if (game) {
    res.json(game.getState());
  } else {
    res.status(404).json({ message: "game state not fetched" });
  }
});

function setGame(gameInstance) {
  game = gameInstance;
}

export { router as default, setGame };
