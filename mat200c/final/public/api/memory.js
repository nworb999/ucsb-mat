import express from "express";
import { retrieveMemories, storeMemories } from "./utils.js";

const router = express.Router();

router.get("/retrieve", (req, res) => {
  console.log(
    `${new Date().toISOString()} :: retrieving character memories`,
    req.body.characters
  );
  const characters = req.body.characters;
  const allConversations = retrieveMemories(characters);

  res.json(allConversations);
});

router.post("/store", (req, res) => {
  const memories = req.body.memory;

  console.log(`${new Date().toISOString()} :: storing character memories`);

  storeMemories(memories);

  res.json({ message: "Memories stored successfully" });
});

export default router;
