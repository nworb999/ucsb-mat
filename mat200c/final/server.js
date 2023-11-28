import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { Game } from "./public/models/game.js";
import gameStateRouter, { setGame } from "./public/api/gameState.js";
import memory from "./public/api/memory.js";
import {
  order,
  alignments,
  names,
  leftTable,
  rightTable,
  bathroom,
} from "./constants.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const port = 3000;

const game = new Game(
  order,
  alignments,
  names,
  leftTable,
  rightTable,
  bathroom
);
setGame(game);

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("requestUpdate", () => {
    socket.emit("gameState", { gameState: game.getState() });
  });

  // Handle other game events...
});

app.use(express.json());
app.use("/api/memory", memory);
app.use("/api/game", gameStateRouter);

app.use(express.static("public"));

httpServer.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
