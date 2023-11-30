import express from "express";
import { createServer } from "http";
import { Game } from "./public/models/game.js";
import gameStateRouter, { setGame } from "./public/api/gameState.js";
import memory from "./public/api/memory.js";
import {
  order,
  alignments,
  leftTable,
  rightTable,
  bathroom,
} from "./constants.js";

const app = express();
const httpServer = createServer(app);
const port = 3000;
const updateInterval = 50;

// should the domain model layer be in this server.js file at all or should it only make API calls?
const game = new Game(order, alignments, leftTable, rightTable, bathroom);
setGame(game);

setInterval(() => {
  game.update();
}, updateInterval);

app.use(express.json());
app.use("/api/memory", memory);
app.use("/api/game", gameStateRouter);

app.use(express.static("public"));

httpServer.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
